import { lazy } from "solid-js";
import type { RouteDefinition } from "@solidjs/router";

import Home from "./home";
import { steps } from "../Step/list";

export const routes: RouteDefinition[] = [
  {
    path: "/",
    component: Home,
  },
  ...(steps.map((step, index) => ({
    path: `/step/${index}`,
    component: step.withLayout,
  }))),
  {
    path: "/step/:step",
    component: lazy(async () => ({
      default: await import("../Step").then((mod) => mod.StepFallback),
    })),
  },
  {
    path: "**",
    component: lazy(() => import("./_404")),
  },
];
