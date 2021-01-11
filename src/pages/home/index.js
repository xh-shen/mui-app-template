/*
 * @Author: shen
 * @Date: 2021-01-06 12:43:16
 * @LastEditors: shen
 * @LastEditTime: 2021-01-11 13:59:19
 * @Description:
 */
// 在这里引入当前页面样式文件
import './index.scss';
document.addEventListener('click', async () => {
  try {
    // 异步导入模块
    const res = await (await import(/* webpackPrefetch: true, webpackChunkName: "click" */ './click.js')).default;
    console.log(res);
  } catch (error) {
    console.log(error);
  }
});
// 环境配置
console.log(process.env);
// 全局mui
console.log(mui);

console.log(123123);
