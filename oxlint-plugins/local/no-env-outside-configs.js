const CONFIGS_DIR = /[\\/]web[\\/]configs[\\/]/;
const ENV_MESSAGE = "Move it to a config module in web/configs/ and import from there.";

/** @type {import("@oxlint/plugins").RuleDefinition} */
export const noEnvOutsideConfigs = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow process.env and import.meta.env usage outside web/configs/. " +
        "Environment variables must be centralized in config modules.",
    },
  },
  createOnce(context) {
    return {
      before() {
        if (CONFIGS_DIR.test(context.filename)) {
          return false;
        }
      },

      MemberExpression(node) {
        if (isProcessEnv(node)) {
          context.report({
            node,
            message: `Access to process.env.${getEnvVarName(node)} is not allowed here. ${ENV_MESSAGE}`,
          });
        } else if (isImportMetaEnv(node)) {
          context.report({
            node,
            message: `Access to import.meta.env is not allowed here. ${ENV_MESSAGE}`,
          });
        } else if (isImportMetaEnvProperty(node)) {
          context.report({
            node,
            message: `Access to import.meta.env.${getEnvVarName(node)} is not allowed here. ${ENV_MESSAGE}`,
          });
        }
      },
    };
  },
};

function getEnvVarName(node) {
  return node.property.type === "Identifier" ? node.property.name : "…";
}

function isProcessEnv(node) {
  return (
    node.object.type === "MemberExpression" &&
    node.object.object.type === "Identifier" &&
    node.object.object.name === "process" &&
    node.object.property.type === "Identifier" &&
    node.object.property.name === "env"
  );
}

function isImportMetaEnv(node) {
  return (
    node.object.type === "MetaProperty" &&
    node.object.meta.name === "import" &&
    node.object.property.name === "meta" &&
    node.property.type === "Identifier" &&
    node.property.name === "env"
  );
}

function isImportMetaEnvProperty(node) {
  return (
    node.object.type === "MemberExpression" &&
    node.object.object.type === "MetaProperty" &&
    node.object.object.meta.name === "import" &&
    node.object.object.property.name === "meta" &&
    node.object.property.type === "Identifier" &&
    node.object.property.name === "env"
  );
}
