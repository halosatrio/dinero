import { defineConfig, loadEnv, PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite(),
    tsconfigPaths(),
    visualizer() as PluginOption,
  ],
  server: { port: parseInt(Bun.env.VITE_PORT!) || 8080 },
});
