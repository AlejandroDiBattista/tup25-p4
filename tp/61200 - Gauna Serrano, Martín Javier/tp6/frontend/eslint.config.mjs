import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.

  // Ignorar carpetas/archivos comunes del build/dev
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "node_modules/**",
    "dist/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
  // Reglas y ajustes generales del proyecto
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      // ajustes prácticos para TP y desarrollo
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "no-console": ["warn", { "allow": ["warn", "error"] }],
      "react/react-in-jsx-scope": "off", // Next ya provee React automáticamente
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "import/no-anonymous-default-export": "off"
    }
  }
]);