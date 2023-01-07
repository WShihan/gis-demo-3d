<template>
  <!-- 雪 -->
  <el-form size="small" label-width="fit-content">
    <el-form-item label="雪花大小">
      <el-slider
        v-model="snowy.options.size"
        type="range"
        :min="0.01"
        :max="1"
        :step="0.01"
      ></el-slider>
    </el-form-item>
    <el-form-item label="降落速度">
      <el-slider
        v-model="snowy.options.speed"
        type="range"
        :min="0.1"
        :max="100"
        :step="1"
      ></el-slider>
    </el-form-item>
  </el-form>
</template>

<script>
import { SnowEffect } from "../weather.js";
let snowy;
export default {
  name: "snowy",
  props: {},
  data() {
    return {
      snowy: {
        title: "雪天",
        open: false,
        options: {
          size: 0.02,
          speed: 60,
        },
      },
    };
  },
  components: {},
  mounted() {
    if (!snowy) snowy = new SnowEffect(window.viewer, this.snowy.options);
  },
  unmounted() {
    snowy.destroy();
    snowy = undefined;
  },
  methods: {},
  watch: {
    snowy: {
      deep: true,
      handler(val) {
        snowy.updateStage({
          snowSize: val.options.size,
          snowSpeed: val.options.speed,
        });
      },
    },
  },
  computed: {},
};
</script>

<style scoped lang="less"></style>
