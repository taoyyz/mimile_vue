<!--
 * @Description: 确认订单页面组件
 * @Base: hai-27
 * @Author: taoyyz
 * @Date: 2020-02-21 18:40:41
 * @LastEditors: taoyyz
 * @LastEditTime: 2021-10-24 15:18:22
 -->
<template>
  <div class="confirmOrder">
    <!-- 头部 -->
    <div class="confirmOrder-header">
      <div class="header-content">
        <p>
          <i class="el-icon-s-order"></i>
        </p>
        <p>确认订单</p>
        <router-link to></router-link>
      </div>
    </div>
    <!-- 头部END -->
    <!-- 主要内容容器 -->
    <div class="content">
      <!-- 选择地址 -->
      <div class="section-address">
        <span class="title">收货地址：</span>
        <span v-show="!newAddress && !editAddress || showAddress" id="addressSpan"> {{ address }}</span>
        <el-input class="el-input" placeholder="请输入地址" v-model="address" clearable v-show="isEdit">
        </el-input>
        <el-button v-show="confirmBtn" @click="confirmUpdateAddress">确定</el-button>
        <el-button v-show="editAddress" @click="updateAddress">编辑地址</el-button>
        <el-button v-show="newAddress" @click="addAddress">新增地址</el-button>
        <div class="address-body">
        </div>
      </div>
      <!-- 选择地址END -->

      <!-- 商品及优惠券 -->
      <div class="section-goods">
        <p class="title">商品及优惠</p>
        <div class="goods-list">
          <ul>
            <li v-for="item in getCheckGoods" :key="item.id">
              <img :src="$targetVue + item.productPicture"/>
              <span class="pro-name">{{ item.productName }}</span>
              <span class="pro-price">
                <span class="del" v-show="parseFloat(item.now) == item.productPrice">{{
                    item.productPrice % 1 == 0 ? item.productPrice + '.00' : item.productPrice
                  }}元</span>
                {{ item.nowPrice }}元 × {{ item.count }}
              </span>
              <span class="pro-status" v-show="parseFloat(item.now) == item.productPrice"> - {{
                  ((item.productPrice - item.nowPrice) * item.count).toFixed(2)
                }}元</span>
              <span class="pro-total">{{ (item.nowPrice * item.count).toFixed(2) }}元</span>
            </li>
          </ul>
        </div>
      </div>
      <!-- 商品及优惠券END -->

      <!-- 配送方式 -->
      <div class="section-shipment">
        <p class="title">配送方式</p>
        <p class="shipment">包邮</p>
      </div>
      <!-- 配送方式END -->

      <!-- 结算列表 -->
      <div class="section-count">
        <div class="money-box">
          <ul>
            <li>
              <span class="title">商品件数：</span>
              <span class="value">{{ getCheckNum }}件</span>
            </li>
            <li>
              <span class="title">商品总价：</span>
              <span class="value">{{ getTotalPrice }}元</span>
            </li>
            <li>
              <span class="title">会员等级优惠：</span>
              <span class="value">{{ (getTotalPrice - getDiscountPrice).toFixed(2) }}元</span>
            </li>
            <li>
              <span class="title">运费：</span>
              <span class="value">0元</span>
            </li>
            <li class="total">
              <span class="title">应付总额：</span>
              <span class="value">
                <span class="total-price">{{ getDiscountPrice }}</span>元
              </span>
            </li>
          </ul>
        </div>
      </div>
      <!-- 结算列表END -->

      <!-- 结算导航 -->
      <div class="section-bar">
        <div class="btn">
          <router-link to="/shoppingCart" class="btn-base btn-return">返回购物车</router-link>
          <a href="" @click.prevent="addOrder"
             :class="address == '' ? 'btn-base btn-primary-disabled' : 'btn-base btn-primary'  ">结算</a>
        </div>
      </div>
      <!-- 结算导航END -->
    </div>
    <!-- 主要内容容器END -->
  </div>
