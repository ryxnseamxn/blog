import React from 'react';
import { Redirect } from 'expo-router';

import { isRouteEnabled } from '@/config/feature-flags';

interface RouteGateProps {
  /** The route path this screen represents, e.g. '/about'. */
  route: string;
  /** Where to send users when the route is disabled. Defaults to '/'. */
  redirectTo?: string;
  children: React.ReactNode;
}

/**
 * Gate a screen behind its feature flag. Renders children when enabled,
 * otherwise redirects. In development the flag is always considered on.
 */
export default function RouteGate({
  route,
  redirectTo = '/',
  children,
}: RouteGateProps) {
  if (!isRouteEnabled(route)) {
    return <Redirect href={redirectTo as never} />;
  }
  return <>{children}</>;
}