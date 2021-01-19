/*
 * @Author: shen
 * @Date: 2021-01-11 09:20:48
 * @LastEditors: shen
 * @LastEditTime: 2021-01-19 12:20:53
 * @Description: 
 */
'use strict';
const fs = require('fs');
const path = require('path');
const fg = require('fast-glob');
const paths = require('../config/paths');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const cssOutputPath = 'static/css/';
const jsOutputPath = 'static/js/';

module.exports = function addAssets() {
  const htmlTagPlugin = [];
  const jsFiles = fg.sync([paths.appStatic + '/**/*.js'], { dot: false });
  const cssFiles = fg.sync([paths.appStatic + '/**/*.css'], { dot: false });
  jsFiles.forEach((item) => {
    htmlTagPlugin.push(
      new HtmlWebpackTagsPlugin({ scripts: `${jsOutputPath}${path.basename(item)}`, append: false })
    )
  })
  cssFiles.forEach((item) => {
    htmlTagPlugin.push(
      new HtmlWebpackTagsPlugin({ links: `${cssOutputPath}${path.basename(item)}`, append: false })
    )
  })
  return htmlTagPlugin
};
