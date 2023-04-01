import { createStore } from "solid-js/store";
import { DataTable } from "@/DataTable";
import { IDataTableHeader } from "@/DataTable/context";
import { createUpdateableCell } from "@/DataTable/UpdateableCell";
import { createReactiveData, IData, useDataContext } from "../DataContext";
import "./DataRegister.sass";

export default function Step_DataRegister() {
  const { data, intensity, setIntensity, save } = useDataContext()!;
  const [formData, setFormData] = createStore({
    wavelength: 460,
    intensity: 90,
    concentration: 5,
  });
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
    title: ["Absorbance", "Abs", "A"],
  });
  headers.set("concentration", {
    title: ["Concentration (M)", "Con (M)", "C (M)"],
    cell: UpdateableCell({}),
  });

  return (
    <div>
      <div class="data-register-form">
        <label>
          <span>
            Wavelength
          </span>
          <input
            type="number"
            value={formData.wavelength}
            onChange={(e) =>
              setFormData((f) => ({
                ...f,
                "wavelength": parseFloat(e.currentTarget.value),
              }))}
          />
        </label>
        <label>
          <span>
            Intensity
          </span>
          <input
            type="number"
            value={formData.intensity}
            onChange={(e) =>
              setFormData((f) => ({
                ...f,
                "intensity": parseFloat(e.currentTarget.value),
              }))}
          />
        </label>
        <label>
          <span>
            Concentration
          </span>
          <input
            type="number"
            value={formData.concentration}
            onChange={(e) =>
              setFormData((f) => ({
                ...f,
                "concentration": parseFloat(e.currentTarget.value),
              }))}
          />
        </label>
        <button
          onClick={() =>
            data.set(
              data.size,
              createReactiveData({
                ...formData,
              }),
            )}
        >
          ADD
        </button>
      </div>
      <div class="data-register-intensity">
        <label>
          <span>
            Original Intensity
          </span>
          <input
            type="number"
            value={intensity()}
            onChange={(e) => setIntensity(parseFloat(e.currentTarget.value))}
          />
        </label>
      </div>
      <DataTable
        headers={headers}
        data={data}
        formatCell={(key, { value: _value }) => {
          const value = _value() as number;
          if (key === "wavelength") return value.toString();
          return value.toPrecision(4);
        }}
      />
    </div>
  );
}
