<template>
  <div class="map-status-bar">
    <div class="status-item">
      <div
        v-show="mapInfo.scaleBar != 0"
        class="scale-line"
        id="scale-line"
        :style="{ width: mapInfo.scaleBar / 64 + 'rem' }"
      >
        <span>{{ mapInfo.scale }}</span>
      </div>
    </div>
    <div class="status-item mouse-position" title="github仓库">
      <a href="https://github.com/WShihan/gis-demo-3d" target="_blank" rel="noopener noreferrer">
        <i class="icon iconfont icon-github" style="color: gray;"></i>
      </a>
    </div>
    <div class="status-item mouse-position" title="地形">
      <i class="icon iconfont icon-mountain" :style="{ color: terrain ? 'aqua' : 'gray' }"></i>
    </div>
    <div class="status-item cemera-height">
      相机高度：{{ mapInfo.height.toFixed() }} {{ mapInfo.unit }}
    </div>
    <div class="status-item cemera-postrue">
      俯仰角：{{ postrue.pitch }}° &nbsp;&nbsp;翻滚角：{{ postrue.roll }}° &nbsp;&nbsp;偏航角：{{
        postrue.heading
      }}°
    </div>
    <div class="status-item mouse-position" v-if="mapInfo.cursorLon != ''">
      {{ mapInfo.cursorLon + mapInfo.lonUnit + " " }}
      {{ mapInfo.cursorLat + mapInfo.latUnit }}
    </div>
    <div class="status-item">
      <i class="icon iconfont icon-user"></i
      ><span style="margin: ">&nbsp; {{ "访客" }} &nbsp;</span>
    </div>
  </div>
</template>

<script>
import { getHeight, degree2DegMinSec } from "@/utils/core/mapHandler.js";
import { defaultSettings } from "@/config/settings.js";
import emitter from "@/utils/eventBus";

