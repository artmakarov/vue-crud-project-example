import type { Config } from 'prettier';

const config: Config = {
  $schema: 'https://json.schemastore.org/prettierrc',
  semi: true,
  singleQuote: true,
  printWidth: 80,
  trailingComma: 'all',
  arrowParens: 'always',
  bracketSpacing: true,
  bracketSameLine: false,
  vueIndentScriptAndStyle: false,
};

export default config;
