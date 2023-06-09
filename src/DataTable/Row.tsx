import { For, getOwner, runWithOwner } from "solid-js";
import { Dynamic } from "solid-js/web";
import { IDataTableCell, useDataTable } from "./context";
import { TrashIcon } from "@/icons/trash";

export function DataTableRow({ id }: { id: number }) {
  const dataTable = useDataTable()!;
  const data = () => dataTable.data.get(id)! as IDataTableCell["obj"];
  const owner = getOwner();

  return (
    <tr>
      <th>
        <button
          class="data-table--delete"
          onClick={() =>
            dataTable.onDelete({ value: () => data(), obj: data(), idx: id })}
        >
          <TrashIcon />
        </button>
      </th>
      <For each={[...dataTable.headers.entries()]}>
        {([key, header]) => (
          <td>
            {runWithOwner(owner, () => (
              <Dynamic
                component={header.cell}
                value={() =>
                  dataTable.formatCell(key, {
                    value: () =>
                      typeof (data()[key]) === "function"
                        ? (data()[key] as () => unknown)()
                        : data()[key],
                    obj: data(),
                    idx: id,
                  })}
                key={key}
                obj={data()}
                idx={id}
              />
            ))}
          </td>
        )}
      </For>
    </tr>
  );
}
