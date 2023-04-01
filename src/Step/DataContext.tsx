import { ReactiveMap } from "@solid-primitives/map";
import {
  Accessor,
  createContext,
  createEffect,
  createSignal,
  on,
  ParentProps,
  useContext,
} from "solid-js";
import createLocalStorage from "@/utils/createLocalStore";
import { createTrigger } from "@solid-primitives/trigger";
import { calcAbsorbance } from "@/utils/chemistry";

export interface IData {
  wavelength: number;
  intensity: number;
  absorbance: Accessor<number>;
  concentration: number;
  update: VoidFunction;
}

export type IDataContext = {
  intensity: Accessor<number>;
  setIntensity(newValue: number): void;
  data: Map<number, IData>;
  save: VoidFunction;
};

export const DataContext = createContext<IDataContext>();

export function DataProvider(props: ParentProps) {
  const [intensity, setIntensity] = createSignal(1);
  const [savedIntensity, saveInstensity] = createLocalStorage(
    "intensity",
    intensity,
  );
  setIntensity(savedIntensity);

  const [data, , save] = createLocalStorage<ReactiveMap<number, IData>>(
    "registry",
    new ReactiveMap(
      [[
        0,
        createReactiveData({
          wavelength: 460,
          intensity: 88.36,
          concentration: 5.84,
        }),
      ], [
        1,
        createReactiveData({
          wavelength: 460,
          intensity: 88.27,
          concentration: 6,
        }),
      ], [
        2,
        createReactiveData({
          wavelength: 460,
          intensity: 90,
          concentration: 8,
        }),
      ]],
    ),
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
        intensity: intensity,
        setIntensity: (v) => {
          setIntensity(v);
          saveInstensity(v);
        },
        data,
        save,
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

      return calcAbsorbance(dataContext.intensity(), ret.intensity);
    },
    update,
  };

  return ret;
}
