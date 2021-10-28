<!--
 * @Description: 登录组件
 * @Author: hai-27
 * @Date: 2020-02-19 20:55:17
 * @LastEditors: hai-27
 * @LastEditTime: 2020-03-01 15:34:08
 -->
<template>
  <div id="myLogin">
    <el-dialog title="登录" width="300px" center :visible.sync="isLogin">
      <el-form :model="LoginUser" :rules="rules" status-icon ref="ruleForm" class="demo-ruleForm">
        <el-form-item prop="name">
          <el-input prefix-icon="el-icon-user-solid" placeholder="请输入用户名或邮箱" v-model="LoginUser.name"></el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input
              prefix-icon="el-icon-view"
              type="password"
              placeholder="请输入密码"
              v-model="LoginUser.pass"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="medium" type="primary" @click="Login" style="width:100%;">登录</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {mapActions} from "vuex";

export default {
  name: "MyLogin",
  data() {
    // 用户名的校验方法
    let validateName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入用户名"));
      }
      // 用户名是4到12位的数字或大小写的英文字母
      const userNameRule = /^\w{4,12}$/;
      if (userNameRule.test(value)) {
        this.$refs.ruleForm.validateField("checkPass");
        return callback();
      } else {
        return callback(new Error("用户名为4到12位的数字或字母大小写"));
      }
    };
    // 密码的校验方法
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("请输入密码"));
      }
      // 密码是6到12位的数字或大小写的英文字母
      const passwordRule = /^\w{6,12}$/;
      if (passwordRule.test(value)) {
        this.$refs.ruleForm.validateField("checkPass");
        return callback();
      } else {
        return callback(
            new Error("密码为6到12位的数字或字母大小写")
        );
      }
    };
    return {
      LoginUser: {
        name: "",
        pass: ""
      },
      // 用户信息校验规则,validator(校验方法),trigger(触发方式),blur为在组件 Input 失去焦点时触发
      rules: {
        name: [{validator: validateName, trigger: "blur"}],
        pass: [{validator: validatePass, trigger: "blur"}]
      }
    };
  },
  computed: {
    // 获取vuex中的showLogin，控制登录组件是否显示
    isLogin: {
      get() {
        return this.$store.getters.getShowLogin;
      },
      set(val) {
        this.$refs["ruleForm"].resetFields();
        this.setShowLogin(val);
      }
    }
  },
  methods: {
    ...mapActions(["setUser", "setShowLogin"]),
    Login() {
      // 通过element自定义表单校验规则，校验用户输入的用户信息
      this.$refs["ruleForm"].validate(valid => {
        //如果通过校验开始登录
        if (valid) {
          this.$axios
              .post("/user/login", {
                username: this.LoginUser.name,
                email: this.LoginUser.name,
                password: this.LoginUser.pass
              })
              .then(res => {
                // “001”代表登录成功，其他的均为失败
                if (res.data.data.code === "001") {
                  // 隐藏登录组件
                  this.isLogin = false;
                  // 登录信息存到本地
                  let user = JSON.stringify(res.data.data.user);
                  localStorage.setItem("user", user);
                  // 登录信息存到vuex
                  this.setUser(res.data.data.user);
                  // 弹出通知框提示登录成功信息
                  this.notifySucceed(res.data.data.msg);
                  //路由到首页
                  this.$router.push("/")
                } else {
                  // 清空输入框的校验状态
                  this.$refs["ruleForm"].resetFields();
                  // 弹出通知框提示登录失败信息
                  //这里后端应该返回一个用户不存在或者没有激活
                  this.notifyError(res.data.data.msg);
                }
              })
              .catch(err => {
                return Promise.reject(err);
              });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style>
</style>