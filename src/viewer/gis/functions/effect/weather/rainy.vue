<template>
  <el-form size="small" label-width="fit-content">
    <el-form-item label="倾斜角度">
      <el-slider
        v-model="rainy.options.angle"
        type="range"
        :min="-1"
        :max="1"
        :step="0.01"
      ></el-slider>
    </el-form-item>
    <el-form-item label="雨滴大小">
      <el-slider
        v-model="rainy.options.size"
        type="range"
        :min="-1"
        :max="1"
        :step="0.01"
      ></el-slider>
    </el-form-item>
    <el-form-item label="降落速度">
      <el-slider
        v-model="rainy.options.speed"
        type="range"
        :min="1"
        :max="100"
      ></el-slider>
    </el-form-item>
  </el-form>
</template>

<script>
import { RainEffect } from "../weather.js";
let rainy;
export default {
  name: "rainy",
  props: {},
  data() {
    return {
      rainy: {
        title: "雨天",
        open: true,
        options: {
          angle: -0.6,
          size: 0.3,
          speed: 60,
        },
      },
    };
  },
  components: {},
  mounted() {
    if (!rainy) rainy = new RainEffect(window.viewer, this.rainy.options);
  },
  unmounted() {
    rainy.destroy();
    rainy = undefined;
  },
  methods: {},
  watch: {
    rainy: {
      deep: true,
      handler(val) {
        rainy.updateStage({
          rainAngle: val.options.angle,
          rainSize: val.options.size,
          rainSpeed: val.options.speed,
        });
      },
    },
  },
  computed: {},
};
</script>

<style scoped lang="less"></style>
