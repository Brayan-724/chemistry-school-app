import { ReactiveMap } from "@solid-primitives/map";
import {
  createContext,
  createEffect,
  on,
  ParentProps,
  useContext,
} from "solid-js";
import createLocalStorage from "../utils/createLocalStore";

export interface IData {
  wavelength: number;
  intensity: number;
  absorbance: number;
  concentration: number;
}

export type IDataContext = {
  data: Map<number, IData>;
};

export const DataContext = createContext<IDataContext>();

export function DataProvider(props: ParentProps) {
  const [data, _, save] = createLocalStorage<ReactiveMap<number, IData>>(
    "registry",
    new ReactiveMap(
      [[0, {
        wavelength: 460,
        intensity: 88.36,
        absorbance: 3,
        concentration: 5.84,
      }], [1, {
        wavelength: 460,
        intensity: 88.27,
        absorbance: 3,
        concentration: 6,
      }], [2, {
        wavelength: 460,
        intensity: 90,
        absorbance: 3,
        concentration: 8,
      }]],
    ),
    (v) => {
      return JSON.stringify([...v.entries()]);
    },
    (v) => {
      return new ReactiveMap(JSON.parse(v));
    },
  );

  createEffect(on(() => data.entries(), () => save()));

  return (
    <DataContext.Provider value={{ data }}>
      {props.children}
    </DataContext.Provider>
  );
}

export const useDataContext = () => useContext(DataContext);
