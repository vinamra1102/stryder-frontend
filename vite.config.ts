// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const BACKEND = process.env.VITE_API_URL ?? "http://localhost:8000";

// Proxy backend paths in dev so the browser never makes a cross-origin request.
// In production the frontend and backend are on different origins; set
// VITE_API_URL to the deployed backend URL at build time instead.
const backendProxy = {
  target: BACKEND,
  changeOrigin: true,
  secure: false,
};

export default defineConfig({
  vite: {
    server: {
      proxy: {
        "/auth": backendProxy,
        "/fitness": backendProxy,
        "/user": backendProxy,
        "/health": backendProxy,
      },
    },
  },
});
