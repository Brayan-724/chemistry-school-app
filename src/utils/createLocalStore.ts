import { Accessor, createEffect, on, Setter } from "solid-js";

export default function createLocalStorage<T extends object>(
  key: string,
  defaultValue: T,
  preProcessor?: (val: T) => string,
  postProcessor?: (val: string) => T,
): T extends (...args: never) => unknown ? unknown
  : [get: T, set: Setter<T>, save: Accessor<void>];

export default function createLocalStorage<T extends object>(
  key: string,
  defaultValue: T,
  preProcessor?: (val: T) => string,
  postProcessor?: (val: string) => T,
): [T, Setter<T>, Accessor<void>] {
  const storage = window.localStorage;
  const storedValue = storage.getItem(key);
  const value: T = storedValue
    ? (postProcessor ?? JSON.parse)(storedValue)
    : (defaultValue);

  const save = (val: T) =>
    storage.setItem(
      key,
      preProcessor ? preProcessor(val) : JSON.stringify(val),
    );

  if (!storedValue) save(value);

  createEffect(on(() => value, (value) => {
    save(value);
  }));

  const newSetValue = (newValue: T | ((v: T) => T)): T => {
    const _val: T = typeof newValue === "function" ? newValue(value) : newValue;

    save(_val);

    return _val;
  };

  return [value, newSetValue as Setter<T>, () => save(value)];
}
