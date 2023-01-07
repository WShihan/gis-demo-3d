import { reactive, watch, toRefs } from "vue";
import { drawShape, PopTip, createPoint, Notification } from "@/utils/tool.js";
import { DrawHandler, GeoMetryEnum, DrawResult } from "@/utils/core/draw.js";
import waterImg from "@/assets/img/waterNormals.jpg";
function flood() {
  let state = reactive({
    // 目标水位
    targetWaterLine: 2000,
    // 当前水位
    currentWaterLine: 0,
    //流速
    speed: 5,
    loading: false,
  });

  //   初始化
  let drawHandler = new DrawHandler(window.viewer);
  drawHandler.DrawMode = GeoMetryEnum.POLYGON;
  //   绑定绘制回调
  drawHandler.addDrawFinishedCallback(drawFloodArea.bind(this));
  //   洪水面
  let floodAreaEntity;

  /**
   * @description 开始分析
   */
  function analysis() {
    PopTip.info("鼠标左键在场景中依次点击绘制线段，单机右键结束绘制！");
    drawHandler.start();
  }

  /**
   * @description
   * @param {DrawResult} res
   */
  function drawFloodArea(res) {
    if (res.finish) {
      let pts = [];
      pts.push(...res.positions);
      convertHeightToSpecific(pts)
        .then((pos) => {
          // floodAreaEntity = window.viewer.scene.primitives.add(
          //   new Cesium.Primitive({
          //     geometryInstances: new Cesium.GeometryInstance({
          //       id: "water-primitive",
          //       geometry: new Cesium.PolygonGeometry({
          //         polygonHierarchy: new Cesium.PolygonHierarchy(pos),
          //         translucent: 0.1,
          //         perPositionHeight: true,
          //         height: 1,
          //         extrudedHeight: state.targetWaterLine,
          //       }),
          //     }),
          //     appearance: new Cesium.EllipsoidSurfaceAppearance({
          //       aboveGround: true,
          //       material: new Cesium.Material({
          //         fabric: {
          //           type: "Water",
          //           uniforms: {
          //             normalMap: waterImg,
          //             frequency: 1000.0,
          //             animationSpeed: 0.05,
          //             amplitude: 10.0,
          //           },
          //         },
          //       }),
          //     }),
          //     show: true,
          //   })
          // );
          // console.log("geom", floodAreaEntity.geometryInstances);
          // return;
          floodAreaEntity = window.viewer.entities.add({
            name: "food-area",
            polygon: {
              hierarchy: new Cesium.PolygonHierarchy(pos),
              perPositionHeight: true,
              // 使用回调函数Callback，直接设置extrudedHeight会导致闪烁
              extrudedHeight: new Cesium.CallbackProperty(function () {
                state.currentWaterLine += state.speed;
                if (state.currentWaterLine > state.targetWaterLine) {
                  state.currentWaterLine = state.targetWaterLine;
                }
                return state.currentWaterLine;
              }, false),
              material: new Cesium.Color.fromBytes(64, 157, 253, 150),
            },
          });
        })
        .catch((msg) => {
          console.error(msg);
        });
    } else console.log("unfinish");
  }

  /**
   * @description
   * @param {Array<Cesium.Cartesian3>} positions
   * @return {Promise<Array>}
   */
  function convertHeightToSpecific(positions) {
    return new Promise((resolve, reject) => {
      try {
        let carte3Pts = [];
        positions.forEach((pt) => {
          let carto = Cesium.Cartographic.fromCartesian(pt);
          carto.height = 0;
          carte3Pts.push(Cesium.Cartographic.toCartesian(carto));
        });
        resolve(carte3Pts);
      } catch {
        reject("分析失败！");
      }
    });
  }

  /**
   * @description 清除分析
   */
  function clear() {
    state.currentWaterLine = 0;
    window.viewer.scene.primitives.removeAll();
    window.viewer.entities.removeAll();
  }
  function test() {
    if (floodAreaEntity) console.log(floodAreaEntity.geometryInstances[0].geometry);
  }

  return {
    test,
    analysis,
    clear,
    ...toRefs(state),
  };
}
export { flood };
export default flood;
