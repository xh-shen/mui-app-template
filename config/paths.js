/*
 * @Author: shen
 * @Date: 2021-01-10 11:20:12
 * @LastEditors: shen
 * @LastEditTime: 2021-01-10 19:24:56
 * @Description:
 */
'use strict';

const path = require('path');
const fs = require('fs');
const { getPublicPath } = require('./util');
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const publicPath = getPublicPath(process.env.NODE_ENV === 'development', process.env.PUBLIC_URL);

const moduleFileExtensions = ['js', 'json'];

module.exports = {
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appBuild: resolveApp('dist'),
  appStatic: resolveApp('static'),
  appPages: resolveApp('src/pages'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  appNodeModules: resolveApp('node_modules'),
  appManifestJson: resolveApp('manifest.json'),
  appBuildManifestJson: resolveApp('dist/manifest.json'),
  publicPath,
};

module.exports.moduleFileExtensions = moduleFileExtensions;
