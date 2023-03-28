import { createMemo, createSignal, For } from "solid-js";
import { useDataTable } from "./context";

export function DataTableRow({ id }: { id: number }) {
  const dataTable = useDataTable()!;
  const data = createMemo(() => dataTable.data.get(id)!);
  const [checked, setChecked] = createSignal(false);

  return (
    <tr classList={{ selected: checked() }}>
      <th>
        <input
          type="checkbox"
          onClick={(e) => setChecked(e.currentTarget.checked)}
        />
      </th>
      <For each={[...dataTable.headers.entries()]}>
        {([key, header]) => (
          <td>
            <header.cell
              value={dataTable.formatCell(key, {
                value: data()[key],
                obj: data(),
                idx: id,
              })}
              key={key}
              obj={data()}
              idx={id}
            />
          </td>
        )}
      </For>
    </tr>
  );
}
