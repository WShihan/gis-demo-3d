import { watch, ref, reactive, toRefs, onBeforeUnmount } from "vue";
import { DrawHandler, GeoMetryEnum, DrawResult } from "@/utils/core/draw";
import { drawShape, PopTip, createPoint, Notification } from "@/utils/tool.js";
import { calcSpaceDistance, calcSurfaceDistance } from "@/utils/spatialComputation.js";
import * as echarts from "echarts/core";
import { GridComponent } from "echarts/components";
import { LineChart } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
echarts.use([GridComponent, LineChart, CanvasRenderer, UniversalTransition]);

function profile(props) {
  let state = reactive({
    loading: false,
    interval: 100,
    showChart: false,
    tiped: false,
  });
  //   替换默认值
  if (props) {
    for (let key in props) {
      if (state.hasOwnProperty(key)) {
        state[key] = props[key];
      } else {
        console.error("无该属性：" + key);
      }
    }
  }

  // 初始化
  let distanceLst = [];
  let pts = [];
  let drawHand = new DrawHandler(window.viewer);
  drawHand.addDrawFinishedCallback(collectDrawPosition.bind(this));
  let floatingPt = undefined;
  let lineObj = undefined;
  let chartObj = undefined;

  function createChart() {
    chartObj = echarts.init(document.getElementById("profile_chart"));
    var option;

    option = {
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: [],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: [],
          type: "line",
          areaStyle: {},
        },
      ],
    };
    option && chartObj.setOption(option);
    window.addEventListener("resize", () => {
      setTimeout(() => {
        chartObj.resize();
      }, 1000);
    });
  }
  // 开始分析
  function analyse() {
    drawHand.DrawMode = GeoMetryEnum.POLYLINE;
    if (!chartObj) createChart();
    drawHand.start();
    if (!state.tiped) {
      Notification.info("鼠标左键在场景中以此点击绘制线段，单机右键完成绘制！");
      state.tiped = true;
    }
  }

  /**
   * @description 绘制位置的回调
   * @param {DrawResult} drawResult
   */
  function collectDrawPosition(drawResult) {
    if (drawResult.finish) {
      const positions = drawResult.positions;
      pts.push(...positions);
      updateChart(pts);
    }
  }

  // 更新图表
  function updateChart(positions) {
    const spaceDist = calcSpaceDistance(positions);
    if (spaceDist > 500000) {
      PopTip.warning("距离过大！");
      clear();
      return;
    }
    state.loading = true;
    calcSurfaceDistance(window.viewer, positions)
      .then((res) => {
        const option = {
          toolbox: {
            show: true,
            feature: {
              dataZoom: {
                yAxisIndex: "none",
              },
              dataView: { readOnly: false },
              magicType: { type: ["line", "bar"] },
              restore: {},
              saveAsImage: {},
            },
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: res.category,
            show: true,
            name: "距离/m",
            nameLocation: "middle",
            nameGap: 25,
          },
          yAxis: {
            type: "value",
            name: "高度/m",
          },
          series: [
            {
              data: res.positions.map((val) => val.height),
              type: "line",
              areaStyle: {},
            },
          ],
        };
        chartObj.setOption(option);
        state.showChart = true;

        console.log(res);
      })
      .catch((res) => {
        PopTip.warning("分析异常：" + res);
        console.error(res);
      })
      .finally(() => {
        state.loading = false;
      });
  }

  // 清除分析结果
  function clear() {
    try {
      window.viewer.entities.removeAll();
      pts.length = 0;
      distanceLst.el = 0;
      lineObj = undefined;
      floatingPt = undefined;
      chartObj = undefined;
      state.showChart = false;
    } catch {
      PopTip.error("清除错误！");
    }
  }

  return {
    ...toRefs(state),
    analyse,
    clear,
  };
}

export default profile;
export { profile };
