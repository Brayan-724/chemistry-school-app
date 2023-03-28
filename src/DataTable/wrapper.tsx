import { For } from "solid-js";
import { DataTableRow } from "./Row";
import { useDataTable } from "./context";

export function DataTableWrapper() {
  const dataTable = useDataTable()!;

  return (
    <table class="data-table">
      <thead>
        <tr>
          <th scope="col">
            <input type="checkbox" />
          </th>
          <For each={[...dataTable.headers.values()]}>
            {({ title }) => (
              <th scope="col" title={title[0]}>
                <span class="break-lg">{title[0]}</span>
                <span class="break-md">{title[1] ?? title[0]}</span>
                <span class="break-sm">{title[2] ?? title[1] ?? title[0]}</span>
              </th>
            )}
          </For>
        </tr>
      </thead>
      <tbody>
        <For each={[...dataTable.data.keys()]}>
          {(key) => <DataTableRow id={key} />}
        </For>
      </tbody>
    </table>
  );
}
