export type IsNeverNull<T> = Extract<T, null> extends never ? true : false;
export type CascadeFn<T> = (upper: T, lower: T) => T;
