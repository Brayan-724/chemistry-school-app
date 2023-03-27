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
            {([lg, md, sm]) => (
              <th scope="col">
                <span class="break-lg">{lg}</span>
                <span class="break-md">{md}</span>
                <span class="break-sm">{sm}</span>
              </th>
            )}
          </For>
        </tr>
      </thead>
      <tbody>
        <For each={[...dataTable.data.keys()]}>
          {(key) => <DataTableRow key={key} />}
        </For>
      </tbody>
    </table>
  );
}
