<template>
  <div class="login-panel">
    <div class="login-from" v-loading="loading">
      <h2 style="margin: 0px auto 0.66rem">登陆控制台</h2>
      <el-form ref="loginForm" v-model="loginForm">
        <el-form-item>
          <el-input ref="username" v-model="loginForm.username" placeholder="请输入用户名">
            <template #prefix>
              <i class="icon iconfont icon-user"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            ref="password"
            @keyup.enter="handleLogin"
            v-model="loginForm.password"
            show-password
            placeholder="请输入密码"
          >
            <template #prefix>
              <i class="icon iconfont icon-password"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" style="width: 100%">登陆</el-button>
          <svg-icon iconClass="btn-basic" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { PopTip } from "@/utils/tool";
import { apis } from "@/config/apis";
import axios from "axios";
import { setToken } from "@/utils/cookieJar";
import SvgIcon from "@/components/SvgIcon.vue";
export default {
  name: "Login",
  props: {},
  components: { SvgIcon },
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      loading: false,
    };
  },
  setup() {},
  mounted() {
    if (this.loginForm.username === "") {
      this.$refs.username.focus();
    } else if (this.loginForm.password === "") {
      this.$refs.password.focus();
    }
  },
  unmounted() {},
  methods: {
    validateUsername() {
      if ((this.loginForm.username.length <= 2) & (this.loginForm.username === "")) {
        PopTip.warning("用户名不正确");
        return false;
      } else return true;
    },

    validatePassword() {
      if ((this.loginForm.password.length <= 3) & (this.loginForm.password === "")) {
        PopTip.warning("密码长度小于8位");
        return false;
      } else return true;
    },

    handleLogin() {
      this.loading = true;
      if (this.validatePassword() && this.validateUsername()) {
        axios
          .post(apis.login.url, this.loginForm)
          .then((response) => {
            console.log(response.data);
            if (response.data.status === 200) {
              setToken(response.data.token);
              this.$router.push({
                path: "/dashBoard",
                query: "",
              });
            }
          })
          .catch(() => {
            PopTip.error("登陆错误！");
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
  },
  watch: {},
  computed: {},
};
</script>

<style scoped lang="less">
@import url("@/assets/css/custom.less");
* {
  padding: 0;
  margin: 0;
}
.login-panel {
  width: 100%;
  height: 100%;
  height: 0.5rem;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: flex-start;
  .login-from {
    width: 4.25rem;
    padding: 0.3906rem 0.7813rem;
    margin: 0.7813rem auto;
    border-radius: 0.1563rem;
    background: rgb(73, 152, 195);
  }
}
</style>
