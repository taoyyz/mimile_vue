/*
 * @Description: 用户登录状态模块
 * @Base: hai-27
 * @Author: taoyyz
 * @Date: 2020-02-21 18:40:41
 * @LastEditors: taoyyz
 * @LastEditTime: 2021-10-24 15:18:22
 */
export default {
  state: {
    user: "", // 登录的用户
    discount: '', //当前用户的折扣
    showLogin: false // 用于控制是否显示登录组件
  },
  getters: {
    getUser(state) {
      return state.user
    },
    getDiscount(state) {
      return state.discount
    },
    getShowLogin(state) {
      return state.showLogin
    }
  },
  mutations: {
    setUser(state, data) {
      state.user = data;
    },
    setDiscount(state, data) {
      state.discount = data;
    },
    setShowLogin(state, data) {
      state.showLogin = data;
    }
  },
  actions: {
    setUser({commit}, data) {
      commit('setUser', data);
    },
    setDiscount({commit}, data) {
      commit('setDiscount', data);
    },
    setShowLogin({commit}, data) {
      commit('setShowLogin', data);
    }
  }
}