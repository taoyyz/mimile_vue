<!--
 * @Description: 购物车页面组件
 * @Base: hai-27
 * @Author: taoyyz
 * @Date: 2020-02-21 18:40:41
 * @LastEditors: taoyyz
 * @LastEditTime: 2021-10-24 15:18:22
 -->

<template>
  <div class="shoppingCart">
    <!-- 购物车头部 -->
    <div class="cart-header">
      <div class="cart-header-content">
        <p>
          <i class="el-icon-shopping-cart-full" style="color:#ff6700; font-weight: 600;"></i>
          我的购物车
        </p>
        <span>温馨提示：产品是否购买成功，以最终下单为准哦，请尽快结算</span>
      </div>
    </div>
    <!-- 购物车头部END -->

    <!-- 购物车有内容时的主要内容区 -->
    <div class="content" v-if="getShoppingCart.length>0">
      <ul>
        <!-- 购物车表头 -->
        <li class="header">
          <div class="pro-check" @click.prevent.stop="checkAll">
            <el-checkbox v-model="checkedAll">全选</el-checkbox>
          </div>
          <div class="pro-img"></div>
          <div class="pro-name">商品名称</div>
          <div class="pro-price">单价</div>
          <div class="pro-num">数量</div>
          <div class="pro-total">小计</div>
          <div class="pro-action">操作</div>
        </li>
        <!-- 购物车表头END -->

        <!-- 购物车列表 -->
        <li class="product-list" v-for="(item,index) in productList" :key="item.id">
          <div class="pro-check">
            <el-checkbox :value="item.checked" @change="checkChange($event,index)"></el-checkbox>
          </div>
          <div class="pro-img">
            <router-link :to="{ path: '/goods/details', query: {productID:item.id} }">
              <img :src="$targetVue + item.productPicture"/>
            </router-link>
          </div>
          <div class="pro-name">
            <router-link
                :to="{ path: '/goods/details', query: {productID:item.id} }"
            >{{ item.productName }}
            </router-link>
          </div>
          <div class="pro-price">
            <span>{{ item.nowPrice }}元</span>&nbsp;&nbsp;
            <span
                v-show="item.nowPrice != item.productPrice"
                class="del"
            >{{ item.productPrice }}元</span>
          </div>
          <div class="pro-num">
            <el-input-number
                size="small"
                :value="item.count"
                @change="handleChange($event,index,item.id)"
                :min="1"
                :max="999"
            ></el-input-number>
          </div>
          <div class="pro-total pro-total-in">
            <span>{{ toFixed2(item.nowPrice * item.count) }}元</span>&nbsp;&nbsp;&nbsp;
            <span
                v-show="item.nowPrice != item.productPrice"
                class="del"
            >{{ toFixed2(item.productPrice * item.count) }}元</span>
          </div>
          <div class="pro-action">
            <el-popover placement="right">
              <p>确定删除吗？</p>
              <div style="text-align: right; margin: 10px 0 0">
                <el-button
                    type="primary"
                    size="mini"
                    @click="deleteItem($event,index,item.id)"
                >确定
                </el-button>
              </div>
              <i class="el-icon-error" slot="reference" style="font-size: 18px;"></i>
            </el-popover>
          </div>
        </li>
        <!-- 购物车列表END -->
      </ul>
      <div style="height:20px;background-color: #f5f5f5"></div>
      <!-- 购物车底部导航条 -->
      <div class="cart-bar">
        <div class="cart-bar-left">
          <span>
            <router-link to="/goods">继续购物</router-link>
          </span>
          <span class="sep">|</span>
          <span class="cart-total">共
            <span class="cart-total-num">{{ getNum }}</span> 件商品，已选择
            <span class="cart-total-num">{{ computeSelectedNum }}</span> 件
          </span>
        </div>
        <div class="cart-bar-right">
          <span>
            <span class="total-price-title">合计：</span>
            <span class="total-price">{{ getTotalPrice }}元</span>
          </span>
          <router-link :to="computeSelectedNum > 0 ? '/confirmOrder' : ''">
            <div :class="computeSelectedNum > 0 ? 'btn-primary' : 'btn-primary-disabled'">去结算</div>
          </router-link>
        </div>
      </div>
      <!-- 购物车底部导航条END -->
    </div>
    <!-- 购物车主要内容区END -->

    <!-- 否则购物车为空的时候显示的内容 -->
    <div v-else class="cart-empty">
      <div class="empty">
        <h2>您的购物车还是空的！</h2>
        <p>快去购物吧！</p>
      </div>
    </div>
    <!-- 购物车为空的时候显示的内容END -->
  </div>
