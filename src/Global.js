/*
 * @Description: 全局变量
 * @Base: hai-27
 * @Author: taoyyz
 * @Date: 2020-02-21 18:40:41
 * @LastEditors: taoyyz
 * @LastEditTime: 2021-10-24 15:18:22
 */
exports.install = function (Vue) {
  // Vue.prototype.$target = "http://106.15.179.105:3000/"; // 线上后端地址
  Vue.prototype.$target = "http://localhost:10010/"; // 本地后端地址
  Vue.prototype.$targetVue = "http://localhost:8080/product_img/"; // 前端部署地址
  // 封装提示成功的弹出框
  Vue.prototype.notifySucceed = function (msg) {
    this.$notify({
      title: "成功",
      message: msg,
      type: "success",
      offset: 100
    });
  };
  // 封装提示失败的弹出框
  Vue.prototype.notifyError = function (msg) {
    this.$notify.error({
      title: "错误",
      message: msg,
      offset: 100
    });
  };
}