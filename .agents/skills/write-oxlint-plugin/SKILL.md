---
name: write-oxlint-plugin
description: 'Create oxlint custom linting rules using the high-performance JavaScript plugin API. Use when user asks to create a custom lint rule, oxlint plugin, or mentions "/write-oxlint-plugin". Guides through: (1) Writing rules with the optimized createOnce API, (2) Project conventions and naming, (3) Registering rules in the local plugin, (4) Performance best practices'
license: MIT
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# Writing Oxlint Custom Rules (JavaScript Plugins)

Reference: <https://oxc.rs/docs/guide/usage/linter/writing-js-plugins.html>

## Project Conventions

### Plugin architecture

This project uses a **single plugin** named `local` for all custom rules. One file per rule, assembled in `index.js`.

```
oxlint-plugins/
  local/
    index.js                        # Assembles plugin, imports all rules
    no-env-outside-configs.js       # One rule per file
    no-cross-feature-imports.js     # File name = rule name
.oxlintrc.json                      # jsPlugins + rules config
```

- **`index.js`** — single `eslintCompatPlugin` call, imports and registers all rules
- **Rule files** — export only the rule definition (no plugin wrapping)
- **File name matches rule name** — `no-foo-bar.js` exports the rule for `local/no-foo-bar`

### Naming conventions

| Element            | Convention                                             | Example                                                                   |
| ------------------ | ------------------------------------------------------ | ------------------------------------------------------------------------- |
| Plugin `meta.name` | Always `"local"`                                       | `meta: { name: "local" }`                                                 |
| Rule file          | `<rule-name>.js` (kebab-case)                          | `no-env-outside-configs.js`                                               |
| Rule export        | camelCase of rule name                                 | `export const noEnvOutsideConfigs`                                        |
| Rule name          | `no-<thing>` to disallow, `require-<thing>` to enforce | `no-env-outside-configs`                                                  |
| Full rule ID       | `local/<rule-name>`                                    | `local/no-env-outside-configs`                                            |
| Error messages     | State what's wrong + what to do instead                | `"Access to process.env.X is not allowed here. Move it to web/configs/."` |

### Rule categories

Use the correct `meta.type` for the rule's purpose:

| Type           | When to use                                                  |
| -------------- | ------------------------------------------------------------ |
| `"problem"`    | Code that will cause bugs or errors (e.g. direct env access) |
| `"suggestion"` | Code that could be improved (e.g. prefer alias imports)      |
| `"layout"`     | Formatting / style concerns                                  |

## Writing a Rule

### Rule file template

Each rule is a standalone file that exports a single rule definition:

```javascript
// oxlint-plugins/local/no-thing.js

const SKIP_PATTERN = /pattern/;

/** @type {import("@oxlint/plugins").RuleDefinition} */
export const noThing = {
  meta: {
    type: "problem",
    docs: {
      description: "Clear, one-line description of what this rule enforces.",
    },
  },
  createOnce(context) {
    // State declared here lives for the entire linter session.
    // Always reset it in before().
    let state;

    return {
      before() {
        // Reset per-file state
        state = 0;

        // Return false to skip this rule for the current file
        if (SKIP_PATTERN.test(context.filename)) {
          return false;
        }
      },

      // AST visitor — only called when matching nodes exist
      NodeType(node) {
        if (/* violation */) {
          context.report({
            node,
            message: "What's wrong. What to do instead.",
          });
        }
      },

      // Runs after full AST traversal
      after() {
        // Aggregated checks (e.g. "too many X in this file")
      },
    };
  },
};
```

### Registering in index.js

Import the rule and add it to the `rules` object:

```javascript
// oxlint-plugins/local/index.js
import { eslintCompatPlugin } from "@oxlint/plugins";
import { noEnvOutsideConfigs } from "./no-env-outside-configs.js";
import { noThing } from "./no-thing.js";

const plugin = eslintCompatPlugin({
  meta: { name: "local", version: "1.0.0" },
  rules: {
    "no-env-outside-configs": noEnvOutsideConfigs,
    "no-thing": noThing,
  },
});

export default plugin;
```

### `createOnce` vs `create` — why it matters

|               | `create`                                | `createOnce`                     |
| ------------- | --------------------------------------- | -------------------------------- |
| Execution     | Called per file (new closure each time) | Called once at startup           |
| State         | Automatic reset (new closure)           | Manual reset in `before()`       |
| Performance   | Standard JS overhead per file           | Enables Rust-side optimizations  |
| ESLint compat | Native                                  | Via `eslintCompatPlugin` wrapper |

**Never use `create` for new rules.** `createOnce` enables oxlint to:

- Skip files that lack relevant AST node types entirely
- Compile AST on the Rust side, avoiding JS traversal overhead
- Apply zero-cost FFI improvements in future versions

## Lifecycle Hooks

### `before()` — Pre-traversal (per file)

- Reset per-file state here
- Return `false` to skip the rule for this file
- Use `context.filename` for path-based filtering
- Use `context.sourceCode.text` for content-based filtering

