#!/usr/bin/env node
/**
 * Validates the 1:1 mapping between FEATURE_FLAGS keys and screen routes in src/app.
 * Run via `npm run check:flags` (also part of `npm run lint`).
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.join(import.meta.dirname, '..');
const appDir = path.join(root, 'src', 'app');
const flagsFile = path.join(root, 'src', 'config', 'feature-flags.ts');

const SCREEN_FILE = /\.(tsx|ts|jsx|js)$/;
const PLATFORM_SUFFIX = /\.(ios|android|web|native)$/;

function flagKeys() {
  const source = fs.readFileSync(flagsFile, 'utf8');
  const body = source.match(/FEATURE_FLAGS\s*=\s*{([^}]*)}/s)?.[1] ?? '';
  return new Set([...body.matchAll(/['"]([^'"]+)['"]\s*:/g)].map((m) => m[1]));
}

/** Maps a file under src/app to its route, e.g. (drawer)/admin/index.tsx -> /admin. */
function toRoute(relativeFile) {
  const segments = relativeFile
    .replace(SCREEN_FILE, '')
    .replace(PLATFORM_SUFFIX, '')
    .split(path.sep)
    .filter((segment) => !/^\(.+\)$/.test(segment) && segment !== 'index');
  return `/${segments.join('/')}`;
}

function screenRoutes(dir = appDir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return screenRoutes(fullPath);
    if (!SCREEN_FILE.test(entry.name) || entry.name.startsWith('_')) return [];
    return [toRoute(path.relative(appDir, fullPath))];
  });
}

const flags = flagKeys();
const screens = new Set(screenRoutes());
const errors = [
  ...[...flags].filter((flag) => !screens.has(flag)).map((flag) => `Flag "${flag}" has no screen route`),
  ...[...screens].filter((screen) => !flags.has(screen)).map((screen) => `Screen route "${screen}" has no flag`),
];

if (errors.length > 0) {
  errors.forEach((error) => console.error(`❌ ${error}`));
  console.error('\nFix the 1:1 mapping in src/config/feature-flags.ts.');
  process.exit(1);
}
console.log(`✅ Feature flags ↔ screen routes OK (${flags.size} routes)`);
