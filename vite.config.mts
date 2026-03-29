import { defineConfig } from "vite-plus";
import { gadget } from "gadget-server/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  plugins: [
    gadget(),
    tanstackStart({
      srcDirectory: "web",
      router: {
        routesDirectory: "./routes",
        generatedRouteTree: "./routeTree.gen.ts",
        quoteStyle: "double",
      },
    }),
    nitro(),
    react(),
  ],
});
