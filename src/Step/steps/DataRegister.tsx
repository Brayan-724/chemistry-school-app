import { createStore } from "solid-js/store";
import { SolidApexCharts } from "solid-apexcharts";
import { ApexOptions } from "apexcharts";
import { DataTable } from "@/DataTable";
import { IDataTableHeader } from "@/DataTable/context";
import { createUpdateableCell } from "@/DataTable/UpdateableCell";
import { createReactiveData, IData, useDataContext } from "../DataContext";
import "./DataRegister.sass";

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
        reset: true,
      },
      export: {
        csv: chartFilename,
        svg: chartFilename,
        png: chartFilename,
      },
    },
  },
  xaxis: {
    title: getChartTitle("Concentration"),
  },
  yaxis: {
    title: getChartTitle("Absorbance"),
    labels: {
      formatter(v) {
        return v.toPrecision(3);
      },
    },
  },
};

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
            data: [...data.values()].map((v) => ({
              x: v.concentration,
              y: v.absorbance(),
            })),
          }]}
          type="scatter"
          options={chartOptions}
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
      />
    </div>
  );
}
