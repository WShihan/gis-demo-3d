<template>
  <div class="func-panel">
    <div
      class="func-category"
      v-for="(item, key) in funcs"
      :key="key"
      :name="item.name"
      :title="item.title"
    >
      <button class="func-btn" :title="item.title" @click="choose(item)">
        <i
          class="icon iconfont"
          :class="[item.icon, item.name === this.selected ? 'active' : '']"
        ></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "functions",
  emits: ["changeFuncEvt"],
  props: {
    // 当前选中工具
    selected: {
      type: String,
      default: "",
    },
    // 功能项列表
    funcs: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {};
  },
  components: {},
  mounted() {},
  unmounted() {},
  methods: {
    choose(tool) {
      this.$emit("changeFuncEvt", tool);
    },
  },
  watch: {},
  computed: {},
};
</script>

<style scoped lang="less">
* {
  padding: none;
  margin: none;
}
@-font-color: #fff;
.func-panel {
  color: #fff;
  // flex布局
  .func-items,
  button.func-btn {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }
  .func-category {
    width: 100%;
    height: auto;
    padding: 0.0926rem auto 0.1852rem;
    overflow: hidden;
    cursor: default;
    &:hover {
      border-top: 0.5px solid black;
      background-color: rgb(54, 57, 83);
    }
    button.func-btn {
      width: 100%;
      height: 0.5556rem;
      margin: 0.0926rem auto;
      font-size: 0.0926rem;
      border: none;
      border-radius: 0.0926rem;
      background-color: transparent;
      cursor: pointer;
    }
    i {
      color: #fff;
      font-size: 0.3rem;
      &.active {
        color: rgb(53, 132, 206);
        transform: scale(1.5);
      }
      &:hover {
        transform: scale(1.5);
      }
    }
  }
}
</style>
