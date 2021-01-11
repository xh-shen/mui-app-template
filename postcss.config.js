/*
 * @Author: shen
 * @Date: 2021-01-07 15:21:37
 * @LastEditors: shen
 * @LastEditTime: 2021-01-10 00:26:25
 * @Description:
 */
module.exports = {
  plugins: [
    require('autoprefixer')({
      overrideBrowserslist: ['iOS >= 7', 'Android > 4.1', 'Firefox > 20', 'last 2 versions'],
    }),
  ],
};
