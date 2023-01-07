<template>
  <div class="container">
    <div class="functions">
      <Functions
        :funcs="funcs"
        @changeFuncEvt="funcChangeHandler"
        :selected="curFuncName"
      ></Functions>
    </div>
    <div class="map-frame">
      <div class="map-viewer">
        <Map></Map>
        <ScreenSplit v-if="this.panels.split"></ScreenSplit>
      </div>
      <div class="status">
        <div class="boader"></div>
        <MapStatusBar></MapStatusBar>
      </div>
    </div>
  </div>
  <!-- 地图控制工具 -->
  <MapTool></MapTool>
  <!-- 工具箱 -->
  <ToolBox @choose="chooseTool" :selected="curToolName"></ToolBox>
  <!-- 图层树 -->
  <LayerTree
    v-if="panels.layer"
    :layers="initLayers"
    :default-layers="defaultOpenedLayers"
    @addLayerEvt="addLayer"
    @removeLayerEvt="removeLayer"
  />
  <Transition name="slide-fade" v-if="panels.legend">
    <Legend workspace="Yunnan" layer="YunnanSoilClass"></Legend>
  </Transition>

  <!-- 功能二级面板 -->
  <Transition name="slide-fade">
    <component
      v-if="curFuncName != ''"
      :is="curFuncName"
      :panels="panels"
      @close="reset(0)"
    ></component>
  </Transition>
  <!-- 工具箱二级面板 -->
  <Transition name="slide-fade">
    <component v-if="curToolName != ''" :is="curToolName" @close="reset(1)"></component>
  </Transition>
</template>

<script>
import { layerTree } from "@/config/layerConfig.js";
import { defaultSettings } from "@/config/settings.js";
import { func } from "@/config/settings.js";
import Legend from "./legend/index.vue";
import Functions from "./functions/index.vue";
import MapTool from "./map-tool/index.vue";
import QueryByProperty from "./functions/query/index.vue";
import Effect from "./functions/effect/index.vue";
import Map from "./map/index.vue";
import LayerTree from "./layer-tree/index.vue";
import Help from "./functions/help/index.vue";
import ToolBox from "./tool-box/index.vue";
import Measure from "./tool-box/measure/index.vue";
import Profile from "./tool-box/profile/index.vue";
import Bookmark from "./functions/bookmark/index.vue";
import Fly from "./functions/fly/index.vue";
import ScreenSplit from "./functions/screen-split/index.vue";
import MapStatusBar from "./map-status-bar/index.vue";
import LayerManager from "@/utils/core/layer/layerManager.js";
import emitter from "@/utils/eventBus";
import Settings from "./functions/settings/index.vue";
import FileOpen from "./functions/file-open/index.vue";
import Flood from "./tool-box/flood/index.vue";
import sightLine from "./tool-box/sightline/index.vue";

let layerMng;
export default {
  name: "gis",
  emits: ["resetToolEvt", "resetFuncEvt", "add-layer-evt"],
  props: {
    funcs: {
      type: Array,
      default: func,
    },
    defaultOpenedLayers: {
      type: Array,
      default: defaultSettings.defaultOpenLayers,
    },
    initLayers: {
      type: Array,
      default: layerTree,
    },
  },
  data() {
    return {
      panels: {
        layer: true,
        legend: false,
        split: false,
      },
      // 当前激活工具
      curFuncName: "",
      curToolName: "",
      toolBox: {
        profile: "profile",
      },
    };
  },
  components: {
    Legend,
    Functions,
    MapTool,
    QueryByProperty,
    Effect,
    Map,
    LayerTree,
    Help,
    ToolBox,
    Measure,
    Profile,
    Bookmark,
    Fly,
    ScreenSplit,
    MapStatusBar,
    Settings,
    FileOpen,
    Flood,
    sightLine,
  },
  beforeMount() {
    layerMng = new LayerManager();
  },
  mounted() {},
  unmounted() {},

  methods: {
    // 一级功能面板切换
    funcChangeHandler(tool) {
      switch (tool.action) {
        // 常规功能
        case 0:
          if (this.curFuncName === tool.name) this.curFuncName = "";
          else this.curFuncName = tool.name;
          break;
        // 功能需要跳转页面
        case 1:
          this.$router.push({
            path: "/dashBoard",
            query: {},
          });
          break;
        case 2:
          this.splitMap();
          break;
      }
    },
    // 切换分析工具
    chooseTool(name) {
      if (this.curToolName === name) this.curToolName = "";
      else this.curToolName = name;
    },
    reset(action) {
      switch (action) {
        case 0:
          this.curFuncName = "";
          break;
        case 1:
          this.curToolName = "";
          break;
        case 2:
          this.splitMap();
          break;
      }
    },
    splitMap() {
      if (this.panels.split) {
        this.curFuncName = "";
        this.panels.split = false;
      } else {
        this.panels.split = true;
      }
    },
    addLayer(lyrObj) {
      layerMng.addLayer(lyrObj);
      emitter.emit("add-layer-evt", lyrObj);
    },
    removeLayer(lyrObj) {
      layerMng.removeLayer(lyrObj);
    },
  },
  computed: {},
};
</script>

<style scoped lang="less">
// 修改element默认样式
@import "@/assets/css/custom.less";

/*
    进入和离开动画可以使用不同
    持续时间和速度曲线。
  */
.slide-fade-enter-active {
  transition: all 0.1s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

* :deep {
  padding: 0px;
  margin: 0px;
}
// fex布局
.container,
.status,
.map-frame {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.container {
  width: 100%;
  height: 100%;
  position: relative;
  .functions {
    width: 3%;
    height: 100%;
  }

  .map-frame {
    position: relative;
    width: 97%;
    height: 100%;
    .map-viewer {
      width: 100%;
      height: 100%;
      position: relative;
      top: 0;
      left: 0;
    }

    .status {
      width: 100%;
      height: 4%;
      position: absolute;
      bottom: 0px;
      .boader {
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0.5;
        background-color: rgb(10, 10, 10);
      }
    }
  }
}
</style>
