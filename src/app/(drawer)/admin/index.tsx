import RouteGate from '@/components/RouteGate';
import { AdminHome } from '@/features/friendsgiving/admin/AdminHome';

export default function AdminScreen() {
  return (
    <RouteGate route="/admin">
      <AdminHome />
    </RouteGate>
  );
}
