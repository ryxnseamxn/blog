import { Button } from '@/components/ui/Button';
import { CenteredMessage } from '@/components/ui/CenteredMessage';
import type { GatheringStatus } from '../use-gathering';

interface Props {
  status: GatheringStatus;
  error: string | null;
  onRetry: () => void;
}

/** What to show while a gathering isn't available yet. */
export function GatheringStatusView({ status, error, onRetry }: Props) {
  if (status === 'missing') {
    return <CenteredMessage message="This table came up empty 🥹 Double-check the link with your host." />;
  }
  if (status === 'error') {
    return (
      <CenteredMessage message={error ?? 'Something went wrong.'}>
        <Button label="Try again" onPress={onRetry} />
      </CenteredMessage>
    );
  }
  return <CenteredMessage />;
}
