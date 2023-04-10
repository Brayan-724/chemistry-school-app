import { createStore } from "solid-js/store";
import "./UseCase.sass";
import { useDataContext } from "../DataContext";
import { createMemo, createSignal, Show } from "solid-js";
import {
  calcAbsorbance,
  calcEpsilon,
  calcTransmitance,
} from "@/utils/chemistry";

export default function Step_UseCase() {
  const { createComputed, intensity } = useDataContext()!;
  const [formData, setFormData] = createStore({
    intensity: 90,
  });
  const epsilonData = createMemo(() =>
    calcEpsilon(
      createComputed(
        null,
        ([, data]) => [data.concentration, data.absorbance()],
      )(),
    )
  );
  const epsilon = () => epsilonData()[0];
  const rSquared = () => epsilonData()[1];
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

  const [result, setResult] = createSignal<number>();

  return (
    <div>
      <div class="use-case-form">
        <FormInput title="Intensity" key="intensity" />
        <button
          onClick={() => setResult(absorbance() / epsilon())}
        >
          ADD
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
            <span class="use-case-number">{epsilon()}</span>
            <span class="use-case-title">
              The R<sup>2</sup> is
            </span>
            <span class="use-case-number">{rSquared()}</span>
          </p>
        )}
      </Show>
    </div>
  );
}