</template>
<script>
import {mapActions, mapGetters} from "vuex";

export default {
  props: ['selectedNum'],
  name: "",
  data() {
    return {
      //用户收货地址
      address: '',
      isEditAddress: false,
      editAddress: false,
      newAddress: false,
      isEdit: false,
      showAddress: false,
      confirmBtn: false
    };
  },
  created() {
    this.address = ''
    //获取用户收货地址
    this.$axios.get('/user/' + this.$store.getters.getUser.id).then(res => {
      //如果用户没有设置地址，就
      if (res.data.data.address == '' || res.data.data.address == null) {
        this.editAddress = false;
        //显示地址编辑框和新增按钮
        this.newAddress = true;
        this.isEdit = true;
        this.showAddress = false;
      } else {
        //否则设置了用户地址，获得用户的地址
        this.address = res.data.data.address;
        this.showAddress = true;
        this.editAddress = true;
        this.newAddress = false;
        this.confirmBtn = false;
        this.isEdit = false;
      }

    })
    // 如果没有勾选购物车商品直接进入确认订单页面,提示信息并返回购物车
  },
  activated() {
    this.address = ''
    //获取用户地址
    this.$axios.get('/user/' + this.$store.getters.getUser.id).then(res => {
      //如果用户没有设置地址，就
      if (res.data.data.address == '' || res.data.data.address == null) {
        this.editAddress = false;
        //显示地址编辑框和新增按钮
        this.newAddress = true;
        this.isEdit = true;
        this.showAddress = false;
      } else {
        //否则设置了用户地址，获得用户的地址
        this.address = res.data.data.address;
        this.showAddress = true;
        this.editAddress = true;
        this.newAddress = false;
        this.confirmBtn = false;
        this.isEdit = false;
      }
    })
    // 如果没有勾选购物车商品直接进入确认订单页面,提示信息并返回购物车
    if (this.selectedNum < 1) {
      this.notifyError("请勾选商品后再结算");
      this.$router.push({path: "/shoppingCart"});
    }
  },
  computed: {
    // 结算的商品数量; 结算商品总计; 结算商品信息
    ...mapGetters(["getCheckNum", "getTotalPrice", "getCheckGoods", "getDiscountPrice"])
  },
  methods: {
    ...mapActions(["deleteShoppingCart"]),
    confirmUpdateAddress() {

      document.getElementById("addressSpan").style.display = "inline";
      //更新页面显示
      this.showAddress = true;
      this.newAddress = false;
      this.isEdit = false;
      this.editAddress = true;
      this.confirmBtn = false;
      //确认地址
      this.$axios.get("/user/addAddress?address=" + this.address + '&id=' + this.$store.getters.getUser.id)
    },
    addAddress() {
      //更新页面显示
      this.showAddress = true;
      this.newAddress = false;
      this.isEdit = false;
      this.editAddress = true;
      //新增地址
      this.$axios.get("/user/addAddress?address=" + this.address + '&id=' + this.$store.getters.getUser.id)
    },
    updateAddress() {
      if (this.address) {
        //地址存在，编辑
      } else {
        //地址不存在，
      }
      document.getElementById("addressSpan").style.display = "none";
      this.newAddress = false;
      this.confirmBtn = true;
      this.editAddress = false;
      this.isEdit = true;
      this.showAddress = false;
    },
    addOrder() {
      if (this.address) {
        this.$axios.post("/order/addOrder", {
          //下单的用户id
          uid: this.$store.getters.getUser.id,
          //下单的商品列表数组
          productArr: this.getCheckGoods,
          //折扣
          discount: this.$store.state.discount
        }).then(res => {
          let products = this.getCheckGoods;
          switch (res.data.data.code) {
              // “001”代表结算成功
            case "001":
              for (let i = 0; i < products.length; i++) {
                const temp = products[i];
                // 删除已经结算的购物车商品
                this.deleteShoppingCart({id: temp.id, isBtnDel: false});
              }
              // 提示结算结果
              this.notifySucceed(res.data.data.msg);
              // 跳转我的订单页面
              this.$router.push({path: "/order"});
              break;
            default:
              // 提示失败信息
              this.notifyError(res.data.data.msg);
          }
        }).catch(err => {
          return Promise.reject(err);
        });
      } else {
        //还没设置地址
        this.notifyError("请先设置收货地址");
      }
    }
  }
};
</script>
<style scoped>
.confirmOrder {
  background-color: #f5f5f5;
  padding-bottom: 20px;
}

