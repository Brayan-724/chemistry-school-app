import { DataTable } from "../../DataTable";
import "./DataRegister.sass";
import { IDataTableHeader } from "../../DataTable/context";
import { IData, useDataContext } from "../DataContext";
import { DataTableUpdateableCell } from "../../DataTable/UpdateableCell";

export default function Step_DataRegister() {
  const { data } = useDataContext()!;

  const headers = new Map<string, IDataTableHeader<IData, keyof IData>>();
  headers.set("wavelength", {
    title: ["Wavelength (nm)", "Wave (nm)", "W (nm)"],
    cell: DataTableUpdateableCell<IData>({
      updateValue(cell, newValue) {
        data.set(cell.idx, newValue);
      },
      process(cell, { currentTarget }) {
        const newValue = parseInt(currentTarget.value);
        if (Number.isNaN(newValue)) {
          currentTarget.value = cell.value;
          return [false, null];
        }
        return [true, newValue];
      },
    }),
  });
  headers.set("intensity", {
    title: ["Intensity (lm)", "Int (lm)", "I (lm)"],
    cell: DataTableUpdateableCell<IData>({
      updateValue(cell, newValue) {
        data.set(cell.idx, newValue);
      },
      process(cell, { currentTarget }) {
        const newValue = parseInt(currentTarget.value);
        if (Number.isNaN(newValue)) {
          currentTarget.value = cell.value;
          return [false, null];
        }
        return [true, newValue];
      },
    }),
  });
  headers.set("absorbance", {
    title: ["Absorbance (U)", "Abs (U)", "A (U)"],
  });
  headers.set("concentration", {
    title: ["Concentration (n/L)", "Con (n/L)", "C (n/L)"],
    cell: DataTableUpdateableCell<IData>({
      updateValue(cell, newValue) {
        data.set(cell.idx, newValue);
      },
      process(cell, { currentTarget }) {
        const newValue = parseInt(currentTarget.value);
        if (Number.isNaN(newValue)) {
          currentTarget.value = cell.value;
          return [false, null];
        }
        return [true, newValue];
      },
    }),
  });

  return (
    <div>
      <DataTable
        headers={headers}
        data={data}
        formatCell={(key, { value }) => {
          if (key === "wavelength") return value.toString();
          return value.toFixed(4);
        }}
      />

      <div class="data-register-form">
        <label>
          <span>
            Wavelength
          </span>
          <input type="number" />
        </label>
        <label>
          <span>
            Intensity
          </span>
          <input type="number" />
        </label>
        <label>
          <span>
            Concentration
          </span>
          <input type="number" />
        </label>
        <button
          onClick={() =>
            data.set(data.size, {
              wavelength: 460,
              intensity: 90,
              absorbance: 3,
              concentration: 8,
            })}
        >
          ADD
        </button>
      </div>
    </div>
  );
}
