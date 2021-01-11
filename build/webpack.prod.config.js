/*
 * @Author: shen
 * @Date: 2021-01-06 12:37:15
 * @LastEditors: shen
 * @LastEditTime: 2021-01-11 13:53:12
 * @Description:
 */
'use strict';

process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

process.on('unhandledRejection', (err) => {
  throw err;
});

require('../config/env');

const configFactory = require('./webpack.config');
const paths = require('../config/paths');
const { checkRequiredFiles } = require('../config/util');

if (!checkRequiredFiles(paths.appManifestJson)) {
  process.exit(1);
}

module.exports = configFactory('production')