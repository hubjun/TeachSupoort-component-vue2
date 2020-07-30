module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  globals: {
    "arguments": true,
    "window": true,
    "Promise": true
  },
  rules: {
    'no-console': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-trailing-spaces': 0,
    'indent': [0, 2, {
      'SwitchCase': 1
    }],
    'space-before-function-paren': [0, 'always'],
    'prefer-const': 0,
    'init-declarations': 0,
    'keyword-spacing': 0,
    'no-multiple-empty-lines': 0,
    'semi': 0,
    'no-unused-vars': 0,
    'vue/no-unused-vars': 0,
    'vue/no-unused-components': 0,
    'no-multi-spaces': 0
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