</template>
<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: 'ShoppingCart',
  data() {
    return {
      productList: [],
      checkedAll: false,
      selectedNum: 0,
      discount: 0
    }
  },
  created() {
    this.$axios.get("/shopCart/listShopCartById/" + this.$store.getters.getUser.id).then(res => {
      if (res.data.data.code === "001") {
        // 001 为成功, 更新vuex购物车状态
        this.productList = res.data.data.productList;
        for (let i = 0; i < this.productList.length; i++) {
          this.productList[i].nowPrice = (this.productList[i].productPrice * this.$store.state.discount).toFixed(2);
        }
        this.setShoppingCart(res.data.data.productList);
      } else {
        // 提示失败信息
        this.notifyError(res.data.data.msg);
      }
    }).catch(err => {
      return Promise.reject(err);
    });
  },
  activated() {
    this.checkedAll = false;
    this.$axios.get("/shopCart/listShopCartById/" + this.$store.getters.getUser.id).then(res => {
      if (res.data.data.code === "001") {
        // 001 为成功, 更新vuex购物车状态
        this.productList = res.data.data.productList;
        for (let i = 0; i < this.productList.length; i++) {
          this.productList[i].nowPrice = (this.productList[i].productPrice * this.$store.state.discount).toFixed(2);
        }
        this.setShoppingCart(res.data.data.productList);
      } else {
        // 提示失败信息
        this.notifyError(res.data.data.msg);
      }
    }).catch(err => {
      return Promise.reject(err);
    });
  },
  updated() {
    this.productList = this.getShoppingCart;
  },
  methods: {
    ...mapActions(["updateShoppingCart", "setShoppingCart", "deleteShoppingCart"/*, "checkAll"*/]),
    // 修改商品数量的时候调用该函数
    handleChange(currentValue, key, productID) {
      this.productList[key].count = currentValue;
      // 当修改数量时，默认勾选
      // this.updateShoppingCart({key: key, prop: "check", val: true});
      // 向后端发起更新购物车的数据库信息请求
      this.$axios.post("/shopCart/updateShoppingCart", {
        uid: this.$store.getters.getUser.id,
        pid: productID,
        count: currentValue
      }).then(res => {
        switch (res.data.data.code) {
          case "001":
            // “001”代表更新成功
            // 提示更新成功信息
            // this.notifySucceed(res.data.data.msg);
            break;
          default:
            // 提示更新失败信息
            this.notifyError(res.data.data.msg);
        }
      }).catch(err => {
        return Promise.reject(err);
      });
    },
    checkChange(val, key) {
      let ckAll = true;
      this.productList[key].checked = !this.productList[key].checked;
      for (let product of this.productList) {
        if (!product.checked)
          ckAll = false;
      }
      this.checkedAll = ckAll;
      // 更新vuex中购物车商品是否勾选的状态
      // this.updateShoppingCart({key: key, prop: "check", val: val});
    },
    // 向后端发起删除购物车的数据库信息请求
    deleteItem(e, index, productID) {
      this.$axios
          .post("/shopCart/deleteByUidAndPid", {
            uid: this.$store.getters.getUser.id,
            pid: productID
          })
          .then(res => {
            switch (res.data.data.code) {
              case "001":
                // “001” 删除成功
                // 更新vuex状态
                this.deleteShoppingCart({id: productID, isBtnDel: true});
                // 提示删除成功信息
                this.notifySucceed(res.data.data.msg);
                break;
              default:
                // 提示删除失败信息
                this.notifyError(res.data.data.msg);
            }
          })
          .catch(err => {
            return Promise.reject(err);
          });
    },
    checkAll() {
      let checkedAll = true;
      //判断是否全部勾选，如果不是，就勾选全部
      for (let product of this.productList) {
        if (!product.checked) {
          checkedAll = false;
        }
      }
      if (checkedAll) {
        //全部取消勾选
        this.checkedAll = false;
        for (let product of this.productList) {
          product.checked = false;
        }
      } else {
        //全部勾选
        this.checkedAll = true;
        for (let product of this.productList) {
          product.checked = true;
        }
      }
    },
    toFixed2(num) {
      return num.toFixed(2);
    }
  },
  computed: {
    ...mapGetters([
      "getShoppingCart",
      "getCheckNum",
      "getNum"
    ]),
    computeSelectedNum() {
      let count = 0;
      for (let pro of this.productList) {
        if (pro.checked) count++;
      }
      return count;
    },
    getTotalPrice() {
      let totalPrice = 0;
      for (let pro of this.productList) {
        if (pro.checked)
          totalPrice += pro.nowPrice * pro.count;
      }
      return totalPrice.toFixed(2);
    }
  }
};
</script>
<style scoped>
.shoppingCart {
  background-color: #f5f5f5;
  padding-bottom: 20px;
}

/* 购物车头部CSS */
.shoppingCart .cart-header {
  height: 64px;
  border-bottom: 2px solid #ff6700;
  background-color: #fff;
  margin-bottom: 20px;
}

.shoppingCart .cart-header .cart-header-content {
  width: 1225px;
  margin: 0 auto;
}

