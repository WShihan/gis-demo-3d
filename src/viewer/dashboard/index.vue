<template>
  <div class="dashBoard-panel">
    <NavigationBar :navs="navs"></NavigationBar>
  </div>
</template>

<script>
import NavigationBar from "@/components/NavigationBar.vue";
import { getToken } from "@/utils/cookieJar";
export default {
  name: "DashBoard",
  props: {
    navs: {
      type: Array,
      default: [
        { name: "访问" },
        { name: "资源" },
        { name: "访客" },
        { name: "其他" },
      ],
    },
  },
  components: { NavigationBar },
  data() {
    return { tk: "", active: "访问" };
  },
  setup() {},
  mounted() {
    this.tk = getToken();
  },
  unmounted() {},
  methods: {},
  watch: {},
  computed: {},
};
</script>

<style scoped lang="less">
* {
  margin: 0rem;
  padding: 0rem;
}
// flex显示
.nav,
.nav-btn,
.btn-inner {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.dashBoard-panel {
  width: 800px;
  height: 100%;
  margin: 0rem auto;
  background: rgb(255, 255, 255);
}
</style>
