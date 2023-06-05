import { createStore } from "solid-js/store";
import "./UseCase.sass";
import { IData, useDataContext, WavelengthIdx } from "../DataContext";
import { Accessor, createMemo, createSignal, Show } from "solid-js";
import {
  calcAbsorbance,
  calcEpsilon,
  calcTransmitance,
} from "@/utils/chemistry";

export const wavelengthFilter = (
  color: "red" | "green" | "blue",
) => [([, v]: [number, IData]) => v.wavelength === color] as const;

export default function Step_UseCase() {
  const _d = useDataContext();
  if (!_d) return null;
  const { createComputed, intensity: intensities } = _d;
  const [formData, setFormData] = createStore({
    intensity: 90,
    wavelength: "red",
  });

  const intensity = () => intensities[WavelengthIdx[formData.wavelength]]();

  function compute<T>(m: (v: IData) => T): Accessor<T[]> {
    return createComputed(
      wavelengthFilter(formData.wavelength),
      ([, v]) => m(v),
    );
  }
  const linear = createMemo(() =>
    calcEpsilon(
      compute(
        (data) => [data.concentration, data.absorbance()],
      )(),
    )
  );
  const absorbance = () => calcAbsorbance(intensity(), formData.intensity);

  const FormInput = (
    props: { title: string; key: keyof typeof formData },
  ) => (
    <label>
      <span>
        {props.title}
      </span>
      <input
        type="number"
        value={formData[props.key]}
        onChange={(e) =>
          setFormData((f) => ({
            ...f,
            [props.key]: parseFloat(e.currentTarget.value),
          }))}
      />
    </label>
  );
  const FormSelect = (props: { title: string; key: keyof typeof formData }) => (
    <label>
      <span>{props.title}</span>
      <div>
        <select
          value={formData[props.key]}
          onChange={(e) => {
            setFormData((f) => ({ ...f, [props.key]: e.currentTarget.value }));
          }}
        >
          <option value="red">Red</option>
          <option value="green">Green</option>
          <option value="blue">Blue</option>
        </select>
      </div>
    </label>
  );

  const [result, setResult] = createSignal<number>();

  return (
    <div>
      <div class="use-case-form">
        <FormInput title="Intensity" key="intensity" />
        <FormSelect title="Wavelength" key="wavelength" />
        <button
          onClick={() => setResult(absorbance() / linear()[0])}
        >
          CALCULATE
        </button>
      </div>
      <Show when={result()} keyed>
        {(result) => (
          <p class="use-case-result">
            <span class="use-case-title">The Concentration is</span>
            <span class="use-case-number">{result}</span>
            <span class="use-case-title">The Transmitance is</span>
            <span class="use-case-number">
              {calcTransmitance(intensity(), formData.intensity).toFixed(3)}%
            </span>
            <span class="use-case-title">The Absorbance is</span>
            <span class="use-case-number">{absorbance()}</span>
            <span class="use-case-title">The Epsilon is</span>
            <span class="use-case-number">{linear()[0]}</span>
            <span class="use-case-title">
              The R<sup>2</sup> is
            </span>
            <span class="use-case-number">{linear()[1]}</span>
          </p>
        )}
      </Show>
    </div>
  );
}
