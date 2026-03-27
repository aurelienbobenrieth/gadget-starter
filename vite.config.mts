import { defineConfig } from "vite-plus";
import { gadget } from "gadget-server/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  plugins: [gadget(), react()],
});
