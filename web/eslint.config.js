import js from '@eslint/js'
import vuePlugin from 'eslint-plugin-vue'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import prettier from 'eslint-plugin-prettier'
import vueParser from 'vue-eslint-parser'

export default [
  js.configs.recommended,
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: {
          js: tsParser,
          jsx: tsParser,
          ts: tsParser,
          tsx: tsParser,
        },
        extraFileExtensions: ['.vue'],
      },
    },
    plugins: {
      'vue': vuePlugin,
      '@typescript-eslint': typescriptEslint,
      'prettier': prettier,
    },
    rules: {
      // Vue基础规则
      'vue/comment-directive': 'off',
      'vue/no-unused-vars': 'error',
      'vue/multi-word-component-names': 'off', // 允许单个单词的组件名

      // 禁用与Prettier冲突的Vue规则
      'vue/html-indent': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/html-closing-bracket-newline': 'off',
      'vue/html-closing-bracket-spacing': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/multiline-html-element-content-newline': 'off',
      'vue/first-attribute-linebreak': 'off',

      // Prettier规则
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: {
          js: tsParser,
          jsx: tsParser,
          ts: tsParser,
          tsx: tsParser,
        },
        extraFileExtensions: ['.vue'],
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
      'prettier': prettier,
    },
    rules: {
      ...typescriptEslint.configs.recommended.rules,
      'no-undef': 'off', // 为了解决console问题
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-object-type': 'off', // 为shims-vue.d.ts中的类型问题关闭此规则
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
]
