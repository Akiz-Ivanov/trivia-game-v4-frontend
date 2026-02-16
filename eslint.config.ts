import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // Naming conventions
      "@typescript-eslint/naming-convention": [
        "warn",
        // Variables - camelCase or UPPER_CASE
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE", "PascalCase"],
          leadingUnderscore: "allow",
        },
        // Functions - camelCase (or PascalCase for React components)
        {
          selector: "function",
          format: ["camelCase", "PascalCase"],
        },
        // Types and interfaces - PascalCase
        {
          selector: "typeLike",
          format: ["PascalCase"],
        },
        // Enums - PascalCase
        {
          selector: "enum",
          format: ["PascalCase"],
        },
        // Enum members - UPPER_CASE
        {
          selector: "enumMember",
          format: ["UPPER_CASE"],
        },
      ],
    },
  },
  {
    files: ["tests/**/*.{test,spec}.{ts,tsx,js,jsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      // Relax naming conventions in tests
      "@typescript-eslint/naming-convention": "off",
    },
  },
);
