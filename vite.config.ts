import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import tsconfigPlugin from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [solidPlugin(), tsconfigPlugin()],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
