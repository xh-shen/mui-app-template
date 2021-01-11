/*
 * @Author: shen
 * @Date: 2021-01-10 00:13:07
 * @LastEditors: shen
 * @LastEditTime: 2021-01-10 00:57:30
 * @Description:
 */
module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ['prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'spaced-comment': [2, 'always'],
    'no-sparse-arrays': [2],
    'comma-dangle': [0],
  },
};
