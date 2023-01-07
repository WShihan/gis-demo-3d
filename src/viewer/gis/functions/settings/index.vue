<template>
  <DialogContainer title="设置" width="4rem" :left="10" :top="0.5">
    <div class="settings-panel">
      <el-collapse accordion>
        <el-collapse-item title="地形" name="1">
          <el-form label-width="fit-content">
            <el-form-item label="状态">
              <el-switch v-model="terrain" active-text="开启" inactive-text="关闭"></el-switch>
            </el-form-item>
            <el-form-item label="透明度">
              <el-slider
                v-model="opacity"
                :min="0"
                :max="1"
                :step="0.01"
                :format-tooltip="(val) => val * 100 + '%'"
              ></el-slider>
            </el-form-item>
          </el-form>
        </el-collapse-item>
        <el-collapse-item title="场景" name="2">
          <el-form label-width="fit-content">
            <el-form-item label="黑夜">
              <el-switch v-model="night" active-text="开启" inactive-text="关闭" />
            </el-form-item>
            <el-form-item label="深度监测">
              <el-switch v-model="depthAgainst" active-text="开启" inactive-text="关闭"></el-switch>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
    </div>
  </DialogContainer>
</template>

<script>
import { cesiumCfg, defaultSettings } from "@/config/settings";
import emitter from "@/utils/eventBus";
export default {
  name: "Settings",
  props: {},
  components: {},
  data() {
    return {
      terrain: defaultSettings.terrain,
      opacity: 1,
      depthAgainst: defaultSettings.depthTestAgainstTerrain,
      night: defaultSettings.enableLighting,
    };
  },
  mounted() {},
  unmounted() {},
  methods: {},
  watch: {
    terrain(val) {
      defaultSettings.terrain = val;
      if (val) {
        window.viewer.terrainProvider = new Cesium.ArcGISTiledElevationTerrainProvider({
          url: defaultSettings.arcgisTerrainUrl,
        });
      } else {
        window.viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider({});
      }
      emitter.emit("changeTerrain", val);
    },
    opacity(val) {
      window.viewer.scene.undergroundMode = true;
      window.viewer.scene.globe.globeAlpha = val;
    },
    depthAgainst(val) {
      defaultSettings.depthTestAgainstTerrain = val;
      window.viewer.scene.globe.depthTestAgainstTerrain = val;
    },
    night(val) {
      defaultSettings.enableLighting = val;
      window.viewer.scene.globe.enableLighting = val;
    },
  },
  computed: {},
};
</script>

<style scoped lang="less">
@import "@/assets/css/custom.less";
.settings-panel {
  width: 100%;
  padding: 5px;
}
</style>
