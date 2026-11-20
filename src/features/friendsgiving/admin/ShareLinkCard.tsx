import { useState } from 'react';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAppTheme } from '@/hooks/use-app-theme';
import { gatheringLink, shareGatheringLink } from '../gathering-link';

export function ShareLinkCard({ gatheringId }: { gatheringId: string }) {
  const { colors } = useAppTheme();
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const outcome = await shareGatheringLink(gatheringId).catch(() => null);
    setCopied(outcome === 'copied');
  };

  return (
    <Card title="Invite guests">
      <AppText selectable style={{ color: colors.primary }}>
        {gatheringLink(gatheringId)}
      </AppText>
      <Button label={copied ? 'Copied!' : 'Share link'} onPress={share} />
    </Card>
  );
}
