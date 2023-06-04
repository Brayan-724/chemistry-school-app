import { createStore } from "solid-js/store";
import { ApexOptions } from "apexcharts";
import { DataTable } from "@/DataTable";
import { IDataTableHeader } from "@/DataTable/context";
import { createUpdateableCell } from "@/DataTable/UpdateableCell";
import {
  createReactiveData,
  IData,
  useDataContext,
  wavelengthFilter,
} from "../DataContext";
import "./DataRegister.sass";
import { calcEpsilon } from "@/utils/chemistry";
import { Accessor, createMemo, lazy, Suspense } from "solid-js";

const SolidApexCharts = lazy(() =>
  import("solid-apexcharts").then((mod) => ({ default: mod.SolidApexCharts }))
);

const chartFilename = { filename: "data-register-spectrometer" };
const getChartTitle = (t: string) => ({ text: t });
const chartOptions: ApexOptions = {
  chart: {
    toolbar: {
      tools: {
        download: true,
        selection: false,
        zoom: false,
        zoomin: false,
        zoomout: false,
        pan: false,
        reset: false,
      },
      export: {
        csv: chartFilename,
        svg: chartFilename,
        png: chartFilename,
      },
    },
  },
  colors: ["#FF3030", "#40FF40", "#0050FF", "#000000"],
  fill: {
    type: "solid",
  },
  xaxis: {
    title: getChartTitle("Concentration"),
    type: "numeric",
    min: 0,
    tickAmount: 10,
    decimalsInFloat: 3,
  },
  yaxis: {
    title: getChartTitle("Absorbance"),
    min: 0,
    labels: {
      formatter(v) {
        return v.toPrecision(3);
      },
    },
  },
  tooltip: {
    shared: false,
    intersect: true,
  },
  markers: {
    size: [6, 6, 6, 0],
  },
  legend: {
    show: false,
  },
};

export default function Step_DataRegister() {
  const dataContext = useDataContext();
  if (!dataContext) return null;
  const {
    data,
    intensity,
    setIntensity,
    save,
    createComputed: dataComputed,
  } = dataContext;
  const [formData, setFormData] = createStore({
    wavelength: "red",
    intensity: 1,
    concentration: 1,
  });
  function computeRed<T>(m: (v: IData) => T): Accessor<T[]> {
    return dataComputed(wavelengthFilter("red"), ([, v]) => m(v));
  }
  const linearRed = createMemo(() =>
    calcEpsilon(computeRed((v) => [v.concentration, v.absorbance()])())
  );
  const epsilonData = createMemo(() =>
    calcEpsilon(
      dataComputed(null, ([, v]) => [v.concentration, v.absorbance()])(),
    )
  );
  const epsilon = () => epsilonData()[0];
  const rSquared = () => epsilonData()[1];
  const bias = () => epsilonData()[2];
  const maxX = () =>
    Math.max(...dataComputed(null, ([, v]) => v.concentration)());
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

  const WavelengthCell = createUpdateableCell<IData>({
    select: { "Red": "red", "Green": "green", "Blue": "blue" },
    updateValue(cell, _, newValue) {
      cell.obj[cell.key] = newValue as any;
      cell.obj.update();
      save();
    },
    process(cell, { currentTarget }) {
      console.log(currentTarget.value);
      return [true, currentTarget.value];
    },
  });

  const headers = new Map<string, IDataTableHeader<IData, keyof IData>>();
  headers.set("wavelength", {
    title: ["Wavelength (nm)", "Wave (nm)", "W (nm)"],
    cell: WavelengthCell({}),
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

  const FormInput = (props: { title: string; key: keyof typeof formData }) => (
    <label>
      <span>{props.title}</span>
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

  return (
    <div>
      <div class="data-register-form">
        <FormInput title="Intensity" key="intensity" />
        <FormInput title="Concentration" key="concentration" />
        <FormSelect title="Wavelength" key="wavelength" />
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
      <Suspense fallback={"Loading data..."}>
        <div class="data-register-intensity">
          <span>Original Intensity</span>
          <div>
            <label>
              <span>Red</span>
              <input
                type="number"
                value={intensity[0]()}
                onChange={(e) =>
                  setIntensity(0, parseFloat(e.currentTarget.value))}
              />
            </label>
            <label>
              <span>Green</span>
              <input
                type="number"
                value={intensity[1]()}
                onChange={(e) =>
                  setIntensity(1, parseFloat(e.currentTarget.value))}
              />
            </label>
            <label>
              <span>Blue</span>
              <input
                type="number"
                value={intensity[2]()}
                onChange={(e) =>
                  setIntensity(2, parseFloat(e.currentTarget.value))}
              />
            </label>
          </div>
        </div>
        <div class="data-register-chart">
          <SolidApexCharts
            width="100%"
            series={[
              {
                name: "Red Absorbance",
                type: "scatter",
                data: dataComputed(
                  wavelengthFilter("red"),
                  ([_, v]) => ({
                    x: v.concentration,
                    y: v.absorbance(),
                  }),
                )(),
              },
              {
                name: "Green Absorbance",
                type: "scatter",
                data: dataComputed(
                  wavelengthFilter("green"),
                  ([_, v]) => ({
                    x: v.concentration,
                    y: v.absorbance(),
                  }),
                )(),
              },
              {
                name: "Blue Absorbance",
                type: "scatter",
                data: dataComputed(
                  wavelengthFilter("blue"),
                  ([_, v]) => ({
                    x: v.concentration,
                    y: v.absorbance(),
                  }),
                )(),
              },
              {
                name: "Line",
                type: "line",
                data: [
                  {
                    x: 0,
                    y: 0,
                  },
                  {
                    x: maxX() * 1.05,
                    y: maxX() * epsilon() * 1.05 + bias(),
                  },
                ],
              },
            ]}
            type="line"
            options={{
              ...chartOptions,

              yaxis: {
                ...chartOptions.yaxis,
                max:
                  Math.max(...dataComputed(null, ([, v]) => v.absorbance())()) *
                  1.05,
              },
              xaxis: {
                ...chartOptions.xaxis,
                max: maxX() * 1.05,
              },
            }}
          />
          <p>Epsilon: {epsilon()}</p>
          <p>
            R<sup>2</sup>: {rSquared()}
          </p>
        </div>
        <DataTable
          headers={headers}
          data={data}
          formatCell={(key, { value: _value }) => {
            const value = _value() as number;
            if (key === "wavelength") return value.toString();
            return value.toPrecision(4);
          }}
          onDelete={(cell) => {
            data.delete(cell.idx);
          }}
        />
      </Suspense>
    </div>
  );
}
