<template>
  <!-- 雾 -->
  <el-form size="small" label-width="fit-content">
    <el-form-item label="能见度">
      <el-slider
        v-model="foggy.options.visibility"
        type="range"
        :min="0"
        :max="1"
        :step="0.01"
      ></el-slider>
    </el-form-item>
    <!-- <el-form-item label="颜色">
      <el-color-picker v-model="foggy.options.color" />
    </el-form-item> -->
  </el-form>
</template>

<script>
import { FogEffect } from "../weather.js";
let foggy;
export default {
  name: "foggy",
  props: {},
  data() {
    return {
      foggy: {
        title: "雾天",
        open: false,
        options: {
          visibility: 0.2,
          color: new Cesium.Color(0.8, 0.8, 0.8, 0.3),
        },
      },
    };
  },
  components: {},
  mounted() {
    if (!foggy) {
      foggy = new FogEffect(window.viewer, this.foggy.options);
    }
  },
  unmounted() {
    foggy.destroy();
    foggy = undefined;
  },
  methods: {},
  watch: {
    foggy: {
      deep: true,
      handler(val) {
        foggy.updateStage({
          visibility: val.options.visibility,
        });
      },
    },
  },
  computed: {},
};
</script>

<style scoped lang="less"></style>
