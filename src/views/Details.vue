<!--
 * @Description: 商品详情页面组件
 * @Base: hai-27
 * @Author: taoyyz
 * @Date: 2020-02-21 18:40:41
 * @LastEditors: taoyyz
 * @LastEditTime: 2021-10-24 15:18:22
 -->
<template>
  <div id="details">
    <!-- 头部 -->
    <div class="page-header">
      <div class="title">
        <p>{{ productDetails.productName }}</p>
      </div>
    </div>
    <!-- 头部END -->

    <!-- 主要内容 -->
    <div class="main" v-loading="loading" element-loading-background="rgb(255, 255, 255,)">
      <!-- 左侧商品轮播图 -->
      <div class="block">
        <img style="height:350px;" :src="$targetVue + productPicture" alt="商品图片"/>
      </div>
      <!-- 左侧商品轮播图END -->

      <!-- 右侧内容区 -->
      <div class="content">
        <h1 class="name">{{ productDetails.productName }}</h1>
        <p class="intro">{{ productDetails.productDesc }}</p>
        <p class="store">米米乐自营</p>
        <div class="price">
          <span>{{ nowPrice }}元</span>
          <span
              v-show="nowPrice != productDetails.productPrice"
              class="del"
          >{{ productDetails.productPrice }}元</span>
        </div>
        <div class="pro-list">
          <span class="pro-name">{{ productDetails.productName }}</span>
          <span class="pro-price">
            <span>{{ nowPrice }}元</span>
            <span v-show="nowPrice != productDetails.productPrice" class="pro-del">
              {{ productDetails.productPrice }}元
            </span>
          </span>
          <p class="price-sum" v-if="discount == 1">总计：{{ nowPrice }}元</p>
          <p class="price-sum" v-else>{{ gradeName }}用户，可享受{{ discount * 10 }}折优惠，仅需： {{ nowPrice }}元</p>
        </div>
        <!-- 内容区底部按钮 -->
        <div class="button" style="">
          <el-button class="shop-cart" :disabled="dis" @click="addShoppingCart">加入购物车</el-button>
        </div>
      </div>
      <!-- 右侧内容区END -->
    </div>
    <!-- 主要内容END -->
  </div>
</template>
<script>
import {mapActions} from "vuex";

export default {
  data() {
    return {
      dis: false, // 控制“加入购物车按钮是否可用”
      productID: "", // 商品id
      productDetails: "", // 商品详细信息
      productPicture: "", // 商品图片
      discount: 1,
      nowPrice: 0,
      gradeName: '',
      loading: true
    };
  },
  /*created() {
    this.productID = this.$route.query.productId;
    this.getDetails(this.productID);
  },*/
  // 通过路由获取商品id
  activated() {
    if (this.$route.query.productID !== undefined) {
      this.productID = this.$route.query.productID;
    }
    this.getDiscount(this.$store.getters.getUser.id)
  },
  watch: {
    // 监听商品id的变化，请求后端获取商品数据
    productID: function (val) {
      this.getDetails(val);
      // this.getDetailsPicture(val);
    }
  },
  methods: {
    ...mapActions(["unshiftShoppingCart", "addShoppingCartNum"]),
    // 获取商品详细信息
    getDetails(val) {
      this.loading = true;
      this.$axios
          .get("product/" + val)
          .then(res => {
            this.productDetails = res.data.data;
            this.productPicture = res.data.data.productPicture;
            this.getDiscount(this.$store.getters.getUser.id);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      this.loading = false;
    },
    getDiscount(id) {
      if (!(this.$store.getters.getUser == '' || this.$store.getters.getUser == null)) {
        this.$axios.get("/user/getDiscount/" + id).then(res => {
          this.discount = res.data.data.discount;
          this.$store.state.discount = res.data.data.discount;
          this.gradeName = res.data.data.gradeName;
          this.nowPrice = (this.productDetails.productPrice * this.discount).toFixed(2);
        });
      }
    },
    // 加入购物车
    addShoppingCart() {
      // 判断是否登录,没有登录则显示登录组件
      if (!this.$store.getters.getUser) {
        this.$store.dispatch("setShowLogin", true);
        return;
      }
      this.$axios
          .post("/shopCart", {
            uid: this.$store.getters.getUser.id,
            pid: this.productID
          })
          .then(res => {
            switch (res.data.data.code) {
              case "001":
                // 新加入购物车成功，把加入的此商品存入购物车
                this.unshiftShoppingCart(res.data.data.shoppingCartData);
                this.notifySucceed(res.data.data.msg);
                break;
              case "002":
                // 该商品已经在购物车，数量+1
                this.addShoppingCartNum(this.productID);
                this.notifySucceed(res.data.data.msg);
                break;
              default:
                this.notifyError(res.data.msg);
            }
          })
          .catch(err => {
            return Promise.reject(err);
          });
    },
    addCollect() {
      // 判断是否登录,没有登录则显示登录组件
      if (!this.$store.getters.getUser) {
        this.$store.dispatch("setShowLogin", true);
        return;
      }
      this.$axios
          .post("/api/user/collect/addCollect", {
            user_id: this.$store.getters.getUser.user_id,
            product_id: this.productID
          })
          .then(res => {
            if (res.data.code == "001") {
              // 添加收藏成功
              this.notifySucceed(res.data.msg);
            } else {
              // 添加收藏失败
              this.notifyError(res.data.msg);
            }
          })
          .catch(err => {
            return Promise.reject(err);
          });
    }
  }
};
</script>
<style>
/* 头部CSS */
#details .page-header {
  height: 64px;
  margin-top: -20px;
  z-index: 4;
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
  -webkit-box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.07);
  box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.07);
}

