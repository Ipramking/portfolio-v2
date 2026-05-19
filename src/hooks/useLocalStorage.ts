import { useState } from 'react';

export function useLocalStorage<T>(key: string, defaultValue: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const set = (newValue: T | ((prev: T) => T)) => {
    const resolved = typeof newValue === 'function' ? (newValue as (prev: T) => T)(value) : newValue;
    setValue(resolved);
    localStorage.setItem(key, JSON.stringify(resolved));
  };

  return [value, set];
}

export function lsGet<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
