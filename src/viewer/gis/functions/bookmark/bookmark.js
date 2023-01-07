import { reactive, toRefs, watch, toRaw } from "vue";
import md5 from "js-md5";
import { PopTip } from "@/utils/tool";
/**
 * 相机姿态参数
 * @typedef CameraPose
 * @property {Number} pitch 翻转角度
 * @property {Number} roll 偏转角度
 * @property {Number} heading 航向
 */
/**
 * 书签构建参数
 * @typedef BookMarkParams
 * @property {String} name
 * @property {String} creator
 * @property {CameraPose} cameraPose
 * @property {Cesium.Cartesian3} cameraPosition
 */

/**
 * @description
 * @class BookMark
 */
class BookMark {
  /**
   * Creates an instance of BookMark.
   * @param {BookMarkParams} bookmarkInitOpt
   * @memberof BookMark
   */
  constructor(bookmarkInitOpt) {
    this._date = new Date();
    this._name =
      bookmarkInitOpt.name +
      "-" +
      this._date.getHours() +
      ":" +
      this._date.getMinutes() +
      ":" +
      this._date.getSeconds();
    this._creator = bookmarkInitOpt.creator;
    this._cameraPose = bookmarkInitOpt.cameraPose;
    this._cameraPosition = bookmarkInitOpt.cameraPosition;
    this._id = md5(this._date + this.name + Math.random());
    this.editable = false;
  }
  get name() {
    return this._name;
  }
  set name(val) {
    this._name = val;
  }
  get id() {
    return this._id;
  }
  set id(val) {
    this._id = val;
  }
  get cameraPose() {
    return this._cameraPose;
  }
  get cameraPosition() {
    return this._cameraPosition;
  }
}
function bookmark() {
  //   初始化参数
  let state = reactive({
    mks: [],
    viewId: "",
    iconShow: true,
    editId: "",
    editText: "",
  });
  if (!window.bookmarkArr) state.mks = window.bookmarkArr = [];
  else state.mks = window.bookmarkArr;
  // 选择集合
  var selctionIds = [];

  function createMK() {
    let camera = window.viewer.camera;
    let mk = new BookMark({
      name: "未命名书签",
      creator: "",
      cameraPose: {
        pitch: camera.pitch,
        roll: camera.roll,
        heading: camera.heading,
      },
      cameraPosition: Cesium.Cartesian3.clone(camera.positionWC),
    });
    state.mks.push(mk);
  }
  function findByID(id) {
    return state.mks.find((item) => item.id === id);
  }
  function deleteMK(id) {
    try {
      let mkIndex = state.mks.findIndex((item) => item._id === id);
      state.mks.splice(mkIndex, 1);
      // PopTip.success("删除成功！");
    } catch {
      PopTip.warning("删除失败！");
    }
  }

  function uploadMK(id) {}

  function downloadMK(id) {}

  function restoreMK(id) {
    let mk = findByID(id);
    if (mk) {
      PopTip.success("定位书签！");
      window.viewer.camera.flyTo({
        destination: mk.cameraPosition,
        orientation: {
          heading: mk.cameraPose.heading,
          roll: mk.cameraPose.roll,
          pitch: mk.cameraPose.pitch,
        },
      });
    }
  }

  function clearAllMK() {
    if (selctionIds.length == 0) return;
    selctionIds.forEach((id) => {
      console.log("delete", id);
      deleteMK(id);
    });
    selctionIds.length = 0;
    PopTip.success("全部删除！");
  }
  function setName(name) {
    try {
      let mk = findByID(state.editId);
      if (mk) mk._name = name;
      state.editId = "";
    } catch {}
  }
  function setNodeIconVisible(flag) {
    state.iconShow = flag;
  }
  function checkChange(data, check, node) {
    if (check) {
      selctionIds.push(data._id);
    } else {
      const removeIndex = selctionIds.findIndex((mk) => mk._id === data._id);
      if (removeIndex) {
        selctionIds.splice(removeIndex, 1);
      }
    }
  }
  watch(
    () => state.editId,
    (newVal, oldVal) => {
      let mk = findByID(newVal);
      if (mk) state.editText = mk._name;
    }
  );
  return {
    ...toRefs(state),
    createMK,
    deleteMK,
    setNodeIconVisible,
    restoreMK,
    downloadMK,
    clearAllMK,
    setName,
    checkChange,
  };
}
export default bookmark;