```javascript
before() {
  counter = 0;

  // Skip generated files
  if (context.filename.includes(".generated.")) {
    return false;
  }
}
```

> **Caveat**: `before()` is NOT guaranteed to run on every file. Future oxlint optimizations may skip files that lack relevant AST nodes. For logic that MUST run on every file, use the `Program` visitor.

### `after()` — Post-traversal (per file)

Runs after all visitors have been called. Use for aggregated checks.

```javascript
after() {
  if (counter > 20) {
    context.report({
      message: `File has ${counter} functions — consider splitting.`,
      loc: { line: 1, column: 0 },
    });
  }
}
```

### `Program` — Guaranteed per-file execution

Unlike `before()`, the `Program` visitor always runs for every file.

```javascript
Program(node) {
  // This runs for every single file, guaranteed
}
```

## `context` API

```javascript
// Report a violation (attach to a node for location)
context.report({
  node,
  message: "Human-readable error message.",
});

// Report at a specific location (when no node is available)
context.report({
  message: "Message",
  loc: { line: 1, column: 0 },
});

// Access the current file
context.filename; // Absolute file path
context.sourceCode.text; // Full file source as string
```

## Common AST Node Types

All visitor names follow ESTree / TypeScript-ESTree conventions (identical to ESLint).

```javascript
return {
  // Declarations
  ClassDeclaration(node) {},
  FunctionDeclaration(node) {},
  VariableDeclaration(node) {},
  ImportDeclaration(node) {}, // import X from "Y"
  ExportNamedDeclaration(node) {},
  ExportDefaultDeclaration(node) {},

  // Expressions
  CallExpression(node) {}, // foo(), bar.baz()
  MemberExpression(node) {}, // obj.prop, obj[prop]
  ArrowFunctionExpression(node) {},
  AssignmentExpression(node) {},
  TemplateLiteral(node) {},
  NewExpression(node) {},

  // Statements
  IfStatement(node) {},
  ReturnStatement(node) {},
  ThrowStatement(node) {},
  ForStatement(node) {},
  WhileStatement(node) {},
  SwitchStatement(node) {},
  TryStatement(node) {},

  // JSX
  JSXElement(node) {},
  JSXOpeningElement(node) {},
  JSXAttribute(node) {},
  JSXExpressionContainer(node) {},

  // TypeScript
  TSTypeAnnotation(node) {},
  TSInterfaceDeclaration(node) {},
  TSTypeAliasDeclaration(node) {},
  TSEnumDeclaration(node) {},

  // Meta
  MetaProperty(node) {}, // import.meta
  Program(node) {}, // Always runs — guaranteed per-file
};
```

## Registering a Rule in `.oxlintrc.json`

The plugin entry only needs to be set once. To add a new rule, just enable it:

```json
{
  "jsPlugins": ["./oxlint-plugins/local/index.js"],
  "rules": {
    "local/no-env-outside-configs": "error",
    "local/no-thing": "error"
  }
}
```

Verify with:

```bash
vp lint
```

## Performance Best Practices

1. **Always use `createOnce`** — never bare `create`
2. **Reset state in `before()`** — never rely on closure reset from `createOnce` body
3. **Return `false` from `before()`** to skip irrelevant files early
4. **Use specific visitors** — prefer `MemberExpression` over `Program` + manual walk
5. **Avoid re-parsing** — use `node` properties directly, not `context.sourceCode.text`
6. **Use `Program` only for guaranteed execution** — other visitors benefit from skip optimization
7. **One concern per rule** — enables finer-grained skip optimization and clearer error messages
8. **Extract regex patterns as module-level constants** — avoid recompiling per file

## Error Message Best Practices

- **State the problem** — what's wrong with the code
- **State the fix** — what the developer should do instead
- **Include specifics** — interpolate the offending value when possible

```javascript
// Good
`Access to process.env.${envVar} is not allowed here. Move it to a config module in web/configs/ and import from there.`;

// Bad
("Environment variable access not allowed.");
```

## Workflow for Adding a New Rule

1. **Name the rule** — `no-<thing>` (disallow) or `require-<thing>` (enforce)
2. **Create the rule file** — `oxlint-plugins/local/<rule-name>.js`, export a named camelCase constant
3. **Identify the AST node(s)** — which visitor(s) detect the pattern?
4. **Write the rule** using the rule file template above
5. **Use `before()` to skip** files that shouldn't be checked
6. **Register in `index.js`** — import the rule + add to `rules` object
7. **Enable in `.oxlintrc.json`** — add `"local/<rule-name>": "error"` to `rules`
8. **Test** with `vp lint` and verify violations are reported correctly

## Real Example: `local/no-env-outside-configs`

See `oxlint-plugins/local/no-env-outside-configs.js` for a production rule that:

- Uses `before()` to skip `web/configs/` files via `context.filename`
- Catches both `process.env.X` and `import.meta.env.X` via `MemberExpression`
- Reports clear messages with the specific env var name interpolated
