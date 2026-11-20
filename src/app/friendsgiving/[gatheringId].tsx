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
import { addItem, getGathering } from '@/features/friendsgiving/mock-api';
import type { DishItem, GatheringWithItems } from '@/features/friendsgiving/types';

const GUEST_KEY_PREFIX = 'friendsgiving:guest:';
const SETTINGS_FALLBACK_ID = 'friendsgiving-2026';

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
        const [g] = await Promise.all([getGathering(activeId), loadGuestName()]);
        if (mounted) setGathering(g);
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

  const items = useMemo(() => gathering?.items ?? [], [gathering]);

  const claimedCount = useMemo(
    () => items.filter((i) => i.claimedBy?.guestName).length,
    [items],
  );

  const isMine = useCallback(
    (item: DishItem) =>
      !!item.claimedBy?.guestName &&
      item.claimedBy.guestName.trim().toLowerCase() === guestName.trim().toLowerCase(),
    [guestName],
  );

  const handleAddDish = useCallback(
    async (payload: { name: string; emoji: string }) => {
      if (!gathering) return;
      const name = guestName.trim() || 'Guest';
      const created = await addItem(gathering.id, {
        name: payload.name,
        category: 'other',
        emoji: payload.emoji,
      });
      const claimed: DishItem = {
        ...created,
        claimedBy: {
          id: `claim-${created.id}`,
          dishItemId: created.id,
          guestName: name,
          claimedAt: new Date().toISOString(),
        },
      };
      setGathering((g) => (g ? { ...g, items: [...g.items, claimed] } : g));
      setAddDishOpen(false);
    },
    [gathering, guestName],
  );

  const formattedDate = useMemo(() => {
    if (!gathering) return '';
    const d = new Date(gathering.date);
    if (Number.isNaN(d.getTime())) return gathering.date;
    return d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
  }, [gathering]);

  if (loading) {
    return (
      <View style={styles.fullScreen}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (error || !gathering) {
    return (
      <View style={styles.fullScreen}>
        <AppText style={styles.errorText}>{error ?? 'Something went wrong.'}</AppText>
      </View>
    );
  }

  return (
    <View style={styles.fullScreen}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.turkeyEmoji}>🦃</Text>
          <AppText style={styles.title}>Friendsgiving</AppText>
          <AppText style={styles.subtitle}>What do you bring to the table?</AppText>
        </View>

        <View style={styles.card}>
          <AppText style={styles.gatheringName}>{gathering.name}</AppText>
          <AppText style={styles.gatheringMeta}>{formattedDate}</AppText>
          <AppText style={styles.gatheringMeta}>Hosted by {gathering.hostName}</AppText>
        </View>

        <View style={styles.card}>
          <AppText style={styles.sectionTitle}>The table so far</AppText>
          <AppText style={styles.sectionSub}>
            {claimedCount} {claimedCount === 1 ? 'dish' : 'dishes'} claimed · add yours below
          </AppText>

          <TextInput
            style={styles.input}
            placeholder="Your name"
            placeholderTextColor="#8C6D4F"
            value={guestName}
            onChangeText={setGuestName}
            onBlur={() => guestName.trim() && saveGuestName(guestName.trim())}
            autoCapitalize="words"
            autoCorrect={false}
          />

          {items.length > 0 ? (
            <View style={styles.itemsList}>
              {items.map((item) => {
                const mine = isMine(item);
                return (
                  <View key={item.id} style={[styles.itemRow, mine && styles.itemMine]}>
                    <Text style={styles.itemEmoji}>{item.emoji}</Text>
                    <AppText style={[styles.itemName, mine && styles.itemMineName]} numberOfLines={2}>
                      {item.name}
                    </AppText>
                    <AppText style={[styles.itemBy, mine && styles.itemByMine]}>
                      {mine ? "✨ You're bringing this!" : `🧑‍🍳 ${item.claimedBy?.guestName ?? 'Up for grabs'}`}
                    </AppText>
                  </View>
                );
              })}
            </View>
          ) : (
            <AppText style={styles.emptyState}>No dishes claimed yet — be the first!</AppText>
          )}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <Pressable style={styles.addButton} onPress={() => setAddDishOpen(true)}>
        <AppText style={styles.addButtonText}>+ Add a dish</AppText>
      </Pressable>

      <Modal transparent visible={addDishOpen} animationType="slide" onRequestClose={() => setAddDishOpen(false)}>
        <AddDishModal
          guestName={guestName.trim()}
          onClose={() => setAddDishOpen(false)}
          onAdd={handleAddDish}
        />
      </Modal>
    </View>
  );
}

