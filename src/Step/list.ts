import { Component, lazy } from "solid-js";
import { withStepLayout } from "./StepLayout";

export interface Step {
  name: string;
  component: Component;
  withLayout: Component;
}

const newStep = (name: string, component: Component): Step => ({
  name,
  component,
  withLayout: withStepLayout(component),
});

export const steps: Step[] = [
  newStep(
    "Data Register",
    lazy(() =>
      import("./steps/1")
    ),
  ),
];
