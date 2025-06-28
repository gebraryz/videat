// i18next-parser.config.js

const i18nParserConfig = {
  locales: ["en", "pl"],
  defaultLocale: "en",
  defaultValue: "__TRANSLATION_MISSING__",
  output: "messages/$LOCALE.json",
  input: [
    "app/**/*.{js,ts,tsx}",
    "!app/**/node_modules/**",
    "components/**/*.{js,ts,tsx}",
  ],
  functions: ["t"],
  defaultNamespace: "translation",
  sort: true,
};

export default i18nParserConfig;
