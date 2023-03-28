import { Component, createContext, ParentProps, useContext } from "solid-js";

export interface IDataTableCell<T = unknown, O = Record<string, T>> {
  value: T;
  obj: O;
  idx: number;
}

export interface IDataTableHeader<O = Record<string, T>, K = keyof O> {
  title: [string] | [string, string] | [string, string, string];
  cell?: Component<IDataTableCell<string, O> & { key: K }>;
}

export interface IDataTableContext {
  actions: Set<Component<IDataTableCell<never>>>;
  headers: Map<string, Required<IDataTableHeader>>;
  data: Map<number, Record<string, unknown>>;
  formatCell(key: string, cell: IDataTableCell): string;
}

export const DataTableContext = createContext<IDataTableContext>();

export type DataTableProviderProps<T extends Record<string, unknown>> =
  ParentProps<{
    headers: Map<string, IDataTableHeader<T>>;
    actions?: Set<Component<IDataTableCell<never, T>>>;
    formatCell?: <K extends keyof T>(
      key: K,
      cell: IDataTableCell<T[K], T>,
    ) => string;
    data: Map<number, T>;
  }>;

export function DataTableProvider<T extends Record<string, unknown>>(
  props: DataTableProviderProps<T>,
) {
  return (
    <DataTableContext.Provider
      value={{
        get headers() {
          props.headers.forEach((header) => {
            header.cell ??= ({ value }) => <>{value}</>;
          });

          return props.headers as IDataTableContext["headers"];
        },
        actions: (props.actions ?? new Set()) as IDataTableContext["actions"],
        data: props.data,
        formatCell: (props.formatCell ?? ((_, cell) =>
          `${cell.value}`)) as IDataTableContext[
            "formatCell"
          ],
      }}
    >
      {props.children}
    </DataTableContext.Provider>
  );
}

export const useDataTable = () => useContext(DataTableContext);
