import { useStoredString } from '@/hooks/use-stored-string';

/** The host's admin key, remembered on this device. Only needed when the API sets Admin:ApiKey. */
export const useAdminKey = () => useStoredString('friendsgiving:adminKey');
