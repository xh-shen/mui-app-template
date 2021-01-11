/*
 * @Author: shen
 * @Date: 2021-01-10 11:31:12
 * @LastEditors: shen
 * @LastEditTime: 2021-01-11 14:40:41
 * @Description:
 */
'use strict';

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

exports.getPublicPath = (isEnvDevelopment, envPublicUrl) => {
  if (envPublicUrl) {
    envPublicUrl = envPublicUrl.endsWith('/') ? envPublicUrl : envPublicUrl + '/';
    return isEnvDevelopment ? './' : envPublicUrl;
  }
  return isEnvDevelopment ? './' : '/';
};

exports.checkFile = (file) => {
  return new Promise((resolve) => {
    fs.access(file, fs.constants.F_OK, (err) => {
      err ? resolve(false) : resolve(true)
    });
  })
}

exports.checkRequiredFiles = (manifestJson) => {
  try {
    fs.accessSync(manifestJson, fs.F_OK);
    return true;
  } catch (err) {
    const dirName = path.dirname(manifestJson);
    const fileName = path.basename(manifestJson);
    console.log(chalk.red('Could not find a required file.'));
    console.log(chalk.red('  Name: ') + chalk.cyan(fileName));
    return false;
  }
};
