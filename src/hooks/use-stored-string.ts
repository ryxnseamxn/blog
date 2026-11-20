import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * A string persisted on this device. Storage failures are non-fatal: the value
 * just won't survive a restart. `loaded` turns true once the stored value is read.
 */
export function useStoredString(key: string): [value: string, setValue: (value: string) => void, loaded: boolean] {
  const [value, setValue] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(key)
      .then((stored) => active && stored !== null && setValue(stored))
      .catch(() => {})
      .finally(() => active && setLoaded(true));
    return () => {
      active = false;
    };
  }, [key]);

  const update = useCallback(
    (next: string) => {
      setValue(next);
      AsyncStorage.setItem(key, next).catch(() => {});
    },
    [key],
  );

  return [value, update, loaded];
}
