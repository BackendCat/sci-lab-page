export const objectValues = <T extends Record<string, unknown>>(obj: T): T[keyof T][] => {
  return Object.values(obj) as T[keyof T][];
};

export const objectEntries = <T extends Record<string, unknown>>(
  obj: T,
): [keyof T, T[keyof T]][] => {
  return Object.entries(obj) as [keyof T, T[keyof T]][];
};
