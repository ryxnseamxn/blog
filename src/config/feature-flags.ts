/**
 * Feature flags, one per screen route.
 *
 * - Keys MUST match a screen route path (without group segments like `(tabs)`).
 * - Missing keys default to OFF in production.
 * - In development (`__DEV__`) every route is enabled regardless of flags.
 *
 * Toggling flags in production ships via `eas update` (no store rebuild).
 */

export const FEATURE_FLAGS = {
  '/': true,
  '/about': true,
  '/admin': true,
  '/admin/[gatheringId]': true,
  '/friendsgiving/[gatheringId]': true,
  '/+not-found': true,
} as const satisfies Record<string, boolean>;

export type FlaggedRoute = keyof typeof FEATURE_FLAGS;

/**
 * Whether a given route is reachable.
 * Dev always returns true so you don't have to flip flags while working.
 */
export function isRouteEnabled(route: FlaggedRoute): boolean {
  if (__DEV__) return true;
  return FEATURE_FLAGS[route] ?? false;
}