.shoppingCart .cart-header p {
  font-size: 28px;
  line-height: 58px;
  float: left;
  font-weight: normal;
  color: #424242;
}

.shoppingCart .cart-header span {
  color: #757575;
  font-size: 12px;
  float: left;
  height: 20px;
  line-height: 20px;
  margin-top: 30px;
  margin-left: 15px;
}

/* 购物车头部CSS END */

/* 购物车主要内容区CSS */
.shoppingCart .content {
  width: 1225px;
  margin: 0 auto;
  background-color: #fff;
}

.shoppingCart .content ul {
  background-color: #fff;
  color: #424242;
  line-height: 85px;
}

/* 购物车表头及CSS */
.shoppingCart .content ul .header {
  height: 85px;
  padding-right: 26px;
  color: #424242;
}

.shoppingCart .content ul .product-list {
  height: 85px;
  padding: 15px 26px 15px 0;
  border-top: 1px solid #e0e0e0;
}

.shoppingCart .content ul .pro-check {
  float: left;
  height: 85px;
  width: 110px;
}

.shoppingCart .content ul .pro-check .el-checkbox {
  font-size: 16px;
  margin-left: 24px;
}

.shoppingCart .content ul .pro-img {
  float: left;
  height: 85px;
  width: 120px;
}

.shoppingCart .content ul .pro-img img {
  height: 80px;
  width: 80px;
}

.shoppingCart .content ul .pro-name {
  float: left;
  width: 360px;
}

.shoppingCart .content ul .pro-name a {
  color: #424242;
}

.shoppingCart .content ul .pro-name a:hover {
  color: #ff6700;
}

.shoppingCart .content ul .pro-price {
  float: left;
  width: 140px;
  padding-right: 18px;
  text-align: center;
}

.del {
  font-size: 16px;
  color: #b0b0b0;
  text-decoration: line-through;
}

.shoppingCart .content ul .pro-num {
  float: left;
  width: 150px;
  text-align: center;
}

.shoppingCart .content ul .pro-total {
  float: left;
  width: 180px;
  /*padding-right: 81px;*/
  margin: 0 20px;
  text-align: center;
}

.shoppingCart .content ul .pro-total-in {
  font-size: 20px;
  color: #ff6700;
}

.shoppingCart .content ul .pro-action {
  float: left;
  width: 80px;
  text-align: center;
}

.shoppingCart .content ul .pro-action i:hover {
  color: #ff6700;
}

/* 购物车表头及CSS END */

/* 购物车底部导航条CSS */
.shoppingCart .cart-bar {
  width: 1225px;
  height: 50px;
  line-height: 50px;
  background-color: #fff;
}

.shoppingCart .cart-bar .cart-bar-left {
  float: left;
}

.shoppingCart .cart-bar .cart-bar-left a {
  line-height: 50px;
  margin-left: 32px;
  color: #757575;
}

.shoppingCart .cart-bar .cart-bar-left a:hover {
  color: #ff6700;
}

.shoppingCart .cart-bar .cart-bar-left .sep {
  color: #eee;
  margin: 0 20px;
}

.shoppingCart .cart-bar .cart-bar-left .cart-total {
  color: #757575;
}

.shoppingCart .cart-bar .cart-bar-left .cart-total-num {
  color: #ff6700;
}

.shoppingCart .cart-bar .cart-bar-right {
  float: right;
}

.shoppingCart .cart-bar .cart-bar-right .total-price-title {
  color: #ff6700;
  font-size: 14px;
}

.shoppingCart .cart-bar .cart-bar-right .total-price {
  color: #ff6700;
  font-size: 30px;
}

.shoppingCart .cart-bar .cart-bar-right .btn-primary {
  float: right;
  width: 200px;
  text-align: center;
  font-size: 18px;
  margin-left: 50px;
  background: #ff6700;
  color: #fff;
}

.shoppingCart .cart-bar .cart-bar-right .btn-primary-disabled {
  float: right;
  width: 200px;
  text-align: center;
  font-size: 18px;
  margin-left: 50px;
  background: #e0e0e0;
  color: #b0b0b0;
}

.shoppingCart .cart-bar .cart-bar-right .btn-primary:hover {
  background-color: #f25807;
}

/* 购物车底部导航条CSS END */
/* 购物车主要内容区CSS END */

/* 购物车为空的时候显示的内容CSS */
.shoppingCart .cart-empty {
  text-align: center;
  width: 1225px;
  margin: 0 auto;
}

.shoppingCart .cart-empty .empty {
  height: 300px;
  margin: 65px 0 0;
  color: #b0b0b0;
  overflow: hidden;
}

.shoppingCart .cart-empty .empty h2 {
  margin: 70px 0 15px;
  font-size: 36px;
}

.shoppingCart .cart-empty .empty p {
  margin: 0 0 20px;
  font-size: 20px;
}

/* 购物车为空的时候显示的内容CSS END */
</style>