import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';

import { AppText } from '@/components/AppText';
import { useAppTheme } from '@/hooks/use-app-theme';
import { addItem, getGathering, unclaimItem, claimItem } from '@/features/friendsgiving/mock-api';
import { useSignalR } from '@/hooks/use-signalr';
import type { DishItem, GatheringWithItems } from '@/features/friendsgiving/types';

const GUEST_KEY_PREFIX = 'friendsgiving:guest:';
const SETTINGS_FALLBACK_ID = 'friendsgiving-2026';

// AddDishModal - extracted to module scope
const AddDishModal = ({
  visible,
  onClose,
  onAdd,
  dishName,
  onDishNameChange,
  dishEmoji,
  onDishEmojiChange,
}: {
  visible: boolean;
  onClose: () => void;
  onAdd: () => void;
  dishName: string;
  onDishNameChange: (text: string) => void;
  dishEmoji: string;
  onDishEmojiChange: (text: string) => void;
}) => {
  const { colors } = useAppTheme();

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={modalStyles.modal}>
        <View style={[modalStyles.content, { backgroundColor: colors.surface }]}>
          <AppText style={modalStyles.title}>Add a Dish</AppText>
          <TextInput
            placeholder="Dish name"
            value={dishName}
            onChangeText={onDishNameChange}
            style={[modalStyles.input, { backgroundColor: colors.surface, borderColor: colors.border }]}
            autoFocus
          />
          <TextInput
            placeholder="Emoji (optional)"
            value={dishEmoji}
            onChangeText={onDishEmojiChange}
            style={[modalStyles.input, { backgroundColor: colors.surface, borderColor: colors.border }]}
          />
          <View style={modalStyles.buttonRow}>
            <Pressable style={modalStyles.cancelButton} onPress={onClose}>
              <AppText style={modalStyles.cancelButtonText}>Cancel</AppText>
            </Pressable>
            <Pressable style={modalStyles.addButton} onPress={onAdd}>
              <AppText style={modalStyles.addButtonText}>Add</AppText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// DishItemRow - extracted to module scope
const DishItemRow = ({
  item,
  onClaim,
  onUnclaim,
  isMine,
}: {
  item: DishItem;
  onClaim: (itemId: string) => void;
  onUnclaim: (itemId: string) => void;
  isMine: boolean;
}) => {
  const { colors } = useAppTheme();
  const isClaimed = item.isClaimed ?? false;
  const claimedBy = item.claimedBy ?? null;

  return (
    <View style={[rowStyles.item, { borderBottomColor: colors.border }]} key={item.id}>
      <View style={rowStyles.info}>
        <Text style={isClaimed ? rowStyles.claimedName : rowStyles.unclaimedName}>
          {item.name}
        </Text>
        <Text style={rowStyles.emoji}>{item.emoji}</Text>
      </View>
      <View style={rowStyles.status}>
        {isClaimed ? (
          <Text style={rowStyles.claimedBy}>{claimedBy}</Text>
        ) : (
          <Pressable style={[rowStyles.claimButton, { backgroundColor: colors.primary }]} onPress={() => onClaim(item.id)}>
            <AppText style={rowStyles.claimButtonText}>Claim</AppText>
          </Pressable>
        )}
        {isMine && isClaimed && (
          <Pressable style={[rowStyles.unclaimButton, { backgroundColor: colors.danger }]} onPress={() => onUnclaim(item.id)}>
            <AppText style={rowStyles.unclaimButtonText}>Unclaim</AppText>
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default function FriendsgivingPage() {
  const params = useLocalSearchParams();
  const gatheringId = Array.isArray(params?.gatheringId) ? params.gatheringId[0] : params?.gatheringId;
  const activeId = gatheringId || SETTINGS_FALLBACK_ID;

  const { colors } = useAppTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gathering, setGathering] = useState<GatheringWithItems | null>(null);
  const [guestName, setGuestName] = useState('');
  const [addDishOpen, setAddDishOpen] = useState(false);
  const [newDishName, setNewDishName] = useState('');
  const [newDishEmoji, setNewDishEmoji] = useState('');
  const { connection } = useSignalR(activeId);

  const loadGuestName = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(`${GUEST_KEY_PREFIX}${activeId}`);
      if (raw) setGuestName(raw);
    } catch {
      // storage unavailable — fine
    }
  }, [activeId]);

  const saveGuestName = useCallback(
    async (name: string) => {
      setGuestName(name);
      try {
        await AsyncStorage.setItem(`${GUEST_KEY_PREFIX}${activeId}`, name);
      } catch {
        // storage unavailable — fine
      }
    },
    [activeId],
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [g] = await Promise.all([
          getGathering(activeId),
          loadGuestName(),
        ]);
        if (!mounted) return;
        setGathering(g);
      } catch {
        if (mounted) setError('This gathering table came up empty. 🥹');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [activeId, loadGuestName]);

  // SignalR live update: when a dish is claimed from another device
  useEffect(() => {
    if (!gathering || !connection) return;

    const handleDishClaimed = (dishId: string, claimedBy: string, claimedAt: string) => {
      setGathering((g) => {
        if (!g) return g;
        const items = g.items.map((item) => {
          if (item.id === dishId && !item.isClaimed) {
            return {
              ...item,
              isClaimed: true,
              claimedBy,
              claimedAt,
            };
          }
          return item;
        });
        return { ...g, items };
      });
    };

    const handleDishUnclaimed = (dishId: string) => {
      setGathering((g) => {
        if (!g) return g;
        const items = g.items.map((item) => {
          if (item.id === dishId && item.isClaimed) {
            return {
              ...item,
              isClaimed: false,
              claimedBy: null,
              claimedAt: null,
            };
          }
          return item;
        });
        return { ...g, items };
      });
    };

    const handleTableUpdated = async () => {
      // Refetch the gathering data to ensure consistency
      try {
        const fresh = await getGathering(activeId ?? SETTINGS_FALLBACK_ID);
        setGathering(fresh);
      } catch (e) {
        console.warn('Failed to refetch table:', e);
      }
    };

    if (connection) {
      connection.on('OnDishClaimed', handleDishClaimed);
      connection.on('OnDishUnclaimed', handleDishUnclaimed);
      connection.on('OnTableUpdated', handleTableUpdated);
    }

    return () => {
      if (connection) {
        connection.off('OnDishClaimed', handleDishClaimed);
        connection.off('OnDishUnclaimed', handleDishUnclaimed);
        connection.off('OnTableUpdated', handleTableUpdated);
      }
    };
  }, [gathering, connection, activeId]);

  const items = useMemo(() => gathering?.items ?? [], [gathering]);

  const claimedCount = useMemo(
    () => items.filter((i) => i.isClaimed).length,
    [items],
  );

  const isMine = useCallback(
    (item: DishItem) =>
      !!item.claimedBy &&
      item.claimedBy.trim().toLowerCase() === guestName.trim().toLowerCase(),
    [guestName],
  );

  const handleClaimItem = useCallback(
    async (itemId: string) => {
      if (!gathering) return;
      const name = guestName.trim() || 'Guest';
      await claimItem(activeId ?? SETTINGS_FALLBACK_ID, itemId, {
        guestName: name,
      });
      setGathering((g) => {
        if (!g) return g;
        const items = g.items.map((item) => {
          if (item.id === itemId) {
            return {
              ...item,
              isClaimed: true,
              claimedBy: name,
              claimedAt: new Date().toISOString(),
            };
          }
          return item;
        });
        return { ...g, items };
      });
    },
    [gathering, guestName, activeId],
  );

  const handleUnclaimItem = useCallback(
    async (itemId: string) => {
      if (!gathering) return;
      await unclaimItem(activeId ?? SETTINGS_FALLBACK_ID, itemId);
      setGathering((g) => {
        if (!g) return g;
        const items = g.items.map((item) => {
          if (item.id === itemId) {
            return {
              ...item,
              isClaimed: false,
              claimedBy: null,
              claimedAt: null,
            };
          }
          return item;
        });
        return { ...g, items };
      });
    },
    [gathering, activeId],
  );

  const handleAddDish = useCallback(async () => {
    if (!gathering || !newDishName.trim()) return;
    const name = guestName.trim() || 'Guest';
    const created = await addItem(gathering.id, {
      name: newDishName,
      category: 'other',
      emoji: newDishEmoji || '🍽️',
    });
    const claimed: DishItem = {
      ...created,
      claimedBy: name,
      isClaimed: true,
      claimedAt: new Date().toISOString(),
    };
    setGathering((g) => (g ? { ...g, items: [...g.items, claimed] } : g));
    setNewDishName('');
    setNewDishEmoji('');
    setAddDishOpen(false);
  }, [gathering, guestName, newDishName, newDishEmoji]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {error && <Text style={styles.error}>{error}</Text>}

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <>
          <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
            <AppText style={styles.headerTitle}>What do you bring to the table?</AppText>
            <AppText style={styles.headerSubtitle}>{gathering?.name || ''}</AppText>
          </View>

          <View style={[styles.gatheringCard, { backgroundColor: colors.card }]}>
            <AppText style={styles.cardTitle}>The table so far</AppText>
            <ScrollView contentContainerStyle={styles.list}>
              {items.map((item) => (
                <DishItemRow
                  key={item.id}
                  item={item}
                  onClaim={handleClaimItem}
                  onUnclaim={handleUnclaimItem}
                  isMine={isMine(item)}
                />
              ))}
            </ScrollView>
          </View>

          <View style={styles.inputRow}>
            <TextInput
              placeholder="Your name"
              value={guestName}
              onChangeText={saveGuestName}
              style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border }]}
            />
            <Pressable style={[styles.addButton, { backgroundColor: colors.primary }]} onPress={() => setAddDishOpen(true)}>
              <AppText style={styles.addButtonText}>Add Dish</AppText>
            </Pressable>
          </View>

          <AddDishModal
            visible={addDishOpen}
            onClose={() => setAddDishOpen(false)}
            onAdd={handleAddDish}
            dishName={newDishName}
            onDishNameChange={setNewDishName}
            dishEmoji={newDishEmoji}
            onDishEmojiChange={setNewDishEmoji}
          />

          <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
            <AppText style={styles.footerText}>
              {claimedCount} claimed · {items.length - claimedCount} remaining
            </AppText>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  error: {
    color: '#e53e3e',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
  header: {
    padding: 24,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  gatheringCard: {
    padding: 20,
    borderRadius: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  list: {
    flexGrow: 1,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 0,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  addButton: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

const rowStyles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
  },
  info: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  unclaimedName: {
    fontSize: 16,
  },
  claimedName: {
    fontSize: 16,
    textDecorationLine: 'line-through',
  },
  emoji: {
    fontSize: 24,
    marginHorizontal: 8,
  },
  status: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    minWidth: 80,
    gap: 4,
  },
  claimedBy: {
    fontSize: 12,
  },
  claimButton: {
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  claimButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  unclaimButton: {
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  unclaimButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
});

const modalStyles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    borderRadius: 12,
    width: '80%',
    maxHeight: '80%',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontWeight: '600',
  },
  addButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});