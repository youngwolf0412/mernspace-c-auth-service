import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  { ignores: ["dist", "node_modules", "eslint.config.mjs"] },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // "no-console": "error",
      // "dot-notation": "error",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          varsIgnorePattern: "^NODE_ENV$", // Ignore NODE_ENV variable
          argsIgnorePattern: "^_", // Ignore parameters starting with underscore
          ignoreRestSiblings: true, // Ignore rest properties
        },
      ],
    },
  },
);
