/**
 * IDE State Persistence — debounced save/restore for textarea content.
 */

import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "scilab-ide-state";

const loadAll = (): Record<string, string> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveAll = (data: Record<string, string>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { /* silently ignore quota */ }
};

export const useIdeState = (key: string, defaultValue: string) => {
  const [value, setValue] = useState<string>(() => {
    const all = loadAll();
    return all[key] ?? defaultValue;
  });

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateValue = useCallback(
    (newValue: string) => {
      setValue(newValue);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const all = loadAll();
        all[key] = newValue;
        saveAll(all);
      }, 1000);
    },
    [key],
  );

  const reset = useCallback(() => {
    setValue(defaultValue);
    const all = loadAll();
    delete all[key];
    saveAll(all);
  }, [key, defaultValue]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return { value, setValue: updateValue, reset };
};

/** Reset all IDE states */
export const resetAllIdeStates = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch { /* ignore */ }
};
