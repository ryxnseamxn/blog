import { ScrollView, StyleSheet } from 'react-native';
import { Stack, useRouter } from 'expo-router';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { useAppTheme } from '@/hooks/use-app-theme';
import { confirm } from '@/utils/confirm';
import { GatheringStatusView } from '../components/GatheringStatusView';
import { useGathering } from '../use-gathering';
import { deleteGathering, updateGathering } from './admin-api';
import { AdminDishList } from './AdminDishList';
import { GatheringForm } from './GatheringForm';
import { ShareLinkCard } from './ShareLinkCard';
import { useAdminKey } from './use-admin-key';

export function AdminGathering({ gatheringId }: { gatheringId: string }) {
  const { colors } = useAppTheme();
  const router = useRouter();
  const [adminKey] = useAdminKey();
  const { gathering, status, error, refresh, mutate, dismissError } = useGathering(gatheringId);

  if (!gathering) return <GatheringStatusView status={status} error={error} onRetry={refresh} />;

  const remove = async () => {
    if (!(await confirm(`Delete ${gathering.name}?`, 'All dishes and claims go with it.', 'Delete'))) return;
    if (await mutate(() => deleteGathering(adminKey, gatheringId))) router.back();
  };

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: gathering.name }} />
      {error ? <ErrorBanner message={error} onDismiss={dismissError} /> : null}

      <ShareLinkCard gatheringId={gatheringId} />
      <AdminDishList gathering={gathering} adminKey={adminKey} mutate={mutate} />
      <Card title="Details">
        <GatheringForm
          initial={gathering}
          submitLabel="Save details"
          onSubmit={(input) => mutate(() => updateGathering(adminKey, gatheringId, input))}
        />
      </Card>
      <Button label="Delete gathering" variant="danger" onPress={remove} />
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
