import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { Card } from '@/components/ui/Card';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { useAppTheme } from '@/hooks/use-app-theme';
import { errorMessage } from '../http';
import type { GatheringInput } from '../types';
import { createGathering } from './admin-api';
import { AdminKeyCard } from './AdminKeyCard';
import { GatheringForm } from './GatheringForm';
import { GatheringList } from './GatheringList';
import { useAdminKey } from './use-admin-key';
import { useGatheringList } from './use-gathering-list';

export function AdminHome() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const [adminKey, setAdminKey, keyLoaded] = useAdminKey();
  const { gatherings, error: listError } = useGatheringList(adminKey, keyLoaded);
  const [createError, setCreateError] = useState<string | null>(null);
  const openGathering = (gatheringId: string) => router.push({ pathname: '/admin/[gatheringId]', params: { gatheringId } });

  const create = async (input: GatheringInput) => {
    try {
      const gathering = await createGathering(adminKey, input);
      setCreateError(null);
      openGathering(gathering.id);
      return true;
    } catch (e) {
      setCreateError(errorMessage(e));
      return false;
    }
  };

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.content}>
      {listError ? <ErrorBanner message={listError} /> : null}
      {listError && keyLoaded ? <AdminKeyCard adminKey={adminKey} onSave={setAdminKey} /> : null}
      {createError ? <ErrorBanner message={createError} onDismiss={() => setCreateError(null)} /> : null}

      <Card title="New gathering">
        <GatheringForm submitLabel="Create gathering" onSubmit={create} />
      </Card>

      {gatherings ? (
        <Card title="Gatherings">
          <GatheringList gatherings={gatherings} onSelect={openGathering} />
        </Card>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    padding: 16,
    paddingBottom: 40,
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
  },
});
