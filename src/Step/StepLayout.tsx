import { Component, ParentProps } from "solid-js";
import { Navbar } from "./Navbar";
import { StepProvider } from ".";

export function StepLayout(props: ParentProps<{ step?: number }>) {
  return (
    <StepProvider defaultStep={props.step}>
      <Navbar />
      <main>{props.children}</main>
    </StepProvider>
  );
}

export function withStepLayout(Child: Component, step?: number) {
  return () => (
    <StepLayout step={step}>
      <Child />
    </StepLayout>
  );
}
