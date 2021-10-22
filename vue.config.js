/*
 * @Description: 配置文件
 * @Author: hai-27
 * @Date: 2020-02-07 16:23:00
 * @LastEditors: hai-27
 * @LastEditTime: 2021-03-03 22:32:57
 */
module.exports = {
  publicPath: './',
  devServer: {
    open: true,
    proxy: {
      /*匹配以/api开头的请求映射到target的url上去*/
      '/api': {
        target: 'http://localhost:10010/', // 本地后端地址
        //target: 'http://106.15.179.105:3000/', // 线上后端地址
        changeOrigin: true, //允许跨域
        pathRewrite: {
          '^/api': '' //把/api替换成无
        }
      }
    }
  }
}