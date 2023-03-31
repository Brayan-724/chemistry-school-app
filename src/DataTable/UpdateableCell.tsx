import { ComponentProps } from "solid-js";
import { IDataTableHeader } from "./context";

type Cell<T> = ComponentProps<
  NonNullable<IDataTableHeader<T, keyof T>["cell"]>
>;

type DataTableUpdateableCellOptions<T> = {
  updateValue(
    cell: Cell<T>,
    newObj: T,
    newValue: unknown,
  ): void;
  process(
    cell: Cell<T>,
    event: Event & { currentTarget: HTMLInputElement; target: Element },
  ): [boolean, unknown];
};

export function DataTableUpdateableCell<T>(
  props: DataTableUpdateableCellOptions<T>,
) {
  return (
    cell: Cell<T>,
  ) => (
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
}

export function createUpdateableCell<T>(
  factoryProps: DataTableUpdateableCellOptions<T>,
) {
  return (props: Partial<DataTableUpdateableCellOptions<T>>) => (
    DataTableUpdateableCell({ ...factoryProps, ...props })
  );
}
