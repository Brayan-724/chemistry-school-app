import { createMemo, createSignal, For } from "solid-js";
import { useDataTable } from "./context";

export function DataTableRow({ key }: { key: number }) {
  const dataTable = useDataTable()!;
  const data = createMemo(() => dataTable.data.get(key)!);
  const [checked, setChecked] = createSignal(false);

  return (
    <tr classList={{ selected: checked() }}>
      <th>
        <input
          type="checkbox"
          onClick={(e) => setChecked(e.currentTarget.checked)}
        />
      </th>
      <For each={[...dataTable.headers.keys()]}>
        {(header) => <td>{dataTable.formatCell(header, data()[header], data(), key)}</td>}
      </For>
    </tr>
  );
}
