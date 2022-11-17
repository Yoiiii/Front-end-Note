module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'standard'
    // 'recommended'
    // '@vue/typescript/recommended',
    // 'prettier'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: [
    'vue',
    '@typescript-eslint'
    // 'prettier'
  ],
  rules: {
    // 'prettier/prettier': 'error'
  }
}