let cesiumEvtCallbaks = [];
let timer;
export default {
  name: "MapStatusBar",
  props: {},
  components: {},
  data() {
    return {
      terrain: defaultSettings.terrain,
      // 相机姿态
      postrue: {
        pitch: 0,
        roll: 0,
        heading: 0,
      },
      // 地图信息
      mapInfo: {
        scale: 0,
        scaleBar: 0,
        height: 0,
        unit: "",
        cursorLon: "",
        lonUnit: "",
        latUnit: "",
        cursorLat: "",
      },
    };
  },
  mounted() {
    emitter.on("changeTerrain", this.changeTerrain.bind(this));
    let viewer = window.viewer;
    var moveEndcCallback = viewer.camera.moveEnd.addEventListener(this.cameraMoveEnd.bind(this));
    // 绑定鼠标移动事件
    // moveHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    // moveHandler.setInputAction(
    //   this.mouseMoveEnd,
    //   Cesium.ScreenSpaceEventType.MOUSE_MOVE
    // );
    // var mouseMoveEndCallback = viewer.mouseMoveEndEvent.addEventListener(
    //   this.mouseMoveEnd.bind(this)
    // );
    cesiumEvtCallbaks.push(moveEndcCallback);
    // cesiumEvtCallbaks.push(mouseMoveEndCallback);
  },
  unmounted() {
    // moveHandler.destroy();
    // moveHandler = undefined;
    emitter.off("changeTerrain");
    cesiumEvtCallbaks.forEach((item) => {
      cesiumEvtCallbaks.pop(item);
    });
  },
  methods: {
    delayFunc(callback) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(function () {
        callback();
      }, 1000);
    },

    // 计算地图比例尺
    calcMapScale() {
      let viewer = window.viewer;
      let scene = viewer.scene;
      var globe = scene.globe;
      var geodesic = new Cesium.EllipsoidGeodesic();
      let width = scene.canvas.clientWidth;
      let height = scene.canvas.clientHeight;
      var distArr = [
        1, 2, 3, 5, 10, 20, 30, 50, 100, 200, 300, 500, 1000, 2000, 3000, 5000, 10000, 20000, 30000,
        50000, 100000, 200000, 300000, 500000, 1000000, 2000000, 3000000, 5000000, 10000000,
        20000000, 30000000, 50000000,
      ];

      var left = scene.camera.getPickRay(new Cesium.Cartesian2((width / 2) | 0, height - 1));
      var right = scene.camera.getPickRay(new Cesium.Cartesian2((1 + width / 2) | 0, height - 1));

      var leftPosition = globe.pick(left, scene);
      var rightPosition = globe.pick(right, scene);
      if (!leftPosition && !rightPosition) return {};

      var leftCartographic = globe.ellipsoid.cartesianToCartographic(leftPosition);
      var rightCartographic = globe.ellipsoid.cartesianToCartographic(rightPosition);

      geodesic.setEndPoints(leftCartographic, rightCartographic);
      var pixelDistance = geodesic.surfaceDistance;
      var maxBarWidth = 100;
      var distance;
      let label;
      for (var i = distArr.length - 1; !Cesium.defined(distance) && i >= 0; --i) {
        if (distArr[i] / pixelDistance < maxBarWidth) {
          distance = distArr[i];
        }
      }
      if (distance >= 1000) {
        label = (distance / 1000).toString() + " km";
      } else {
        label = distance.toString() + " m";
      }
      return {
        scale: label,
        scaleBar: distance / pixelDistance,
      };
    },

    // 设置相机指向
    setNorthIconHeading() {
      // 修改指北针指向显示
      const viewer = window.viewer;
      const heading = viewer.camera.heading;
      const rotate = Cesium.Math.toDegrees(heading);
      var northIconNode = document.getElementById("btn-north-arrow-tool");
      if (northIconNode) northIconNode.style.transform = `rotate(-${rotate}deg)`;
    },

    // 相机移动停止事件处理
    cameraMoveEnd(evt) {
      var scaleObj = this.calcMapScale();
      this.mapInfo.scaleBar = scaleObj.scaleBar ? scaleObj.scaleBar : 0;
      this.mapInfo.scale = scaleObj.scale ? scaleObj.scale : "-";

      this.setNorthIconHeading();
      // 修改相机高度显示
      const height = getHeight(viewer);
      if (height > 1000) {
        this.mapInfo.height = height / 1000;
        this.mapInfo.unit = "km";
      } else {
        this.mapInfo.height = height;
        this.mapInfo.unit = "m";
      }

      // 计算相机姿态
      let camera = window.viewer.camera;
      this.postrue.pitch = Cesium.Math.toDegrees(camera.pitch).toFixed(0);
      this.postrue.roll = Cesium.Math.toDegrees(camera.roll).toFixed(0);
      this.postrue.heading = Cesium.Math.toDegrees(camera.heading).toFixed(0);
    },

    // cesium鼠标移动停止事件处理
    mouseMoveEnd(movement) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(this.calcCoordinate(movement), 100000);
    },

    // 计算经纬度
    calcCoordinate(movement) {
      // console.log("movement", movement);
      /**@type {Cesium.Scene} */
      const scene = window.viewer.scene;
      // 计算经纬度
      const cart2 = movement.endPosition;
      try {
        if (window.viewer.selectedEntity) {
          return;
        }
        const ray = scene.camera.getPickRay(cart2);
        const cart3 = scene.globe.pick(ray, scene);
        if (cart3) {
          let radiansPos = Cesium.Cartographic.fromCartesian(cart3);
          const lon = Cesium.Math.toDegrees(radiansPos.longitude);
          const lat = Cesium.Math.toDegrees(radiansPos.latitude);
          this.mapInfo.lonUnit = lon > 0 ? "E" : "W";
          this.mapInfo.latUnit = lat > 0 ? "N" : "S";
          this.mapInfo.cursorLon = degree2DegMinSec(lon);
          this.mapInfo.cursorLat = degree2DegMinSec(lat);
        } else {
          // this.longitude = this.latitude = this.altitude = undefined;
        }
      } catch (error) {
        console.error(error);
      }
    },

    changeTerrain(val) {
      this.terrain = val;
    },
  },
  watch: {},
  computed: {},
};
</script>

<style scoped lang="less">
.map-status-bar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  width: 100%;
  height: 100%;
  .status-item {
    width: 2.8125rem;
    color: #fff;
    font-size: 0.15625rem;
    margin: 0px 0.3125rem;
  }
  .cemera-postrue {
    width: 3.9063rem;
  }
}
.scale-line {
  font-size: 0.1563rem;
  width: 0.9375rem;
  border: 0.0156rem solid #f9f6f6;
  border-top: none;
}
</style>
