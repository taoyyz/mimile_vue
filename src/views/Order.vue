<!--
 * @Description: 订单页面组件
 * @Base: hai-27
 * @Author: taoyyz
 * @Date: 2020-02-21 18:40:41
 * @LastEditors: taoyyz
 * @LastEditTime: 2021-10-24 15:18:22
 -->
<template>
  <div class="order">
    <!-- 我的订单头部 -->
    <div class="order-header">
      <div class="order-header-content">
        <p>
          <i class="el-icon-s-order" style="font-size: 30px;color: #ff6700;"></i>
          我的订单
        </p>
      </div>
    </div>
    <!-- 我的订单头部END -->

    <!-- 我的订单主要内容 -->
    <div class="order-content" v-if="ordersList.length>0">
      <div class="content" v-for="(order,index) in ordersList" :key="index">
        <ul>
          <!-- 我的订单表头 -->
          <li class="order-info">
            <div class="order-id">订单编号: {{ order[0].orderUuid }}</div>
            <div class="order-time">订单时间: {{ order[0].createTime | dateFormat }}</div>
          </li>
          <li class="header">
            <div class="pro-img"></div>
            <div class="pro-name">商品名称</div>
            <div class="pro-price">单价</div>
            <div class="pro-num">数量</div>
            <div class="pro-total">小计</div>
          </li>
          <!-- 我的订单表头END -->
          <!--            <h1>{{productArr[index].productName}}</h1>-->
          <!-- 订单列表 -->
          <li class="product-list" v-for="(product,i) in productsList[index]" :key="product.id">
            <div class="pro-img">
              <router-link :to="{ path: '/goods/details', query: {productID:product.id} }">
                <img :src="$targetVue + product.productPicture"/>
              </router-link>
            </div>
            <div class="pro-name">
              <router-link
                  :to="{ path: '/goods/details', query: {productID:product.id} }"
              >{{ product.productName }}
              </router-link>
            </div>
            <div class="pro-price">{{ (product.productPrice * (order[i].discount / 100)).toFixed(2) }}元</div>
            <div class="pro-num">{{ order[i].count }}</div>
            <div class="pro-total pro-total-in">
              {{ (product.productPrice * (order[i].discount / 100) * order[i].count).toFixed(2) }}元
            </div>
          </li>
        </ul>
        <div class="order-bar">
          <div class="order-bar-left">
             <span class="order-total">
                 共
                 <span class="order-total-num">{{ order.length }}</span>件商品
             </span>
          </div>
          <div class="order-bar-right">
            <span>
              <span class="total-price-title">合计：</span>
              <span class="total-price">{{ getTotal(order) }}元</span>
            </span>
          </div>
          <!-- 订单列表END -->
        </div>
      </div>
      <div style="margin-top:-40px;"></div>
    </div>
    <!-- 我的订单主要内容END -->

    <!-- 订单为空的时候显示的内容 -->
    <div v-else class="order-empty">
      <div class="empty">
        <h2>您的订单还是空的！</h2>
        <p>快去购物吧！</p>
      </div>
    </div>
    <!-- 订单为空的时候显示的内容END -->
  </div>
</template>
<script>
// import user from '../store/modules/user'

export default {
  data() {
    return {
      ordersList: [], // 订单列表
      productsList: [],
      total: [] // 每个订单的商品数量及总价列表
    };
  },
  activated() {
    // 获取订单数据
    this.$axios
        .get("/order/getAll/" + this.$store.getters.getUser.id)
        // .get("/order/getAll/10")
        .then(res => {
          if (res.data.data.code === "001") {
            this.ordersList = res.data.data.ordersList;
            this.productsList = res.data.data.productsList;
          } else {
            this.notifyError(res.data.data.msg);
          }
        })
        .catch(err => {
          return Promise.reject(err);
        });
    // this.$axios.get("/product/get")
  },
  methods: {
    //获取此order订单的总价格
    getTotal(order) {
      let total = 0;
      for (let i = 0; i < order.length; i++) {
        total += (order[i].orderPrice * (order[i].discount / 100));
      }
      return total.toFixed(2);
    }
  }
};
</script>
<style scoped>
.order {
  background-color: #f5f5f5;
  padding-bottom: 20px;
}

/* 我的订单头部CSS */
.order .order-header {
  height: 64px;
  border-bottom: 2px solid #ff6700;
  background-color: #fff;
  margin-bottom: 20px;
}

.order .order-header .order-header-content {
  width: 1225px;
  margin: 0 auto;
}

.order .order-header p {
  font-size: 28px;
  line-height: 58px;
  float: left;
  font-weight: normal;
  color: #424242;
}

/* 我的订单头部CSS END */
.order .content {
  width: 1225px;
  margin: 0 auto;
  background-color: #fff;
  margin-bottom: 50px;
}

.order .content ul {
  background-color: #fff;
  color: #424242;
  line-height: 85px;
}

/* 我的订单表头CSS */
.order .content ul .order-info {
  height: 60px;
  line-height: 60px;
  padding: 0 26px;
  color: #424242;
  border-bottom: 1px solid #ff6700;
}

.order .content ul .order-info .order-id {
  float: left;
  color: #ff6700;
}

.order .content ul .order-info .order-time {
  float: right;
}

.order .content ul .header {
  height: 85px;
  padding-right: 26px;
  color: #424242;
}

/* 我的订单表头CSS END */

/* 订单列表CSS */
.order .content ul .product-list {
  height: 85px;
  padding: 15px 26px 15px 0;
  border-top: 1px solid #e0e0e0;
}

.order .content ul .pro-img {
  float: left;
  height: 85px;
  width: 120px;
  padding-left: 80px;
}

.order .content ul .pro-img img {
  height: 80px;
  width: 80px;
}

.order .content ul .pro-name {
  float: left;
  width: 380px;
}

.order .content ul .pro-name a {
  color: #424242;
}

.order .content ul .pro-name a:hover {
  color: #ff6700;
}

.order .content ul .pro-price {
  float: left;
  width: 160px;
  padding-right: 18px;
  text-align: center;
}

.order .content ul .pro-num {
  float: left;
  width: 190px;
  text-align: center;
}

.order .content ul .pro-total {
  float: left;
  width: 160px;
  padding-right: 81px;
  text-align: right;
}

.order .content ul .pro-total-in {
  color: #ff6700;
}

.order .order-bar {
  width: 1185px;
  padding: 0 20px;
  border-top: 1px solid #ff6700;
  height: 50px;
  line-height: 50px;
  background-color: #fff;
}

.order .order-bar .order-bar-left {
  float: left;
}

.order .order-bar .order-bar-left .order-total {
  color: #757575;
}

.order .order-bar .order-bar-left .order-total-num {
  color: #ff6700;
}

.order .order-bar .order-bar-right {
  float: right;
}

.order .order-bar .order-bar-right .total-price-title {
  color: #ff6700;
  font-size: 14px;
}

.order .order-bar .order-bar-right .total-price {
  color: #ff6700;
  font-size: 30px;
}

/* 订单列表CSS END */

/* 订单为空的时候显示的内容CSS */
.order .order-empty {
  text-align: center;
  width: 1225px;
  margin: 0 auto;
}

.order .order-empty .empty {
  height: 300px;
  margin: 65px 0 0;
  color: #b0b0b0;
  overflow: hidden;
}

.order .order-empty .empty h2 {
  margin: 70px 0 15px;
  font-size: 36px;
}

.order .order-empty .empty p {
  margin: 0 0 20px;
  font-size: 20px;
}

/* 订单为空的时候显示的内容CSS END */
</style>