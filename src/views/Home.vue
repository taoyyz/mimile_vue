<!--
 * @Description: 首页组件
 * @Base: hai-27
 * @Author: taoyyz
 * @Date: 2020-02-21 18:40:41
 * @LastEditors: taoyyz
 * @LastEditTime: 2021-10-27 15:18:22
 -->
-->
<template>
  <div class="home" id="home" name="home">
    <!-- 轮播图 -->
    <div class="block">
      <el-carousel height="460px">
        <el-carousel-item v-for="(item,index) in carousel" :key="index">
          <router-link :to="{ path: '/goods/details', query: {productID:item.pid} }">
            <img style="height:100%;width: 100%" :src="$targetVue + item.src" :alt="item.src"/>
          </router-link>
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 轮播图END -->
    <div class="main-box">
      <div class="main">
        <div class="phone">
          <div class="box-hd">
            <div class="title">热门商品</div>
          </div>
          <div class="box-bd">
            <div class="promo-list">
              <img :src="$targetVue +'img.png'" style="width: 100%;height: 100%"/>
            </div>
            <div class="list" v-loading="loading">
              <MyList :list="fruitList" :isMore="true"></MyList>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: true,
      carousel: "",
      fruitList: "",
    };
  },
  watch: {
    // 当前选中的商品分类，响应不同的商品数据
    applianceActive: function (val) {
      // 页面初始化的时候把applianceHotList(热门家电商品列表)直接赋值给applianceList
      // 所以在切换商品列表时判断applianceHotList是否为空,为空则是第一次切换,把applianceList赋值给applianceHotList
      if (this.applianceHotList == "") {
        this.applianceHotList = this.applianceList;
      }
      if (val == 1) {
        // 1为热门商品
        this.applianceList = this.applianceHotList;
        return;
      }
      if (val == 2) {
        // 2为电视商品
        this.applianceList = this.miTvList;
        return;
      }
    },
    accessoryActive: function (val) {
      // 页面初始化的时候把accessoryHotList(热门配件商品列表)直接赋值给accessoryList(配件商品列表)
      // 所以在切换商品列表时判断accessoryHotList是否为空,为空则是第一次切换,把accessoryList赋值给accessoryHotList
      if (this.accessoryHotList == "") {
        this.accessoryHotList = this.accessoryList;
      }
      if (val == 1) {
        // 1为热门商品
        this.accessoryList = this.accessoryHotList;
        return;
      }
      if (val == 2) {
        // 2为保护套商品
        this.accessoryList = this.protectingShellList;
        return;
      }
      if (val == 3) {
        //3 为充电器商品
        this.accessoryList = this.chargerList;
        return;
      }
    }
  },
  created() {
    this.loading = true;
    // 获取轮播图数据
    this.carousel = [{src: 'lb1.png', pid: 3}, {src: 'lb2.png', pid: 24}, {src: 'lb3.png', pid: 12}];
    // 获取各类商品数据
    //获取热门水果的list
    this.$axios.get('/product/getHot').then(res => {
      this.fruitList = res.data.data;
      this.loading = false;
    })
  },
  activated() {
    this.loading = true;
    // 获取轮播图数据
    this.carousel = [{src: 'lb1.png', pid: 3}, {src: 'lb2.png', pid: 24}, {src: 'lb3.png', pid: 12}];
    // 获取各类商品数据
    //获取热门水果的list
    this.$axios.get('/product/getHot').then(res => {
      this.fruitList = res.data.data;
      this.loading = false;
    })
  },
  methods: {
    // 获取家电模块子组件传过来的数据
    getChildMsg(val) {
      this.applianceActive = val;
    },
    // 获取配件模块子组件传过来的数据
    getChildMsg2(val) {
      this.accessoryActive = val;
    },
    // 获取各类商品数据方法封装
  }
};
</script>
<style scoped>
@import "../assets/css/index.css";
</style>