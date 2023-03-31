import { DataTable } from "@/DataTable";
import { IDataTableHeader } from "@/DataTable/context";
import { createUpdateableCell } from "@/DataTable/UpdateableCell";
import { createReactiveData, IData, useDataContext } from "../DataContext";
import "./DataRegister.sass";

export default function Step_DataRegister() {
  const { data, save } = useDataContext()!;
  const UpdateableCell = createUpdateableCell<IData>({
    updateValue(cell, _, newValue) {
      cell.obj[cell.key] = newValue as any;
      cell.obj.update();
      save();
    },
    process(cell, { currentTarget }) {
      const newValue = parseFloat(currentTarget.value);
      if (Number.isNaN(newValue)) {
        currentTarget.value = cell.value();
        return [false, null];
      }
      return [true, newValue];
    },
  });

  const headers = new Map<string, IDataTableHeader<IData, keyof IData>>();
  headers.set("wavelength", {
    title: ["Wavelength (nm)", "Wave (nm)", "W (nm)"],
    cell: UpdateableCell({}),
  });
  headers.set("intensity", {
    title: ["Intensity (lm)", "Int (lm)", "I (lm)"],
    cell: UpdateableCell({}),
  });
  headers.set("absorbance", {
    title: ["Absorbance (U)", "Abs (U)", "A (U)"],
  });
  headers.set("concentration", {
    title: ["Concentration (n/L)", "Con (n/L)", "C (n/L)"],
    cell: UpdateableCell({}),
  });

  return (
    <div>
      <DataTable
        headers={headers}
        data={data}
        formatCell={(key, { value: _value }) => {
          const value = _value() as number;
          if (key === "wavelength") return value.toString();
          return value.toPrecision(4);
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
            data.set(
              data.size,
              createReactiveData({
                wavelength: 460,
                intensity: 90,
                concentration: 8,
              }),
            )}
        >
          ADD
        </button>
      </div>
    </div>
  );
}
