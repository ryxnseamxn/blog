import * as Linking from 'expo-linking';
import { Platform, Share } from 'react-native';

import { APP_URL } from '@/config/env';

/** The link guests open to claim dishes. Prefers a web URL so guests don't need the app. */
export function gatheringLink(gatheringId: string): string {
  const path = `/friendsgiving/${gatheringId}`;
  const webOrigin = APP_URL ?? (Platform.OS === 'web' ? window.location.origin : undefined);
  return webOrigin ? `${webOrigin.replace(/\/$/, '')}${path}` : Linking.createURL(path);
}

/** Copies the link on web, where there's no share sheet; opens the share sheet elsewhere. */
export async function shareGatheringLink(gatheringId: string): Promise<'copied' | 'shared'> {
  const link = gatheringLink(gatheringId);
  if (Platform.OS === 'web') {
    await navigator.clipboard.writeText(link);
    return 'copied';
  }
  await Share.share({ message: link });
  return 'shared';
}
