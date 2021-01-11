/*
 * @Author: shen
 * @Date: 2021-01-11 09:20:48
 * @LastEditors: shen
 * @LastEditTime: 2021-01-11 10:00:00
 * @Description: 
 */
'use strict';
const fs = require('fs');
const path = require('path');
const fg = require('fast-glob');
const paths = require('../config/paths');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const cssOutputPath = 'static/css/';
const jsOutputPath = 'static/js/';

module.exports = function addAssets() {
  const assetOptions = []
  const jsFiles = fg.sync([paths.appStatic + '/**/*.js'], { dot: false });
  const cssFiles = fg.sync([paths.appStatic + '/**/*.css'], { dot: false });
  jsFiles.forEach((item) => {
    assetOptions.push({
      filepath: item,
      outputPath: jsOutputPath,
      publicPath: paths.publicPath + jsOutputPath,
    })
  })
  cssFiles.forEach((item) => {
    assetOptions.push({
      filepath: item,
      outputPath: cssOutputPath,
      typeOfAsset: 'css',
      publicPath: paths.publicPath + cssOutputPath,
    })
  })
  return new AddAssetHtmlPlugin(assetOptions);
};
