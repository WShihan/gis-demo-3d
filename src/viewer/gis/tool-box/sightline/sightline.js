import { reactive, toRefs } from "vue";
import { DrawHandler, DrawResult, GeoMetryEnum } from "@/utils/core/draw";

export function sightLine() {
  let state = reactive({
    visibleColor: "rgb(0, 255, 0)",
    invisibleColor: "rgb(255,0,0)",
    lineWidth: 3,
  });

  let drawHandler = new DrawHandler(window.viewer);
  drawHandler.DrawMode = GeoMetryEnum.POLYLINE;
  drawHandler.addDrawFinishedCallback(drawSightline);
  function analyse() {
    drawHandler.start();
  }

  /**
   * @description
   * @param {DrawResult} drawResult
   */
  function drawSightline(drawResult) {
    let pts = [];
    if (drawResult.finish) {
      let pos = drawResult.positions;
      pts.push(...pos);

      // * 计算射线的方向
      let direction = Cesium.Cartesian3.normalize(
        Cesium.Cartesian3.subtract(pts[1], pts[0], new Cesium.Cartesian3()),
        new Cesium.Cartesian3()
      );
      // 建立射线
      let ray = new Cesium.Ray(pts[0], direction);
      let result = window.viewer.scene.globe.pick(ray, window.viewer.scene); // 计算交点
      if (result !== undefined && result !== null) {
        drawLine(result, pts[0], Cesium.Color.fromCssColorString(state.visibleColor)); // 可视
        drawLine(result, pts[1], Cesium.Color.fromCssColorString(state.invisibleColor)); // 不可视
      } else {
        drawLine(pts[0], pts[1], Cesium.Color.fromCssColorString(state.invisibleColor));
      }
      window.viewer.entities.remove(drawResult.entity);
    }
  }
  // * 绘制线
  function drawLine(start, end, color) {
    window.viewer.entities.add({
      polyline: {
        name: "sightline",
        positions: [start, end],
        width: state.lineWidth,
        material: color,
        // depthFailMaterial: color,
      },
    });
  }

  function clear() {
    window.viewer.entities.removeAll();
  }
  return {
    ...toRefs(state),
    analyse,
    clear,
  };
}

export default sightLine;
