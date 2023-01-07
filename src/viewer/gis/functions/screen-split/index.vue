<template>
  <!-- 控制左侧屏幕的图层资源树 -->
  <LayerTree
    :title="'左侧图层'"
    :left="'1rem'"
    :top="'1rem'"
    :layers="initLayers"
    :defaultLayers="[]"
    @addLayerEvt="addLayer"
    @removeLayerEvt="removeLayer"
  ></LayerTree>
  <div class="slider" id="slider">
    <div
      class="pan"
      style="
        position: absolute;
        top: 50%;
        left: -6px;
        width: 16px;
        height: 16px;
        border-radius: 8px;
        background-color: #fff;
      "
    >
      <i class="icon iconfont icon-triangle-down" style="color: gray"></i>
    </div>
  </div>
</template>

<script>
import LayerTree from "@/viewer/gis/layer-tree/index.vue";
import { WMSLayerOpt, WMTSLayerOpt } from "@/utils/core/layer/layerEum.js";
import LayerManager from "@/utils/core/layer/layerManager.js";
import { layerTree } from "@/config/layerConfig";
/**
 * @type {LayerManager}
 */
let layerMng;
let slider;
let imagery;
export default {
  name: "ScreenSplit",
  props: {
    initLayers: {
      type: Array,
      default: layerTree,
    },
  },
  components: { LayerTree },
  data() {
    return {
      moveActive: false,
    };
  },
  beforeMount() {
    layerMng = new LayerManager();
  },
  mounted() {
    slider = document.getElementById("slider");
    const handler = new Cesium.ScreenSpaceEventHandler(slider);
    handler.setInputAction(this.startMove.bind(this), Cesium.ScreenSpaceEventType.LEFT_DOWN);

    handler.setInputAction(this.startMove.bind(this), Cesium.ScreenSpaceEventType.PINCH_START);

    handler.setInputAction(this.resize.bind(this), Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    handler.setInputAction(this.resize.bind(this), Cesium.ScreenSpaceEventType.PINCH_MOVE);

    handler.setInputAction(this.endMove.bind(this), Cesium.ScreenSpaceEventType.LEFT_UP);

    handler.setInputAction(this.endMove.bind(this), Cesium.ScreenSpaceEventType.PINCH_END);
    // 初始左右侧比例，各占50%
    window.viewer.scene.splitPosition = 0.5;
  },
  unmounted() {
    slider = undefined;
    if (imagery) {
      window.viewer.imageryLayers.remove(imagery, true);
      imagery = undefined;
    }
    if (layerMng) {
      layerMng.clearAllLayer();
      layerMng = undefined;
    }
  },
  methods: {
    /**
     * @param {WMSLayerOpt | WMTSLayerOpt} layerOpt
     */
    addLayer(layerOpt) {
      layerMng.addLayer(layerOpt, Cesium.SplitDirection.LEFT);
    },
    removeLayer(layerOpt) {
      layerMng.removeLayer(layerOpt);
    },
    startMove() {
      this.moveActive = true;
    },
    endMove() {
      this.moveActive = false;
    },
    resize(movement) {
      if (!this.moveActive) return;
      const relativeOffset = movement.endPosition.x;
      const splitPosition = (slider.offsetLeft + relativeOffset) / slider.parentElement.offsetWidth;
      slider.style.left = `${99.4 * splitPosition}%`;
      window.viewer.scene.splitPosition = splitPosition;
    },
  },
};
</script>

<style lang="less" scoped>
.slider {
  position: absolute;
  left: 50%;
  top: 0px;
  background-color: #ffffff;
  width: 0.05rem;
  height: 100%;
  cursor: ew-resize;
}
</style>
