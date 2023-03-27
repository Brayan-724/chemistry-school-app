import { DataTable } from "../../DataTable";
import "./DataRegister.sass"

export default function Step_DataRegister() {
  return (
    <div>
      <DataTable
        headers={new Map([
          ["wavelength", ["Wavelength (nm)", "Wave (nm)", "W (nm)"]],
          ["intensity", ["Intensity (lm)", "Int (lm)", "I (lm)"]],
          ["absorbance", ["Absorbance (U)", "Abs (U)", "A (U)"]],
          ["concentration", ["Concentration (n/L)", "Con (n/L)", "C (n/L)"]],
        ])}
        data={new Map([[0, {
          wavelength: 460,
          intensity: 88.36,
          absorbance: 3,
          concentration: 5.84,
        }], [1, {
          wavelength: 460,
          intensity: 88.27,
          absorbance: 3,
          concentration: 6,
        }], [2, {
          wavelength: 460,
          intensity: 90,
          absorbance: 3,
          concentration: 8,
        }]])}
        formatCell={(key, value) => {
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
        <button>
          ADD
        </button>
      </div>
    </div>
  );
}
