import type { Component } from "solid-js";
import { useRoutes } from "@solidjs/router";
import ReloadPrompt from "./ReloadPrompt";

import { routes } from "./pages";

const App: Component = () => {
  const Route = useRoutes(routes);

  return (
    <>
      <Route />
      <ReloadPrompt />
    </>
  );
};

export default App;
