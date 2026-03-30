import path from "node:path";
import { defineConfig } from "vite-plus";
import { gadget } from "gadget-server/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import react from "@vitejs/plugin-react";
import { paraglideVitePlugin } from "@inlang/paraglide-js";

export default defineConfig({
  resolve: {
    alias: {
      "~": path.resolve(import.meta.dirname, "web"),
    },
  },
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
    paraglideVitePlugin({
      project: "./project.inlang",
      outdir: "./web/integrations/paraglide/generated",
      outputStructure: "message-modules",
      cookieName: "PARAGLIDE_LOCALE",
      strategy: ["cookie", "preferredLanguage", "baseLocale"],
    }),
  ],
});
