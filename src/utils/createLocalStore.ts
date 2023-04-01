import { on } from "solid-js";
import { Accessor, createMemo, Setter } from "solid-js";

export default function createLocalStorage<
  K,
  T = K extends Accessor<infer R> ? R : K,
>(
  key: string,
  defaultValue: K,
  preProcessor?: (val: T) => string,
  postProcessor?: (val: string) => T,
): T extends (...args: never) => unknown ? unknown
  : [get: K, set: Setter<T>, save: Accessor<void>];

export default function createLocalStorage<
  K,
  T = K extends Accessor<infer R> ? R : K,
>(
  key: string,
  defaultValue: K,
  preProcessor?: (val: T) => string,
  postProcessor?: (val: string) => T,
): [K, Setter<T>, VoidFunction] {
  const storage = window.localStorage;
  const isAccessor = typeof defaultValue === "function";
  const storedValue = storage.getItem(key);
  const value: Accessor<T> = createMemo(
    on(() =>
      defaultValue, () =>
      storedValue
        ? (postProcessor ?? JSON.parse)(storedValue) as K
        : (isAccessor ? defaultValue() : defaultValue)),
  );

  const save = (val: T) =>
    storage.setItem(
      key,
      preProcessor ? preProcessor(val) : JSON.stringify(val),
    );

  if (!storedValue) save(value());

  const newSetValue = (newValue: T | ((v: T) => T)): T => {
    const _val: T = typeof newValue === "function"
      ? (newValue as Function)(value)
      : newValue;

    save(_val);

    return _val;
  };

  return [
    (isAccessor ? value : value()) as K,
    newSetValue as Setter<T>,
    () => save(value()),
  ];
}
