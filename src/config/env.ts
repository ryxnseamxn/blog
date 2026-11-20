import { Platform } from 'react-native';

// EXPO_PUBLIC_* values are inlined at build time from .env (see .env.example).
// Without one, target a local API; Android emulators reach the host machine at 10.0.2.2.
const LOCAL_API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5080' : 'http://localhost:5080';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || LOCAL_API_URL;

/** Public web address of this app, used for links guests open in a browser. */
export const APP_URL = process.env.EXPO_PUBLIC_APP_URL;
