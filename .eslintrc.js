module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:cypress/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'vue',
    'import',
    'cypress',
  ],
  rules: {
    // General JavaScript rules
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'no-console': 'warn',
    'no-debugger': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
    
    // Cypress specific rules
    'cypress/no-unnecessary-waiting': 'warn',
    'cypress/assertion-before-screenshot': 'warn',
  },
  overrides: [
    {
      files: ['cypress/**/*.js'],
      env: {
        'cypress/globals': true,
      },
      rules: {
        'import/no-extraneous-dependencies': 'off',
        'no-unused-expressions': 'off',
      },
    },
    {
      files: ['src/**/*.vue'],
      extends: ['plugin:vue/vue3-essential'],
      rules: {
        'vue/multi-word-component-names': 'off',
        'vue/no-v-html': 'off',
      },
    },
  ],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    'public/',
    'data-scripts/',
  ],
};
