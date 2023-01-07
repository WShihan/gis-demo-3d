<template>
  <DialogContainer
    title="剖面线分析"
    :width="showChart ? '6.5rem' : '4.5rem'"
    :top="0.6"
    :left="10"
  >
    <div class="panel" v-loading="loading">
      <el-form size="small" label-width="fit-content">
        <el-form-item label="间距">
          <el-input v-model="interval" style="width: 90%"></el-input>
        </el-form-item>
        <el-form-item label="显示图表">
          <el-switch v-model="showChart" />
        </el-form-item>
      </el-form>
      <div class="buttons">
        <el-button type="primary" @click="analyse">分析</el-button>
        <el-button type="danger" @click="clear">清除</el-button>
      </div>
      <div @close="this.$emit('close')" v-show="showChart">
        <div class="chart-box">
          <div id="profile_chart"></div>
        </div>
      </div>
    </div>
  </DialogContainer>
</template>

<script>
import { profile } from "./profile.js";
import { defaultSettings } from "@/config/settings";
import { Notification } from "@/utils/tool";
export default {
  name: "Profile",
  props: {},
  components: {},
  setup(props) {
    let { loading, interval, showChart, analyse, clear } = profile(props);
    return { loading, interval, showChart, analyse, clear };
  },
  data() {
    return {};
  },
  mounted() {
    if (!defaultSettings.terrain || !defaultSettings.depthTestAgainstTerrain) {
      Notification.warning(
        "该工具需要加载地形和开启深度检测，请到【设置】页打开！"
      );
    }
  },
  unmounted() {},
  methods: {},
  watch: {},
  computed: {},
};
</script>

<style scoped lang="less">
.panel {
  padding: 10px;
  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .chart-box {
    padding: 0.1875rem;
    #profile_chart {
      width: 6.25rem;
      height: 4.375rem;
    }
  }
}
</style>
