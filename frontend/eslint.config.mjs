import nextConfig from "eslint-config-next";
import tailwind from "eslint-plugin-tailwindcss";

const eslintConfig = [
  ...nextConfig,
  tailwind.configs.recommended,
  {
    settings: {
      tailwindcss: {
        cssConfigPath: "src/app/globals.css",
      },
    },
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
      "tailwindcss/no-custom-classname": "off",
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unsafe-assignment": "warn",
    },
  },
  {
    files: ["src/**/*.{tsx,jsx}"],
    ignores: ["src/**/*.test.{tsx,jsx}", "src/tests/**"],
    rules: {
      "max-lines": [
        "error",
        {
          max: 150,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "storybook-static/**",
      ".storybook/**",
      "next-env.d.ts",
      "src/graphql/generated/**",
    ],
  },
];

export default eslintConfig;