.el-input {
  width: 180px;
}

/* 头部CSS */
.confirmOrder .confirmOrder-header {
  background-color: #fff;
  border-bottom: 2px solid #ff6700;
  margin-bottom: 20px;
}

.confirmOrder .confirmOrder-header .header-content {
  width: 1225px;
  margin: 0 auto;
  height: 80px;
}

.confirmOrder .confirmOrder-header .header-content p {
  float: left;
  font-size: 28px;
  line-height: 80px;
  color: #424242;
  margin-right: 20px;
}

.confirmOrder .confirmOrder-header .header-content p i {
  font-size: 45px;
  color: #ff6700;
  line-height: 80px;
}

/* 头部CSS END */

/* 主要内容容器CSS */
.confirmOrder .content {
  width: 1225px;
  margin: 0 auto;
  padding: 48px 0 0;
  background-color: #fff;
}

/* 选择地址CSS */
.confirmOrder .content .section-address {
  margin: 0 48px;
  overflow: hidden;
}

.confirmOrder .content .section-address .title {
  color: #333;
  font-size: 18px;
  line-height: 20px;
  margin-bottom: 20px;
}

.confirmOrder .content .address-body li {
  float: left;
  color: #333;
  width: 220px;
  height: 178px;
  border: 1px solid #e0e0e0;
  padding: 15px 24px 0;
  margin-right: 17px;
  margin-bottom: 24px;
}

.confirmOrder .content .address-body .in-section {
  border: 1px solid #ff6700;
}

.confirmOrder .content .address-body li h2 {
  font-size: 18px;
  font-weight: normal;
  line-height: 30px;
  margin-bottom: 10px;
}

.confirmOrder .content .address-body li p {
  font-size: 14px;
  color: #757575;
}

.confirmOrder .content .address-body li .address {
  padding: 10px 0;
  max-width: 180px;
  max-height: 88px;
  line-height: 22px;
  overflow: hidden;
}

.confirmOrder .content .address-body .add-address {
  text-align: center;
  line-height: 30px;
}

.confirmOrder .content .address-body .add-address i {
  font-size: 30px;
  padding-top: 50px;
  text-align: center;
}

/* 选择地址CSS END */

/* 商品及优惠券CSS */
.confirmOrder .content .section-goods {
  margin: 0 48px;
}

.confirmOrder .content .section-goods p.title {
  color: #333;
  font-size: 18px;
  line-height: 40px;
}

.confirmOrder .content .section-goods .goods-list {
  padding: 5px 0;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
}

.confirmOrder .content .section-goods .goods-list li {
  padding: 10px 0;

  color: #424242;
  overflow: hidden;
}