function AddDishModal({
  guestName,
  onClose,
  onAdd,
}: {
  guestName: string;
  onClose: () => void;
  onAdd: (payload: { name: string; emoji: string }) => Promise<void>;
}) {
  const { colors } = useAppTheme();
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🍽️');
  const [busy, setBusy] = useState(false);
  const canSubmit = !!name.trim() && !!guestName && !busy;

  const submit = async () => {
    const trimmed = name.trim();
    if (!trimmed || !guestName) return;
    setBusy(true);
    try {
      await onAdd({ name: trimmed, emoji });
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalCard}>
        <AppText style={styles.modalTitle}>Add a dish to the feast 🍽️</AppText>
        {!guestName ? (
          <AppText style={styles.modalHint}>Add your name at the top of the page first. 🥰</AppText>
        ) : (
          <AppText style={styles.modalHint}>Bringing it: {guestName}</AppText>
        )}
        <TextInput
          style={styles.modalInput}
          placeholder="What's cooking? (e.g. Grandma's lasagna)"
          placeholderTextColor="#8C6D4F"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          autoCorrect={false}
        />
        <View style={styles.emojiRow}>
          {['🍝', '🥘', '🥗', '🥧', '🍪', '🥛', '🍷', '🥨', '🧀', '🥔'].map((e) => (
            <Pressable key={e} onPress={() => setEmoji(e)} style={[styles.emojiChip, emoji === e && styles.emojiChipActive]}>
              <Text style={styles.emojiChipText}>{e}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.modalActions}>
          <Pressable style={[styles.modalButton, styles.modalButtonCancel]} onPress={onClose}>
            <AppText style={styles.modalButtonText}>Cancel</AppText>
          </Pressable>
          <Pressable
            style={[styles.modalButton, styles.modalButtonPrimary, { backgroundColor: colors.primary, borderColor: colors.primary }]}
            onPress={submit}
            disabled={!canSubmit}
          >
            <AppText style={[styles.modalButtonText, { color: colors.onAccent }]}>{busy ? 'Adding…' : 'Add dish'}</AppText>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: { flex: 1, backgroundColor: '#FFF8F0' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 90 },
  header: { alignItems: 'center', marginBottom: 24 },
  turkeyEmoji: { fontSize: 64, marginBottom: 8 },
  title: { fontSize: 40, fontWeight: '900', letterSpacing: -0.5, color: '#C2410C', textAlign: 'center' },
  subtitle: { fontSize: 18, fontWeight: '700', color: '#C2410C', textAlign: 'center', marginTop: 4 },
  card: { borderRadius: 20, borderWidth: 1, borderColor: '#EEDCC8', padding: 16, marginBottom: 16, backgroundColor: '#ffffff' },
  gatheringName: { fontSize: 22, fontWeight: '800', color: '#242B32' },
  gatheringMeta: { fontSize: 14, fontWeight: '500', color: '#8C6D4F', marginTop: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#C2410C' },
  sectionSub: { fontSize: 13, fontWeight: '600', color: '#8C6D4F', marginTop: 2, marginBottom: 12 },
  input: { borderRadius: 12, borderWidth: 1, borderColor: '#EEDCC8', backgroundColor: '#FFFBF5', color: '#242B32', paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, fontWeight: '500' },
  itemsList: { gap: 10, marginTop: 12 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 12, borderWidth: 1, borderColor: '#EEDCC8', padding: 10, backgroundColor: '#FFFBF5' },
  itemMine: { borderColor: '#C2410C', backgroundColor: '#FFE8D6' },
  itemEmoji: { fontSize: 24 },
  itemName: { fontSize: 14, fontWeight: '700', color: '#242B32', flex: 1 },
  itemMineName: { color: '#C2410C' },
  itemBy: { fontSize: 12, fontWeight: '600', color: '#8C6D4F' },
  itemByMine: { color: '#C2410C' },
  emptyState: { fontSize: 13, fontWeight: '600', color: '#8C6D4F', textAlign: 'center', marginTop: 10 },
  addButton: { position: 'absolute', bottom: 32, right: 20, borderRadius: 999, paddingHorizontal: 18, paddingVertical: 14, backgroundColor: '#C2410C', shadowColor: '#C2410C', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 6 },
  addButtonText: { fontSize: 15, fontWeight: '800', color: '#ffffff' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(20,10,5,0.45)', justifyContent: 'flex-end' },
  modalCard: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 30, backgroundColor: '#ffffff' },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#242B32', marginBottom: 8 },
  modalHint: { fontSize: 13, fontWeight: '600', color: '#8C6D4F', marginBottom: 12 },
  modalInput: { borderRadius: 12, borderWidth: 1, borderColor: '#EEDCC8', backgroundColor: '#FFFBF5', color: '#242B32', paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, fontWeight: '500', marginBottom: 12 },
  emojiRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 },
  emojiChip: { borderRadius: 999, paddingHorizontal: 8, paddingVertical: 6, borderWidth: 1, borderColor: '#EEDCC8', backgroundColor: '#FFFBF5' },
  emojiChipActive: { borderColor: '#C2410C', backgroundColor: '#FFE8D6' },
  emojiChipText: { fontSize: 18 },
  modalActions: { flexDirection: 'row', gap: 10 },
  modalButton: { flex: 1, borderRadius: 14, paddingVertical: 12, alignItems: 'center', borderWidth: 1 },
  modalButtonCancel: { backgroundColor: '#FFFBF5', borderColor: '#EEDCC8' },
  modalButtonPrimary: { alignItems: 'center' },
  modalButtonText: { fontSize: 14, fontWeight: '800', color: '#C2410C' },
  errorText: { fontSize: 16, fontWeight: '600', textAlign: 'center', marginTop: 40 },
});
