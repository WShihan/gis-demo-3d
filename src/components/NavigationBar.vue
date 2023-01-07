<template>
  <div class="nav">
    <div class="nav-btn" v-for="(item, key) in navs">
      <div
        class="btn-inner"
        :class="[item.name === active ? 'active' : '']"
        @click="navigateTo(item)"
      >
        <h3 v-text="item.name"></h3>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavigationBar",
  props: {
    navs: {
      type: Array,
      default: [
        { name: "导航1" },
        { name: "导航2" },
        { name: "导航3" },
        { name: "导航4" },
      ],
    },
  },
  components: {},
  data() {
    return { active: this.navs[0].name };
  },
  emits: ["navigateToEvt"],
  mounted() {},
  unmounted() {},
  methods: {
    navigateTo(navOpt) {
      this.active = navOpt.name;
      this.$emit("navigateToEvt", navOpt);
    },
  },
  watch: {},
  computed: {},
};
</script>

<style scoped lang="less">
.nav,
.nav-btn,
.btn-inner {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.nav {
  width: 100%;
  .nav-btn {
    width: 25%;
    height: 0.625rem;
    background: rgb(255, 255, 255);
    border-bottom: 0.5px solid rgb(214, 209, 209);
    .btn-inner {
      width: 30%;
      height: 100%;
      &.active {
        border-radius: 7px 7px 0 0;
        border: 0.5px solid rgb(214, 209, 209);
        color: rgb(103, 145, 223);
        border-bottom: 4px solid rgb(255, 255, 255);
      }
      &:hover {
        border-radius: 5px 5px 0 0;
        border: 0.5px solid rgb(198, 195, 195);
        color: rgb(103, 145, 223);
        border-bottom: 4px solid rgb(255, 255, 255);
        cursor: pointer;
      }
    }
  }
}
</style>
