import { ComponentProps, For } from "solid-js";
import { IDataTableHeader } from "./context";

type Cell<T> = ComponentProps<
  NonNullable<IDataTableHeader<T, keyof T>["cell"]>
>;

type CommonCellOptions<T, E> = {
  select?: { [key: string]: string };
  updateValue(
    cell: Cell<T>,
    newObj: T,
    newValue: unknown,
  ): void;
  process(
    cell: Cell<T>,
    event: Event & { currentTarget: E; target: Element },
  ): [boolean, unknown];
};

type DataTableUpdateableCellOptions<T> = CommonCellOptions<
  T,
  HTMLInputElement | HTMLSelectElement
>;

export function DataTableUpdateableCell<T>(
  props: DataTableUpdateableCellOptions<T>,
) {
  return (
    cell: Cell<T>,
  ) => {
    if (props.select) {
      const keys = Object.keys(props.select!);
      return (
        <select
          class="data-table-updateable"
          onChange={(e) => {
            const [continue_, newValue] = props.process(cell, e) || [false];
            if (!continue_) {
              return;
            }

            const val = { ...(cell.obj as any), [cell.key]: newValue };
            props.updateValue(cell, val, newValue);
            e.currentTarget.blur();
          }}
          value={cell.value()}
        >
          <For each={keys}>
            {(i) => <option value={props.select![i]}>{i}</option>}
          </For>
        </select>
      );
    }

    return (
      <input
        class="data-table-updateable"
        type="number"
        onChange={(e) => {
          const [continue_, newValue] = props.process(cell, e);
          if (!continue_) {
            return;
          }

          const val = { ...(cell.obj as any), [cell.key]: newValue };
          props.updateValue(cell, val, newValue);
          e.currentTarget.blur();
        }}
        value={cell.value()}
      />
    );
  };
}

export function createUpdateableCell<T>(
  factoryProps: DataTableUpdateableCellOptions<T>,
) {
  return (props: Partial<DataTableUpdateableCellOptions<T>>) => (
    DataTableUpdateableCell({ ...factoryProps, ...props })
  );
}
