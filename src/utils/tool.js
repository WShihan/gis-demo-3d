import { transform, isEqual, isObject, reject } from "lodash";
import { GeoMetryEnum } from "@/utils/core/draw";
import { ElNotification } from "element-plus";
import { ElMessage } from "element-plus";

/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
export function diff2obj(object, base) {
  return transform(object, (result, value, key) => {
    if (!isEqual(value, base[key])) {
      result[key] = isObject(value) && isObject(base[key]) ? difference(value, base[key]) : value;
    }
  });
}

/**
 * @param  {Array} arr1
 * @param  {Array}  arr2
 * @return {Array}  str   返回两个数组对比之后arr1比arr2多出的值
 */
export function diffArr(arr1, arr2) {
  var oneArr = arr1;
  var twoArr = arr2;
  var diffArray = [];
  for (var i = 0; i < oneArr.length; i++) {
    var flag = true;
    for (var j = 0; j < twoArr.length; j++) {
      if (twoArr[j] === oneArr[i]) {
        flag = false;
        break;
      }
    }
    // 找不到这个值就把它添加到差异数组中
    if (flag) {
      diffArray.push(oneArr[i]);
    }
  }
  return diffArray;
}

/**
 * @description 获取坐标
 * @export
 * @param {Cesium.viewer.scene} scene
 * @param {Cesium.Cartesian2} pixel
 * @return {!Cesium.Cartesian3|undefined}
 */
export function pickOnTerrainOrEllipsoid(scene, pixel) {
  const ray = scene.camera.getPickRay(pixel);
  const target = scene.globe.pick(ray, scene);
  return target || scene.camera.pickEllipsoid(pixel);
}

/**
 * @description 绘制点
 * @param {Array<Number>} worldPosition
 * @return {Cesium.Entity}
 */
export function createPoint(worldPosition, pixel = 10) {
  const point = window.viewer.entities.add({
    position: worldPosition,
    point: {
      color: Cesium.Color.RED,
      pixelSize: pixel,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    },
  });
  console.log("pt", point);
  return point;
}

/**
 * @description 绘制图形
 * @param {Array<Number>} positionData
 * @param {{drawingMode, clampMod}} option
 * @return {Cesium.Entity}
 */
export function drawShape(positionData, option) {
  let shape;
  if (option.drawingMode === GeoMetryEnum.POLYLINE) {
    shape = window.viewer.entities.add({
      id: "draw-temprary-entity",
      polyline: {
        positions: positionData,
        clampToGround: option.clampMod,
        width: 3,
      },
    });
  } else if (option.drawingMode === GeoMetryEnum.POLYGON) {
    shape = window.viewer.entities.add({
      id: "draw-temprary-entity",
      polygon: {
        hierarchy: positionData,
        material: new Cesium.ColorMaterialProperty(Cesium.Color.WHITE.withAlpha(0.5)),
      },
    });
  }
  return shape;
}

/**
 * @description 返回随机整数，包含边界
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 */
export function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //含最大值，含最小值
}

/**
 * @description 提示枚举类
 * @export
 * @class PopTip
 */
export class PopTip {
  static success(msg) {
    ElMessage({
      message: msg,
      type: "success",
    });
  }
  static info(msg) {
    ElMessage({
      message: msg,
      type: "info",
    });
  }
  static warning(msg) {
    ElMessage({
      message: msg,
      type: "warning",
    });
  }
  static error(msg) {
    return ElMessage({
      message: msg,
      type: "error",
    });
  }
}

/**
 * @description 通知类
 * @export
 * @class Notification
 */
export class Notification {
  static success(msg) {
    return ElNotification({
      message: msg,
      type: "success",
    });
  }
  static info(msg) {
    return ElNotification({
      message: msg,
      type: "info",
    });
  }
  static warning(msg) {
    return ElNotification({
      message: msg,
      type: "warning",
    });
  }
  static error(msg) {
    return ElNotification({
      message: msg,
      type: "error",
    });
  }
}

/**
 * @description 获取元素 border 和 padding 宽度在内的一系列值
 * @export
 * @param {HTMLElement} el
 * @return {*}
 */
export function getElementStyle(el) {
  if (window.getComputedStyle) {
    return window.getComputedStyle(el, null);
  } else {
    return el.currentStyle;
  }
}

export function degree2DegMinSec(val) {
  val = Math.abs(val);
  const deg = parseInt(val);
  const minDelta = (val - deg) * 60;
  const min = parseInt(minDelta);
  const sec = parseInt((minDelta - min) * 60);
  return `${deg}°${min}′${sec}″`;
}
