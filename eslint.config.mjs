// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
// eslint.config.mjs
import antfu from '@antfu/eslint-config'
export default withNuxt(
  antfu({
    type: "app",
    vue: true,
    typescript: true,
    formatters: true,
    stylistic: {
      indent: 2,
      semi: true,
      quotes: "double",
    },
    ignores: ["./src/github/schema.docs.graphql",".pnpm-store/**"],
  }, {
    rules: {
      "ts/consistent-type-definitions": ["error", "type"],
      "no-console": ["off"],
      "antfu/no-top-level-await": ["off"],
      "node/prefer-global/process": ["off"],
      "perfectionist/sort-imports": ["error", {
        tsconfigRootDir: ".",
      }],
      "unicorn/filename-case": ["error", {
        case: "kebabCase",
        ignore: ["README.md"],
      }],
    },
)
