import {
  Accessor,
  createContext,
  createSignal,
  ParentProps,
  useContext,
} from "solid-js";
import { steps } from "./list";
import { Navigate, Outlet, useParams } from "@solidjs/router";
import { StepLayout } from "./StepLayout";
import { DataProvider } from "./DataContext";

export interface IStepContext {
  actualStep: Accessor<number>;
  nextStep(): boolean;
  prevStep(): boolean;
  jumpTo(stepIdx: number): boolean;
}

export const StepContext = createContext<IStepContext>();

export function StepProvider(
  props: ParentProps<{ defaultStep?: number }>,
) {
  const [step, setStep] = createSignal(props.defaultStep ?? 0);
  const jumpTo = (stepIdx: number): boolean => {
    if (stepIdx < 0) return false;
    if (stepIdx >= steps.length) return false;

    setStep(stepIdx);

    return true;
  };

  const nextStep = () => jumpTo(step() + 1);

  const prevStep = () => jumpTo(step() - 1);

  return (
    <StepContext.Provider
      value={{ actualStep: step, jumpTo, nextStep, prevStep }}
    >
      <DataProvider>
        {props.children}
      </DataProvider>
    </StepContext.Provider>
  );
}

export const useStepContext = () => useContext(StepContext);

export function StepFallback() {
  const params = useParams();
  let step = parseInt(params.step);

  if (step >= steps.length || step < 0 || Number.isNaN(step)) {
    return <Navigate href="/step/0" />;
  }

  return (
    <StepLayout step={step}>
    </StepLayout>
  );
}

export function StepRouter() {
  let step = parseInt(window.location.pathname.split("/").pop() ?? "0") || 0;

  if (step >= steps.length || step < 0 || Number.isNaN(step)) {
    return <Navigate href="/step/0" />;
  }
  return (
    <StepLayout step={step}>
      <Outlet />
    </StepLayout>
  );
}
