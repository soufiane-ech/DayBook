import { useEffect, useState } from 'react';

/** Upgrades or validates stored data. Must be defined outside the component so it stays stable. */
type Parse<T> = (raw: unknown) => T;

function decode<T>(json: string, parse?: Parse<T>): T {
  const raw: unknown = JSON.parse(json);
  return parse ? parse(raw) : (raw as T);
}

function read<T>(key: string, fallback: T, parse?: Parse<T>): T {
  try {
    const stored = window.localStorage.getItem(key);
    return stored === null ? fallback : decode(stored, parse);
  } catch (error) {
    console.warn(`Could not read "${key}" from localStorage`, error);
    return fallback;
  }
}

/** useState that persists to localStorage and stays in sync across tabs. */
export function useLocalStorage<T>(key: string, fallback: T, parse?: Parse<T>) {
  const [value, setValue] = useState<T>(() => read(key, fallback, parse));
  const [saveFailed, setSaveFailed] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      setSaveFailed(false);
    } catch (error) {
      console.warn(`Could not save "${key}" to localStorage`, error);
      setSaveFailed(true);
    }
  }, [key, value]);

  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key === key && event.newValue !== null) {
        setValue(decode(event.newValue, parse));
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key, parse]);

  return [value, setValue, saveFailed] as const;
}
