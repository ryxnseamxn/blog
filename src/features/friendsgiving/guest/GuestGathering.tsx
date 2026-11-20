import { useStoredString } from '@/hooks/use-stored-string';
import { GatheringStatusView } from '../components/GatheringStatusView';
import { useGathering } from '../use-gathering';
import { GuestWizard } from './GuestWizard';

const GUEST_NAME_KEY_PREFIX = 'friendsgiving:guest:';

/** Loads the gathering and the guest's remembered name (localStorage on web), then runs the wizard. */
export function GuestGathering({ gatheringId }: { gatheringId: string }) {
  const { gathering, status, error, refresh, mutate, dismissError } = useGathering(gatheringId);
  const [guestName, setGuestName, nameLoaded] = useStoredString(`${GUEST_NAME_KEY_PREFIX}${gatheringId}`);

  if (!gathering || !nameLoaded) {
    return <GatheringStatusView status={gathering ? 'loading' : status} error={error} onRetry={refresh} />;
  }

  return (
    <GuestWizard
      gathering={gathering}
      guestName={guestName.trim()}
      onNameChange={setGuestName}
      mutate={mutate}
      error={error}
      onDismissError={dismissError}
    />
  );
}
