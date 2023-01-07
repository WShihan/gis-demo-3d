// src/router/index.js
import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";
import { defineAsyncComponent } from "vue";
import { getToken, removeToken } from "@/utils/cookieJar";

const whiteList = ["/", "/login"];
export const router = createRouter({
  history: createWebHashHistory(), // hash 模式
  // history: createWebHistory(), // history 模式
  routes: [
    {
      // 登陆页面
      path: "/login",
      name: "login",
      component: () => import(`../viewer/login`),
      meta: {
        title: "登陆",
      },
    },
    // 主页面为gis
    {
      path: "/",
      name: "home",
      component: () => import(`../viewer/gis`),
      meta: {
        title: "gis demo 3d",
      },
    },
    // 控制台页
    {
      path: "/dashBoard",
      name: "dashBoard",
      component: () => import("../viewer/dashboard"),
      meta: {
        title: "控制台",
      },
    },
  ],
});

// 全局路由守卫
router.beforeEach((to, from, next) => {
  const token = getToken();
  console.log("token", token);
  document.title = `${to.meta.title}`;
  // console.log("跳转", from, to);
  if (whiteList.indexOf(to.path) !== -1) {
    next();
  } else {
    if (token) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
    }
  }
});

// router.afterEach((to, from) => {
//   // console.log("afterEach");
// });
