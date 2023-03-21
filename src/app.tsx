import type { Component } from "solid-js";
import { useRoutes } from "@solidjs/router";

import { routes } from "./pages";
import { Navbar } from "./Navbar";

const App: Component = () => {
  const Route = useRoutes(routes);

  return (
    <>
      <Navbar />

      <main>
        <Route />
      </main>
    </>
  );
};

export default App;
