import { ReactiveMap } from "@solid-primitives/map";
import {
  Accessor,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  on,
  ParentProps,
  useContext,
} from "solid-js";
import createLocalStorage from "@/utils/createLocalStore";
import { createTrigger } from "@solid-primitives/trigger";
import { calcAbsorbance } from "@/utils/chemistry";

export const wavelengthFilter = (
  color: "red" | "green" | "blue",
) => [([, v]: [number, IData]) => v.wavelength === color] as const;

export const WavelengthIdx = {
  red: 0,
  green: 1,
  blue: 2,

  0: "red",
  1: "green",
  2: "blue",
} as const;

export interface IData {
  wavelength: "red" | "green" | "blue";
  intensity: number;
  absorbance: Accessor<number>;
  concentration: number;
  update: VoidFunction;
}

export type IDataContext = {
  selectedWaves: readonly [
    Accessor<boolean>,
    Accessor<boolean>,
    Accessor<boolean>,
  ];
  setSelectedWave(idx: number, newValue: boolean): void;
  intensity: readonly [Accessor<number>, Accessor<number>, Accessor<number>];
  setIntensity(idx: number, newValue: number): void;
  data: Map<number, IData>;
  save: VoidFunction;
  createComputed<T>(
    key: null,
    callback: (v: [number, IData]) => T,
  ): Accessor<T[]>;
  createComputed<T>(
    filtered: readonly [(v: [number, IData]) => boolean],
    callback: (v: [number, IData]) => T,
  ): Accessor<T[]>;
  createComputed<T>(
    key: Accessor<number>,
    callback: (v: IData) => T,
  ): Accessor<T>;
};

export const DataContext = createContext<IDataContext>();

function createIntensityController() {
  const [red, setRed] = createSignal(1);
  const [green, setGreen] = createSignal(1);
  const [blue, setBlue] = createSignal(1);
  const [redSelected, setRedSelected] = createSignal(false);
  const [greenSelected, setGreenSelected] = createSignal(false);
  const [blueSelected, setBlueSelected] = createSignal(false);

  const toSaveIntensity = () => [red(), green(), blue()];
  const [savedIntensity, saveIntensity] = createLocalStorage(
    "intensity",
    toSaveIntensity,
  );
  const toSaveSelected = () => [redSelected(), greenSelected(), blueSelected()];
  const [savedSelected, saveSelected] = createLocalStorage(
    "selected",
    toSaveSelected,
  );

  function setIntensity(idx: number, val: number) {
    switch (idx) {
      case 0:
        setRed(val);
        break;
      case 1:
        setGreen(val);
        break;
      case 2:
        setBlue(val);
        break;

      default:
        console.error("Unknown intensity index");
        break;
    }
    saveIntensity(toSaveIntensity);
  }
  function setSelected(idx: number, val: boolean) {
    switch (idx) {
      case 0:
        setRedSelected(val);
        break;
      case 1:
        setGreenSelected(val);
        break;
      case 2:
        setBlueSelected(val);
        break;

      default:
        console.error("Unknown intensity index");
        break;
    }
    saveSelected(toSaveSelected);
  }

  const s1 = savedSelected();
  setRedSelected(s1[0]);
  setGreenSelected(s1[1]);
  setBlueSelected(s1[2]);

  const s2 = savedIntensity();
  setRed(s2[0]);
  setGreen(s2[1]);
  setBlue(s2[2]);

  const i = [red, green, blue] as const;
  const s = [redSelected, greenSelected, blueSelected] as const;
  return [i, s, setIntensity, setSelected] as const;
}

export function DataProvider(props: ParentProps) {
  const [intensity, selected, setIntensity, setSelected] =
    createIntensityController();

  const [data, , save] = createLocalStorage<ReactiveMap<number, IData>>(
    "registry",
    new ReactiveMap([]),
    (v) => {
      return JSON.stringify([...v.entries()]);
    },
    (v) => {
      return new ReactiveMap(
        (JSON.parse(v) as [number, IData][]).map((
          [idx, data],
        ) => [idx, createReactiveData(data)]),
      );
    },
  );

  createEffect(on(() => data.entries(), () => save()));

  return (
    <DataContext.Provider
      value={{
        intensity,
        selectedWaves: selected,
        setIntensity,
        setSelectedWave: setSelected,
        data,
        save,
        createComputed(key, callback) {
          // FUCK TS
          type _VALUE = [number, IData] & IData;

          return createMemo(() => {
            if (key === null) {
              return [...data.entries()].map((v) => callback(v as _VALUE));
            } else if (Array.isArray(key)) {
              const o: any[] = [];
              const filtered = key[0];
              data.forEach((v, i) => {
                const f = filtered([i, v]);
                if (!f) return;
                o.push(callback([i, v] as _VALUE));
              });
              return o;
            }

            const _key = key();
            const v = data.get(_key);
            if (!v) throw new Error("Data doesn't exist: " + key);
            return callback(v as _VALUE);
          });
        },
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
}

export const useDataContext = () => useContext(DataContext);

export function createReactiveData(
  data: Omit<IData, "absorbance" | "update">,
): IData {
  const [track, update] = createTrigger();
  let dataContext: IDataContext;
  const ret = {
    ...data,
    absorbance: () => {
      const _dataContext = dataContext ?? useDataContext();
      dataContext = _dataContext;

      if (!dataContext) throw new Error("No Data Provider");

      track();

      const w_idx = WavelengthIdx[ret.wavelength];

      return calcAbsorbance(dataContext.intensity[w_idx](), ret.intensity);
    },
    update,
  };

  return ret;
}
