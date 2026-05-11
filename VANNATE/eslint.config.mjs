import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      ".next-production/**",
      ".next-final/**",
      ".next-vercel/**",
      ".next-live/**",
      ".runtime/**",
      "node_modules/**",
      "out/**",
      "build/**",
      "dist/**",
    ],
  },
  ...nextVitals,
  ...nextTs,
];

export default eslintConfig;
