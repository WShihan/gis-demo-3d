<template>
  <div class="window-body">
    <div class="header">
      <span>{{ title }}</span>
    </div>
    <el-input v-model="name" />
    <div class="buttons">
      <el-button type="primary" @click="this.$emit('confirmEvt', name)">
        确定</el-button
      >
      <el-button type="danger" @click="this.$emit('cancelEvt')">取消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Rename",
  emits: ["confirmEvt", "cancelEvt"],
  props: {
    name: {
      type: String,
      default: "默认值",
    },
  },
  components: {},
  data() {
    return {
      title: "重命名",
    };
  },
  setup() {},
  mounted() {},
  unmounted() {},
  methods: {},
  watch: {},
  computed: {},
};
</script>

<style scoped lang="less">
.buttons,
.header {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.window-body {
  width: 100%;
  padding: 0rem 0.2rem 0.2rem;
  background-color: rgb(59, 59, 69);
  .header {
    i {
      cursor: pointer;
    }
    span {
      font-size: 0.2rem;
    }
  }
  .buttons {
    margin: 0.125rem auto 0.05rem;
  }
  :deep(.el-input) {
    width: 100%;
    height: 30px;
  }
}
</style>
