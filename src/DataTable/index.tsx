import { DataTableProvider, DataTableProviderProps } from "./context";
import "./index.sass";
import { DataTableWrapper } from "./wrapper";

export function DataTable<T>(
  props: DataTableProviderProps<T>,
) {
  return (
    <DataTableProvider {...props}>
      <DataTableWrapper />
    </DataTableProvider>
  );
}
