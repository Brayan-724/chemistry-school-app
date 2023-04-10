import { Navigate, RouteDefinition } from "@solidjs/router";

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
    path: "/step/**",
    component: () => <Navigate href="/step/0" />,
  },

  {
    path: "**",
    component: () => <Navigate href="/" />,
  },
];
