import pluginVue from 'eslint-plugin-vue';
import vueTsEslintConfig from '@vue/eslint-config-typescript';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';

export default [
  {
    name: 'app/files-to-ignore',
    ignores: [
      'public/**',
      '**/dist/**',
      '**/dist-ssr/**',
      '**/coverage/**',
      '**/node_modules/**',
      '**/.idea/**',
    ],
  },
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
    rules: {
      '@typescript-eslint/no-unused-expressions': [
        'error',
        { allowShortCircuit: true },
      ],
      curly: ['warn', 'multi-line', 'consistent'],
      'prefer-rest-params': 'warn',
      'spaced-comment': [
        'warn',
        'always',
        {
          //-+-+-+-+-+-+-+-+
          // Banner example
          //-+-+-+-+-+-+-+-+

          //----------------
          // Banner example
          //----------------
          line: {
            markers: ['/'],
            exceptions: ['-', '-+'],
          },

          /*****************
           * Banner example
           *****************/
          block: {
            markers: ['!'],
            exceptions: ['*'],
            balanced: true,
          },
        },
      ],
    },
  },
  ...pluginVue.configs['flat/recommended'],
  ...vueTsEslintConfig(),
  skipFormatting,
];
