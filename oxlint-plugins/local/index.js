import { eslintCompatPlugin } from "@oxlint/plugins";
import { noEnvOutsideConfigs } from "./no-env-outside-configs.js";

const plugin = eslintCompatPlugin({
  meta: { name: "local", version: "1.0.0" },
  rules: {
    "no-env-outside-configs": noEnvOutsideConfigs,
  },
});

export default plugin;
