import { watch, ref, reactive, toRefs, onBeforeUnmount } from "vue";
import { DrawHandler, GeoMetryEnum, DrawResult } from "@/utils/core/draw";
import { drawShape, PopTip, createPoint, Notification } from "@/utils/tool.js";
import {
  calcSpaceDistance,
  calcSurfaceDistance,
  calcSurfaceArea,
} from "@/utils/spatialComputation.js";
import { defaultSettings } from "@/config/settings";

function measure(props) {
  let state = reactive({
    drawingMode: "",
    clampMod: false,
    loading: false,
    distTip: true,
    areaTip: true,
  });
  // 传入props改变默认值
  if (props) {
    for (let key in props) {
      if (state.hasOwnProperty(key)) {
        state[key] = props[key];
      } else {
        console.error("无该属性：" + key);
      }
    }
  }

  // 初始化参数
  let pts = []; // 点集合
  let shp = undefined; // 测量几何对象
  let floatingPt = undefined; // 当前鼠标绘制点
  let drawHandler = new DrawHandler(window.viewer);
  let resultLabel = undefined;

  drawHandler.addDrawFinishedCallback(drawingShape.bind(this));

  //  开始执行测量线
  function measuringLength() {
    clear();
    console.log(state.distTip);
    if (state.distTip) {
      Notification.info("鼠标左键在场景中依次点击绘制线段，单机右键结束绘制！");
      state.distTip = false;
    }
    drawHandler.DrawMode = state.drawingMode = GeoMetryEnum.POLYLINE;
    drawHandler.start();
  }
  // 执行量测面
  function measuringArea() {
    clear();

    if (state.areaTip) {
      Notification.info("鼠标左键在场景中依次点击绘制面，单机右键结束绘制！");
      state.areaTip = false;
    } else state.areaTip = false;
    drawHandler.DrawMode = state.drawingMode = GeoMetryEnum.POLYGON;
    drawHandler.start();
  }

  //  绘制图形

  /**
   * @description
   * @param {DrawResult} drawResult
   */
  function drawingShape(drawResult) {
    if (drawResult.finish) {
      const position = drawResult.positions;
      pts.push(...position);
      if (state.drawingMode === GeoMetryEnum.POLYGON) calculateArea(pts);
      else calculateLength(pts);
    }
  }

  /**
   * @description 计算全部长度
   * @param {Array} positions
   */
  function calculateLength(positions) {
    state.loading = true;
    const dist = calcSpaceDistance(positions);
    if (!state.clampMod) {
      if (dist) updateDistLabel(positions[positions.length - 1], dist);
      state.loading = false;
    } else {
      if (dist >= 500000) {
        PopTip.warning("距离大于500km，请使用空间模式！");
        state.loading = false;
        clear();
      } else {
        calcSurfaceDistance(window.viewer, pts)
          .then((res) => {
            updateDistLabel(positions[positions.length - 1], res.distance);
          })
          .catch(() => {
            PopTip.warning("分析出错！");
          })
          .finally(() => {
            state.loading = false;
          });
      }
    }
  }

  function calculateArea(positions) {
    state.loading = true;
    calcSurfaceArea(positions)
      .then((area) => {
        updateAreaLabel(positions[positions.length - 1], area);
      })
      .catch(() => {})
      .finally(() => {
        state.loading = false;
      });
  }

  function createLabel(pos) {
    resultLabel = window.viewer.entities.add({
      //参数顺序：经度、纬度
      position: pos,
      label: {
        //文字标签
        text: "提示",
        font: "500 30px Helvetica", // 15pt monospace
        scale: 0.6,
        style: Cesium.LabelStyle.FILL,
        fillColor: Cesium.Color.WHITE,
        pixelOffset: new Cesium.Cartesian2(-70, 20), //偏移量
        showBackground: true,
        backgroundColor: new Cesium.Color(0.5, 0.6, 1, 1.0),
        disableDepthTestDistance: Infinity,
      },
    });
  }

  function updateDistLabel(pos, dist = 0) {
    if (!resultLabel) createLabel(pos);
    const spaceText = dist >= 1000 ? (dist / 1000).toFixed(2) + "km" : dist.toFixed(2) + "m";
    resultLabel.position.setValue(pos);
    resultLabel.label.text = "距离：" + spaceText;
  }

  function updateAreaLabel(pos, area = 0) {
    if (!resultLabel) createLabel(pos);
    resultLabel.position.setValue(pos);
    resultLabel.label.text = "面积：" + area.toFixed(2) + "km²";
  }

  function clear() {
    try {
      window.viewer.entities.removeAll();
      pts.length = 0;
      shp = undefined;
      floatingPt = undefined;
      resultLabel = undefined;
      state.drawingMode = "";
    } catch {
      PopTip.error("清除错误！");
    }
  }
  watch(
    () => state.clampMod,
    (val) => {
      if (val) {
        if (defaultSettings.terrain || defaultSettings.depthTestAgainstTerrain) {
          Notification.warning("贴地模式需要加载地形和开启深度检测，请到【设置】页打开！");
        }
      }
    }
  );

  // 销毁
  onBeforeUnmount(() => {
    // clear();
    drawHandler.clearAllDrawFinishedCallbacks();
    drawHandler = undefined;
  });

  return {
    ...toRefs(state),
    measuringLength,
    measuringArea,
    clear,
  };
}

export default measure;
export { measure };