#details .page-header .title {
  width: 1225px;
  height: 64px;
  line-height: 64px;
  font-size: 18px;
  font-weight: 400;
  color: #212121;
  margin: 0 auto;
}

#details .page-header .title p {
  float: left;
}

#details .page-header .title .list {
  height: 64px;
  float: right;
}

#details .page-header .title .list li {
  float: left;
  margin-left: 20px;
}

#details .page-header .title .list li a {
  font-size: 14px;
  color: #616161;
}

#details .page-header .title .list li a:hover {
  font-size: 14px;
  color: #ff6700;
}

/* 头部CSS END */

/* 主要内容CSS */
#details .main {
  width: 1225px;
  height: 560px;
  padding-top: 30px;
  margin: 0 auto;
}

#details .main .block {
  padding-top: 70px;
  float: left;
  width: 550px;
  height: 460px;
  text-align: center;
  vertical-align: middle;
}

#details .el-carousel .el-carousel__indicator .el-carousel__button {
  background-color: rgba(163, 163, 163, 0.8);
}

#details .main .content {
  float: left;
  margin-left: 25px;
  width: 640px;
}

#details .main .content .name {
  height: 30px;
  line-height: 30px;
  font-size: 32px;
  font-weight: normal;
  color: #212121;
}

#details .main .content .intro {
  font-size: 18px;
  color: #b0b0b0;
  padding-top: 10px;
}

#details .main .content .store {
  color: #ff6700;
  padding-top: 10px;
}

#details .main .content .price {
  display: block;
  font-size: 18px;
  color: #ff6700;
  border-bottom: 1px solid #e0e0e0;
  padding: 25px 0 25px;
}

#details .main .content .price .del {
  font-size: 14px;
  margin-left: 10px;
  color: #b0b0b0;
  text-decoration: line-through;
}

#details .main .content .pro-list {
  background: #f9f9fa;
  padding: 30px 60px;
  margin: 50px 0 50px;
}

#details .main .content .pro-list span {
  line-height: 30px;
  color: #616161;
}

#details .main .content .pro-list .pro-price {
  float: right;
}

#details .main .content .pro-list .pro-price .pro-del {
  margin-left: 10px;
  text-decoration: line-through;
}

#details .main .content .pro-list .price-sum {
  color: #ff6700;
  font-size: 22px;
  padding-top: 20px;
}

#details .main .content .button {
  height: 55px;
  margin: 10px 0 20px 0;
}

#details .main .content .button .el-button {
  float: left;
  height: 55px;
  font-size: 16px;
  color: #fff;
  border: none;
  text-align: center;
}

#details .main .content .button .shop-cart {
  width: 340px;
  background-color: #ff6700;
}

#details .main .content .button .shop-cart:hover {
  background-color: #f25807;
}

#details .main .content .button .like {
  width: 260px;
  margin-left: 40px;
  background-color: #b0b0b0;
}

#details .main .content .button .like:hover {
  background-color: #757575;
}

#details .main .content .pro-policy li {
  float: left;
  margin-right: 20px;
  color: #b0b0b0;
}

/* 主要内容CSS END */
</style>