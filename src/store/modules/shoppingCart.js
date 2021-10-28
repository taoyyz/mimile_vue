/*
 * @Description: 购物车状态模块
 * @Base: hai-27
 * @Author: taoyyz
 * @Date: 2020-02-21 18:40:41
 * @LastEditors: taoyyz
 * @LastEditTime: 2021-10-24 15:18:22
 */
import store from "../index"
import {AxiosInstance} from "@/main";

export default {
    state: {
        shoppingCart: []
        // shoppingCart结构
        /*
        shoppingCart = {
          id: "", // 购物车id
          productID: "", // 商品id
          productName: "", // 商品名称
          productImg: "", // 商品图片
          price: "", // 商品价格
          num: "", // 商品数量
          maxNum: "", // 商品限购数量
          check: false // 是否勾选
        } */
    },
    getters: {
        getShoppingCart(state) {
            // 获取购物车状态
            return state.shoppingCart;
        },
        getNum(state) {
            // 购物车商品总数量
            return state.shoppingCart.length;
        },
        getCheckGoods(state) {
            // 获取勾选的商品信息
            // 用于确认订单页面
            let checkGoods = [];
            for (let i = 0; i < state.shoppingCart.length; i++) {
                const temp = state.shoppingCart[i];
                if (temp.checked) {
                    checkGoods.push(temp);
                }
            }
            console.log(checkGoods)
            return checkGoods;
        },
        getCheckNum(state) {
            // 获取购物车勾选的商品数量
            let totalNum = 0;
            for (let i = 0; i < state.shoppingCart.length; i++) {
                const temp = state.shoppingCart[i];
                if (temp.checked) {
                    totalNum += 1;
                }
            }
            return totalNum;
        },
        getTotalPrice(state) {
            // 购物车勾选的商品总价格
            let totalPrice = 0;
            for (let i = 0; i < state.shoppingCart.length; i++) {
                const temp = state.shoppingCart[i];
                if (temp.checked) {
                    totalPrice += temp.productPrice * temp.count;
                }
            }
            return totalPrice.toFixed(2);
        },
        getDiscountPrice(state) {
            let discountPrice = 0;
            for (let i = 0; i < state.shoppingCart.length; i++) {
                const temp = state.shoppingCart[i];
                if (temp.checked) {
                    discountPrice += temp.nowPrice * temp.count;
                }
            }
            return discountPrice.toFixed(2);
        }
    },
    mutations: {
        setShoppingCart(state, data) {
            // 设置购物车状态
            state.shoppingCart = data;
        },
        unshiftShoppingCart(state, data) {
            // 添加购物车
            // 用于在商品详情页点击添加购物车,后台添加成功后，更新vuex状态
            state.shoppingCart.unshift(data);
        },
        addShoppingCartNum(state, productID) {
            // 增加购物车商品数量
            // 用于在商品详情页点击添加购物车,后台返回002，“该商品已在购物车，数量 +1”，更新vuex的商品数量
            for (let i = 0; i < state.shoppingCart.length; i++) {
                const temp = state.shoppingCart[i];
                if (temp.id === productID) {
                    if (temp.count < temp.maxNum) {
                        temp.count++;
                    }
                }
            }
        },
        deleteShoppingCart(state, params) {
            // 根据购物车id删除购物车商品
            for (let i = 0; i < this.state.shoppingCart.shoppingCart.length; i++) {
                if (this.state.shoppingCart.shoppingCart[i].id == params.id)
                    this.state.shoppingCart.shoppingCart.splice(i, 1);
            }
            // this.state.shoppingCart.shoppingCart.splice(id, 1);
            //删除掉购物车数据库中的记录
            //如果点击的购物车后面的删除按钮删除的，而不是结算购物车时的删除，这时候不需要再次发送axios请求删除
            if (params.isBtnDel) {
                return;
            } else {
                AxiosInstance.post('/shopCart/deleteByUidAndPid', {
                    uid: store.getters.getUser.id,
                    pid: params.id
                }).then().catch(err => console.log(err));
            }
        },
    },
    actions: {
        setShoppingCart({commit}, data) {
            commit('setShoppingCart', data);
        },
        unshiftShoppingCart({commit}, data) {
            commit('unshiftShoppingCart', data);
        },
        /*updateShoppingCart ({ commit }, payload) {
          commit('updateShoppingCart', payload);
        },*/
        addShoppingCartNum({commit}, productID) {
            commit('addShoppingCartNum', productID);
        },
        /*
            params对象包含两个参数，一个id，一个isBtnDel
                id是要删除的商品pid
                isBtnDel是一个boolean值，表示这个删除操作是不是由"购物车页面"的商品列表后面的删除按钮触发的
                    如果是由"购物车页面"的商品列表后面的删除按钮触发，那么已经在该方法中执行了数据库删除，
                    不需要再发送axios请求后端删除，否则总会得到一个删除失败的响应
                    如果是由"结算页面"触发的，那么需要在此方法中发送axios请求删除数据库中的记录
        */
        deleteShoppingCart({commit}, params) {
            commit('deleteShoppingCart', params);
        },
    }
}