import { useLocalSearchParams } from 'expo-router';

import RouteGate from '@/components/RouteGate';
import { AdminGathering } from '@/features/friendsgiving/admin/AdminGathering';

export default function AdminGatheringScreen() {
  const { gatheringId } = useLocalSearchParams<{ gatheringId: string }>();

  return (
    <RouteGate route="/admin/[gatheringId]">
      <AdminGathering gatheringId={gatheringId} />
    </RouteGate>
  );
}
