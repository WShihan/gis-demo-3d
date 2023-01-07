import { createApp } from "vue";
import { router } from "./router/index";
import App from "./App.vue";
import elementPlus from "element-plus";
import "element-plus/theme-chalk/index.css";
import "@/assets/css/iconfont.css";
// import "./mock/index";

// 全局组件
import dialogContainer from "@/components/DialogContainer.vue";
import rename from "@/components/Rename.vue";
import SvgIcon from "@/components/SvgIcon.vue";

var app = createApp(App);
app.component("DialogContainer", dialogContainer);
app.component("Rename", rename);
app.component("SvgIcon", SvgIcon);
app.use(router);
app.use(elementPlus);
app.mount("#app");
