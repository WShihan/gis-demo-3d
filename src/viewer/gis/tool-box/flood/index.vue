<template>
  <dialog-container title="淹没分析" width="4rem" :height="4" :top="0.5" :left="10">
    <div class="flood-panel" v-loading="loading">
      <el-form size="small" label-width="fit-conent">
        <el-form-item label="目标水位">
          <el-input v-model="targetWaterLine" type="number" :min="0" />
        </el-form-item>
        <el-form-item label="淹没速度">
          <el-input v-model="speed" type="number" :min="0" />
        </el-form-item>
        <el-form-item label="当前水位" v-if="currentWaterLine != 0">
          <el-input v-model="currentWaterLine" readonly />
        </el-form-item>
      </el-form>
      <div class="buttons">
        <el-button type="primary" @click="analysis">开始</el-button>
        <el-button type="danger" @click="clear">清除</el-button>
      </div>
    </div>
  </dialog-container>
</template>

<script>
import flood from "./flood.js";
export default {
  name: "Flood",
  props: {},
  data() {
    return {};
  },
  setup() {
    return flood();
  },
};
</script>

<style scoped lang="less">
.flood-panel {
  margin: 10px auto;
  .buttons {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    :deep(.el-button) {
      width: 25%;
      height: 30px;
    }
  }
}
</style>
