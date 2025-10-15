import prettierPluginAstro from "prettier-plugin-astro";
import prettierPluginTailwindcss from "prettier-plugin-tailwindcss";

export default {
  plugins: [prettierPluginAstro, prettierPluginTailwindcss],
  pluginSearchDirs: false,
  printWidth: 100,
  semi: true,
  singleQuote: false,
  trailingComma: "es5",
  tabWidth: 2,
  endOfLine: "lf",
};
