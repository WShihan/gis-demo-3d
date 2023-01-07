<template>
  <dialog-container title="通视分析" width="4rem">
    <div class="panel">
      <el-form size="small">
        <el-form-item label="可视颜色">
          <el-color-picker show-alpha v-model="visibleColor" />
        </el-form-item>
        <el-form-item label="不可视颜色">
          <el-color-picker show-alpha v-model="invisibleColor" />
        </el-form-item>
        <el-form-item label="线宽">
          <el-input v-model="lineWidth" type="number" :min="3" :max="10" :step="0.5" />
        </el-form-item>
      </el-form>
      <div class="buttons">
        <el-button type="primary" @click="analyse">分析</el-button>
        <el-button type="danger" @click="clear">清除</el-button>
      </div>
    </div>
  </dialog-container>
</template>

<script>
import sightLine from "./sightline";
export default {
  name: "sightLine",
  props: {},
  components: {},
  data() {
    return {};
  },
  setup() {
    return sightLine();
  },
};
</script>

<style scoped lang="less">
.panel {
  width: 100%;
  padding: 10px;
  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
}
</style>
