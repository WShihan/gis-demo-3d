<template>
  <DialogContainer title="漫游" top="0.5" left="10" width="5rem">
    <div class="fly-panel">
      <el-collapse accordion>
        <el-collapse-item title="漫游设置" name="1">
          <el-form label-width="fit-content">
            <el-form-item label="路线宽度">
              <el-slider
                v-model="routeWidth"
                :max="20"
                :min="1"
                :step="0.1"
                :format-tooltip="(val) => val + '像素'"
              ></el-slider>
            </el-form-item>
            <el-form-item label="相机航向">
              <el-slider
                v-model="flyHeading"
                :max="360"
                :min="0"
                :step="0.5"
                :format-tooltip="(val) => val + '°'"
              ></el-slider>
            </el-form-item>
            <el-form-item label="路线颜色">
              <el-color-picker
                v-model="routeColor"
                show-alpha
                class="custom-color-picker"
              ></el-color-picker>
            </el-form-item>
            <el-form-item label="路线高度">
              <el-input v-model="flyHeight" />
            </el-form-item>
            <el-form-item label="移动速度"> <el-input v-model="speed" /></el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
      <div class="actions" v-if="true">
        <el-button @click="leftCLK">
          <i title="开始飞行" class="icon iconfont icon-kaishi"></i>
        </el-button>
        <el-button @click="stopFly">
          <i title="暂停飞行" class="icon iconfont icon-zanting"></i>
        </el-button>
        <el-button @click="clear">
          <i title="结束飞行" class="icon iconfont icon-jieshu"></i>
        </el-button>
      </div>
    </div>
  </DialogContainer>
</template>

<script>
import FlyManager from "./fly.js";
export default {
  name: "Fly",
  props: {},
  components: {},
  data() {
    return {};
  },
  setup(props) {
    return FlyManager(props);
  },
};
</script>

<style scoped lang="less">
@import "@/assets/css/custom.less";
* {
  padding: 0rem;
  margin: 0rem;
}
// flex布局
.buttons,
.actions {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.fly-panel {
  width: 100%;
  padding: 0.0625rem;
  :deep(.el-button) {
    width: 0.375rem;
    height: 0.375rem;
    border: none;
    background: rgb(46, 48, 62);
    &:active {
      background-color: #fff;
    }
  }
  .buttons {
    width: 100%;
  }
  .actions {
    width: 100%;
    margin: 0.125rem auto;
    i {
      font-size: 0.2rem;
      // cursor: not-allowed;
    }
  }
}
</style>
