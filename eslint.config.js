import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  // 1) Global ignores — tek başına obje, sadece 'ignores' anahtarı
  { ignores: ["dist", "coverage", "node_modules"] },

  // 2) Temel öneriler
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // 3) Uygulama kaynakları
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
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
    },
  },

  // 4) Sunucu (Node ortamı)
  {
    files: ["server/**/*.ts"],
    languageOptions: {
      globals: globals.node,
    },
  },

  // 5) Proje kuralları (tüm TS dosyaları)
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
    },
  },

  // 6) Prettier çakışmalarını kapat (en son)
  prettier,
);
