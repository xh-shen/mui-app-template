/*
 * @Author: shen
 * @Date: 2021-01-11 10:01:08
 * @LastEditors: shen
 * @LastEditTime: 2021-01-11 14:17:58
 * @Description: 
 */
'use strict';
const fs = require('fs');
const path = require('path');
const fg = require('fast-glob');
const paths = require('../config/paths');
const chalk = require('chalk');
const { checkFile } = require('../config/util');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = async function addEntries(env) {
  const entries = {};
  const htmlPlugin = [];
  const pages = fs.readdirSync(paths.appPages);
  if (!pages || !pages.length) {
    console.log(chalk.red('Could not find a required entry file.'));
    process.exit(1);
  }
  for await (let pageName of pages) {
    const pagePath = path.join(paths.appPages, pageName);
    const statInfo = fs.statSync(pagePath);
    const isDir = statInfo.isDirectory();
    if (isDir) {
      const templatePath = path.join(pagePath, 'index.html');
      const entryPath = path.join(pagePath, 'index.js');
      const entry = await checkFile(entryPath);
      const template = await checkFile(templatePath);
      if(entry && template) {
        entries[pageName] = entryPath;
        htmlPlugin.push(
          new HtmlWebpackPlugin({
            template: templatePath,
            filename: `${pageName}.html`,
            chunks: ['common', 'vendors', pageName],
            templateParameters: env.raw,
            favicon: './static/favicon.ico'
          })
        )
      }
    }
  }
  if (!Object.keys(entries).length) {
    console.log(chalk.red('Could not find a required entry file.'));
    process.exit(1);
  }
  return {entries, htmlPlugin}
};