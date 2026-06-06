<<<<<<< HEAD
=======
// @ts-check
>>>>>>> 15cbbc06f1931aee169e6a7d908c5a8ef96a9d2b
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
<<<<<<< HEAD
      ecmaVersion: 5,
      sourceType: 'module',
=======
      sourceType: 'commonjs',
>>>>>>> 15cbbc06f1931aee169e6a7d908c5a8ef96a9d2b
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
<<<<<<< HEAD
      '@typescript-eslint/no-unsafe-argument': 'warn',
    },
  },
);
=======
      '@typescript-eslint/no-unsafe-argument': 'warn'
    },
  },
);
>>>>>>> 15cbbc06f1931aee169e6a7d908c5a8ef96a9d2b
