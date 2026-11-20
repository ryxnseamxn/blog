#!/usr/bin/env node
/**
 * Validates 1:1 mapping between feature flags and screen routes.
 * - Every flag in FEATURE_FLAGS must correspond to a real screen route.
 * - Every screen route must have a flag entry (default-off).
 *
 * Run via: `node scripts/check-feature-flags.js`
 * (Also wired into `npm run lint` via package.json)
 */

import fs from 'fs';
import path from 'path';

const scriptPath = new URL(import.meta.url).pathname;
const __dirname = path.dirname(scriptPath);

// Special routes that are not user screens (excluded from 1:1 check)
const SPECIAL_ROUTES = new Set([
  '/_sitemap',
  '/friendsgiving/[gatheringId]',
  '/friendsgiving/',
]);

// --- Parse FEATURE_FLAGS keys from source ---
function extractFeatureFlagKeys(filepath) {
  const src = fs.readFileSync(filepath, 'utf-8');
  const match = src.match(/FEATURE_FLAGS\s*=\s*{([^}]+)}/s);
  if (!match) return new Set();
  const inner = match[1];
  const keys = inner.match(/["']([^"']+)["']/g) || [];
  return new Set(keys.map(k => k.slice(1, -1)));
}

// --- Extract simple screen routes from expo-router typed routes ---
function extractScreenRoutes(filepath) {
  const src = fs.readFileSync(filepath, 'utf-8');
  const routes = new Set();

  // Match all backtick-quoted strings and single/double-quoted strings
  const allQuoted = src.match(/`[^`]+`|'[^']+'|"[^"]+"/g) || [];
  for (const q of allQuoted) {
    let lit = q.slice(1, -1); // strip quotes
    if (!lit.startsWith('/')) continue;
    // Strip template interpolation fragments
    lit = lit.replace(/\$\{[^}]+\}/g, '');
    // Strip query/hash fragments
    lit = lit.split('?')[0].split('#')[0];
    // Skip if it contains group segments like (drawer)
    if (lit.includes('(')) continue;
    // Skip if it contains template interpolation markers
    if (lit.includes('$')) continue;
    // Skip special routes
    if (SPECIAL_ROUTES.has(lit)) continue;
    if (lit) routes.add(lit);
  }

  return routes;
}

async function main() {
  const flagsPath = path.join(__dirname, '..', 'src', 'config', 'feature-flags.ts');
  const flagKeys = extractFeatureFlagKeys(flagsPath);

  const routerTypesPath = path.join(__dirname, '..', '.expo', 'types', 'router.d.ts');
  const screenRoutes = extractScreenRoutes(routerTypesPath);

  let hasErrors = false;

  for (const flag of flagKeys) {
    if (!screenRoutes.has(flag)) {
      console.error(`❌ Flag "${flag}" has no corresponding screen route`);
      hasErrors = true;
    }
  }

  for (const screen of screenRoutes) {
    if (!flagKeys.has(screen)) {
      console.error(`❌ Screen route "${screen}" has no flag entry`);
      hasErrors = true;
    }
  }

  if (hasErrors) {
    console.error('\nRun failed. Fix the 1:1 mapping above.');
    process.exit(1);
  } else {
    console.log('✅ Feature flags ↔ screen routes 1:1 mapping OK');
    console.log(`   Flags: ${flagKeys.size}, Screens: ${screenRoutes.size}`);
  }
}

main().catch((e) => {
  console.error('Script error:', e);
  process.exit(1);
});