.confirmOrder .content .section-goods .goods-list li img {
  float: left;
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

.confirmOrder .content .section-goods .goods-list li .pro-name {
  float: left;
  width: 580px;
  line-height: 50px;
  padding-left: 20px;
}

.confirmOrder .content .section-goods .goods-list li .pro-price {
  float: left;
  width: 170px;
  text-align: center;
  line-height: 50px;
}

.confirmOrder .content .section-goods .goods-list li .pro-price .del {
  color: darkgray;
  text-decoration: line-through;
}

.confirmOrder .content .section-goods .goods-list li .pro-status {
  color: #ff9f6e;
  float: left;
  width: 99px;
  height: 50px;
  text-align: center;
  line-height: 50px;
}

.confirmOrder .content .section-goods .goods-list li .pro-total {
  float: right;
  width: 190px;
  text-align: center;
  color: #ff6700;
  line-height: 50px;
}

/* 商品及优惠券CSS END */

/* 配送方式CSS */
.confirmOrder .content .section-shipment {
  margin: 0 48px;
  padding: 25px 0;
  border-bottom: 1px solid #e0e0e0;
  overflow: hidden;
}

.confirmOrder .content .section-shipment .title {
  float: left;
  width: 150px;
  color: #333;
  font-size: 18px;
  line-height: 38px;
}

.confirmOrder .content .section-shipment .shipment {
  float: left;
  line-height: 38px;
  font-size: 14px;
  color: #ff6700;
}

/* 配送方式CSS END */

/* 发票CSS */
.confirmOrder .content .section-invoice {
  margin: 0 48px;
  padding: 25px 0;
  border-bottom: 1px solid #e0e0e0;
  overflow: hidden;
}

.confirmOrder .content .section-invoice .title {
  float: left;
  width: 150px;
  color: #333;
  font-size: 18px;
  line-height: 38px;
}

.confirmOrder .content .section-invoice .invoice {
  float: left;
  line-height: 38px;
  font-size: 14px;
  margin-right: 20px;
  color: #ff6700;
}

/* 发票CSS END */

/* 结算列表CSS */
.confirmOrder .content .section-count {
  margin: 0 48px;
  padding: 20px 0;
  overflow: hidden;
}

.confirmOrder .content .section-count .money-box {
  float: right;
  text-align: right;
}

.confirmOrder .content .section-count .money-box .title {
  float: left;
  width: 126px;
  height: 30px;
  display: block;
  line-height: 30px;
  color: #757575;
}

.confirmOrder .content .section-count .money-box .value {
  float: left;
  min-width: 105px;
  height: 30px;
  display: block;
  line-height: 30px;
  color: #ff6700;
}

.confirmOrder .content .section-count .money-box .total .title {
  padding-top: 15px;
}

.confirmOrder .content .section-count .money-box .total .value {
  padding-top: 10px;
}

.confirmOrder .content .section-count .money-box .total-price {
  font-size: 30px;
}

/* 结算列表CSS END */

/* 结算导航CSS */
.confirmOrder .content .section-bar {
  padding: 20px 48px;
  border-top: 2px solid #f5f5f5;
  overflow: hidden;
}

.confirmOrder .content .section-bar .btn {
  float: right;
}

.confirmOrder .content .section-bar .btn .btn-base {
  float: left;
  margin-left: 30px;
  width: 158px;
  height: 38px;
  border: 1px solid #b0b0b0;
  font-size: 14px;
  line-height: 38px;
  text-align: center;
}

.confirmOrder .content .section-bar .btn .btn-return {
  color: rgba(0, 0, 0, 0.27);
  border-color: rgba(0, 0, 0, 0.27);
}

/*.confirmOrder .content .section-bar .btn .btn-primary {
  background: #ff6700;
  border-color: #ff6700;
  color: #fff;
}*/
.confirmOrder .content .section-bar .btn .btn-primary {
  float: right;
  width: 200px;
  text-align: center;
  font-size: 18px;
  margin-left: 50px;
  background: #ff6700;
  color: #fff;
}

.confirmOrder .content .section-bar .btn .btn-primary-disabled {
  float: right;
  width: 200px;
  text-align: center;
  font-size: 18px;
  margin-left: 50px;
  background: #e0e0e0;
  color: #b0b0b0;
}

.confirmOrder .content .section-bar .btn .btn-primary:hover {
  background-color: #f25807;
}

/* 结算导航CSS */

/* 主要内容容器CSS END */
</style>