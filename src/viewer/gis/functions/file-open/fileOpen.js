import { PopTip } from "@/utils/tool";
import { toRefs, reactive, toRaw, onMounted } from "vue";
function fileOpen() {
  let state = reactive({
    // 所选文件
    files: [],
  });
  if (!window.dataSources) window.dataSources = [];
  let dataSources = window.dataSources;
  function addData() {
    if (state.files.length < 1) return;
    const reader = new FileReader();
    reader.addEventListener("load", (event) => {
      Cesium.GeoJsonDataSource.load(event.target.result, {
        stroke: Cesium.Color.RED,
        fill: Cesium.Color.BLUE,
        clampToGround: true,
      }).then((dataSource) => {
        dataSources.push(dataSource);
        window.viewer.dataSources.add(dataSource);
      });
    });
    reader.readAsDataURL(toRaw(state.files[0]).raw);
    PopTip.success("加载成功！");
  }

  function removeData() {
    console.log(dataSources);
    if (state.files.length < 1) return;
    dataSources.forEach((item) => {
      window.viewer.dataSources.remove(item, true);
    });
    dataSources.length = 0;
    PopTip.success("全部移除！");
  }

  return {
    ...toRefs(state),
    addData,
    removeData,
  };
}

export default fileOpen;
