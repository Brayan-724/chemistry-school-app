import { createStore } from "solid-js/store";
import { ApexOptions } from "apexcharts";
import { DataTable } from "@/DataTable";
import { IDataTableHeader } from "@/DataTable/context";
import { createUpdateableCell } from "@/DataTable/UpdateableCell";
import { createReactiveData, IData, useDataContext } from "../DataContext";
import "./DataRegister.sass";
import { calcEpsilon } from "@/utils/chemistry";
import { createMemo, lazy, Suspense } from "solid-js";

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
    size: [6, 0],
  },
  legend: {
    show: false,
  },
};

export default function Step_DataRegister() {
  const { data, intensity, setIntensity, save, createComputed: dataComputed } =
    useDataContext()!;
  const [formData, setFormData] = createStore({
    wavelength: 460,
    intensity: 90,
    concentration: 5,
  });
  const epsilonData = createMemo(() =>
    calcEpsilon(
      dataComputed(null, ([, v]) => [v.concentration, v.absorbance()])(),
    )
  );
  const epsilon = () => epsilonData()[0];
  const maxX = () =>
    Math.max(
      ...(dataComputed(null, ([, v]) => v.concentration)()),
    );
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

  return (
    <div>
      <div class="data-register-form">
        <FormInput title="Wavelength" key="wavelength" />
        <FormInput title="Intensity" key="intensity" />
        <FormInput title="Concentration" key="concentration" />
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
        <div class="data-register-chart">
          <SolidApexCharts
            width="100%"
            series={[{
              name: "Absorbance",
              type: "scatter",
              data: dataComputed(null, ([_, v]) => ({
                x: v.concentration,
                y: v.absorbance(),
              }))(),
            }, {
              name: "Line",
              type: "line",
              data: [{
                x: 0,
                y: 0,
              }, {
                x: maxX() * 1.05,
                y: epsilon() * maxX() * 1.05,
              }],
            }]}
            type="line"
            options={{
              ...chartOptions,

              yaxis: {
                ...chartOptions.yaxis,
                max: Math.max(
                  ...(dataComputed(null, ([, v]) => v.absorbance())()),
                ) * 1.05,
              },
              xaxis: {
                ...chartOptions.xaxis,
                max: maxX() * 1.05,
              },
            }}
          />
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
