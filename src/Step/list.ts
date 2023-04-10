import { Component, lazy } from "solid-js";
import { withStepLayout } from "./StepLayout";

export interface Step {
  name: string;
  component: Component;
  withLayout: Component;
}

const newStep = (name: string, component: Component, idx: number): Step => ({
  name,
  component,
  withLayout: withStepLayout(component, idx),
});

export const steps: Step[] = [
  newStep(
    "Data Register",
    lazy(() => import("./steps/DataRegister")),
    0,
  ),
  newStep(
    "Use Case",
    lazy(() => import("./steps/UseCase")),
    1,
  ),
];
