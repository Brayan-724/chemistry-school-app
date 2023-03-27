import { batch, createContext, ParentProps, useContext } from "solid-js";
import { createMutable } from "solid-js/store";

export interface IDataTableContext {
  headers: Map<string, [string, string, string]>;
  selects: Set<number>;
  data: Map<number, Record<string, unknown>>;
  selectAll(): void;
  formatCell(key: string, value: unknown, obj: object, idx: number): string;
}

export const DataTableContext = createContext<IDataTableContext>();

export type DataTableProviderProps<T extends Record<string, unknown>> =
  ParentProps<
    Pick<IDataTableContext, "headers"> & {
      formatCell?: <K extends keyof T>(
        key: K,
        value: T[K],
        obj: T,
        idx: number,
      ) => string;
      data: Map<number, T>;
    }
  >;

export function DataTableProvider<T extends Record<string, unknown>>(
  props: DataTableProviderProps<T>,
) {
  const _selects = new Set<number>();
  const selects = createMutable(_selects);

  function selectAll() {
    batch(() => {
      selects.clear();
      props.data.forEach((_, idx) => {
        selects.add(idx);
      });
    });
  }

  return (
    <DataTableContext.Provider
      value={{
        headers: props.headers,
        selects,
        data: props.data,
        selectAll,
        formatCell:
          (props.formatCell ?? ((_, value) => `${value}`)) as IDataTableContext[
            "formatCell"
          ],
      }}
    >
      {props.children}
    </DataTableContext.Provider>
  );
}

export const useDataTable = () => useContext(DataTableContext);
