<template>
  <DialogContainer title="测量" width="4rem" :top="0.6" :left="10.8">
    <div class="panel" v-loading="loading">
      <div class="buttons">
        <el-button title="距离">
          <img
            class="icon"
            @click="measuringLength"
            src="https://md-1301600412.cos.ap-nanjing.myqcloud.com/icons/distance.svg"
            alt=""
          />
        </el-button>
        <el-button title="面积">
          <img
            class="icon"
            @click="measuringArea"
            src="https://md-1301600412.cos.ap-nanjing.myqcloud.com/icons/area.svg"
            alt=""
          />
        </el-button>
        <el-button title="清除">
          <img
            class="icon"
            @click="clear"
            src="https://md-1301600412.cos.ap-nanjing.myqcloud.com/icons/clear.svg"
            alt=""
          />
        </el-button>
      </div>
      <el-select
        placeholder="选择模式"
        v-model="clampMod"
        v-if="drawingMode == 'polyline'"
      >
        <el-option label="空间模式" :value="false" />
        <el-option label="贴地模式" :value="true" />
      </el-select>
    </div>
  </DialogContainer>
</template>

<script>
import { measure } from "./measure";
export default {
  name: "Measure",
  props: {},
  setup(props) {
    let {
      drawingMode,
      clampMod,
      loading,
      measuringArea,
      measuringLength,
      clear,
    } = measure(props);
    return {
      drawingMode,
      clampMod,
      loading,
      measuringArea,
      measuringLength,
      clear,
    };
  },
  components: {},
};
</script>

<style scoped lang="less">
.panel {
  padding: 15px;
  div.buttons {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    :deep(.el-button) {
      width: 35px;
      height: 0.4688rem;
      margin: 0rem 0.3125rem;
      background-color: transparent;
      border: none;
      :hover {
        background-color: rgb(106, 106, 119);
      }
    }
    img {
      width: 0.3rem;
      height: 0.3rem;
      cursor: pointer;
    }
  }
  :deep(.el-select) {
    margin: 10px auto;
    .el-input__wrapper,
    .el-select-dropdown,
    .el-scrollbar {
      background-color: transparent;
    }
  }
}
</style>
