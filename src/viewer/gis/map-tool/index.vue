<template>
  <div class="map-tools">
    <el-button @click="locateHome">
      <i class="icon iconfont icon-index"></i>
      <!-- <img
        class="icon"
        src="https://md-1301600412.cos.ap-nanjing.myqcloud.com/icons/index.svg"
        @click="locateHome"
        alt=""
      /> -->
    </el-button>
    <el-button @click="setHeading2north">
      <i
        class="icon iconfont icon-north-arrow"
        id="btn-north-arrow-tool"
        style="transform: rotate(0deg)"
      ></i>
      <!-- <img
        class="icon"
        id="btn-north-arrow-tool"
        style="transform: rotate(0deg)"
        src="https://md-1301600412.cos.ap-nanjing.myqcloud.com/icons/north.svg"
        @click="setHeading2north"
        alt=""
      /> -->
    </el-button>
    <el-button @click="zoomOut">
      <i class="icon iconfont icon-zoom-out"></i>
      <!-- <img
        class="icon"
        src="https://md-1301600412.cos.ap-nanjing.myqcloud.com/icons/zoomOut.svg"
        @click="zoomOut"
        alt=""
      /> -->
    </el-button>
    <el-button @click="zoomIn">
      <i class="icon iconfont icon-zoom-in"></i>
      <!-- <img
        class="icon"
        src="https://md-1301600412.cos.ap-nanjing.myqcloud.com/icons/zoomIn.svg"
        @click="zoomIn"
        alt=""
      /> -->
    </el-button>
    <el-button @click="getGeoLocation">
      <i class="icon iconfont icon-locate"></i>
      <!-- <img
        class="icon"
        src="https://md-1301600412.cos.ap-nanjing.myqcloud.com/icons/locate.svg"
        alt=""
      /> -->
    </el-button>
    <el-button @click="switchScreenMode">
      <i class="icon iconfont icon-full-screen"></i>
      <!-- <img
        class="icon"
        src="https://md-1301600412.cos.ap-nanjing.myqcloud.com/icons/fullScreen.svg"
        alt=""
      /> -->
    </el-button>
  </div>
</template>

<script>
import FullScreen from "./fullScreen.js"; //全屏控件
import { MapToolHandler } from "@/utils/core/mapHandler.js";
import { PopTip } from "@/utils/tool.js";

let mapHandler;
export default {
  name: "map-tool",
  props: {},
  data() {
    return {
      screenMode: {
        full: false,
      },
    };
  },
  components: {},
  mounted() {
    if (!mapHandler) mapHandler = new MapToolHandler(window.viewer);
  },
  unmounted() {
    mapHandler = undefined;
  },
  methods: {
    zoomIn() {
      mapHandler.zoomInOrOut(1);
    },
    zoomOut() {
      mapHandler.zoomInOrOut(0);
    },
    locateHome() {
      mapHandler.locateByFly(101.6, 25, 1500000, 2);
    },
    setHeading2north() {
      mapHandler.headingNorth();
    },
    locateHere(pos) {
      console.log("locate", pos);
      var entity = window.viewer.entities.getById("location");
      if (!entity) {
        PopTip.info("开始定位……");
        mapHandler.locateHere(pos.coords.longitude, pos.coords.latitude);
      } else {
        window.viewer.entities.remove(entity);
        PopTip.info("移除定位……");
      }
    },
    getGeoLocation() {
      navigator.geolocation.getCurrentPosition(
        this.locateHere.bind(this),
        function (error) {
          PopTip.warning("定位……");
        },
        {
          // timeout: 10000, // 5s无反应即获取失败
        }
      );
    },
    // 切换全屏
    switchScreenMode() {
      var full = new FullScreen();
      if (this.screenMode.full) {
        full.exitFullscreen();
        this.screenMode.full = false;
      } else {
        full.Fullscreen("body");
        this.screenMode.full = true;
      }
    },
  },
  watch: {},
  computed: {},
};
</script>

<style scoped lang="less">
.map-tools {
  position: absolute;
  right: 1%;
  bottom: 5%;
  display: flex;
  flex-direction: column;
  justify-content: left;
  align-items: center;
  :deep(.el-button) {
    width: 0.363rem;
    height: 0.363rem;
    border: none;
    margin: 0.0926rem auto;
    background-color: transparent;
    &:hover {
      background-color: rgb(25, 25, 29);
    }
  }
  :deep(.svg-icon) {
    width: 0.363rem;
    height: 0.363rem;
  }
  i.icon {
    color: #fff;
    font-size: 0.3125rem;
  }
}
</style>
