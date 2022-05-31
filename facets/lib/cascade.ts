export const merge = <T>(a: T, b: T): T => ({ ...a, ...b });
export const extend = <T>(a: T[], b: T[]): T[] => [...a, ...b];
export const defer = <T>(a: T): T => a;
export const overwrite = <T>(_: T, b: T) => b;
