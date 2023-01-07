import { drawShape, createPoint } from "@/utils/tool.js";

/**
 * @description 绘制枚举类
 * @export
 * @class GeoMetryEnum
 */
export class GeoMetryEnum {
  //  点
  static get POINT() {
    return "point";
  }
  //  面
  static get POLYLINE() {
    return "polyline";
  }
  // 多边形
  static get POLYGON() {
    return "polygon";
  }
}

/**
 * 绘制回调结果
 * @typedef DrawResult
 * @property {Array<Cesium.Cartesian3>} positions 位置
 * @property {Array<Cesium.Entity>} entity 绘制实体
 * @property {Boolean} finish 绘制是否完成
 *
 */
export class CRSType {
  static get cartesian3() {
    return 0;
  }
  static get cartographic() {
    return 1;
  }
}
export class DrawHandler {
  /**
   * Creates an instance of drawhandler.
   * @param {Cesium.Viewer} viewer
   * @memberof drawhandler
   */
  constructor(viewer) {
    this.viewer = viewer;
    this.activeShapePoints = [];
    this._drawingMode = GeoMetryEnum.POINT;
    this.handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    this.drawFinishedCallbacks = [];
    this._activity = true;
    this._crsType = CRSType.cartesian3;
    this.tempEntity = undefined;
    this.floatingPt = undefined;
  }
  //  活动属性
  get activity() {
    return this._activity;
  }
  set activity(flag) {
    this._activity = flag;
  }
  // 绘制模式属性
  get DrawMode() {
    return this._drawingMode;
  }

  set DrawMode(mode) {
    this._drawingMode = mode;
  }

  //   添加回调
  addDrawFinishedCallback(callback) {
    if (this.drawFinishedCallbacks) {
      this.drawFinishedCallbacks.push(callback);
    }
  }

  //   移除回调
  removeDrawFinishedCallback(callback) {
    const removeIndex = this.drawFinishedCallbacks.findIndex((item) => item === callback);
    this.drawFinishedCallbacks.splice(removeIndex, 1);
  }

  //   清空回调
  clearAllDrawFinishedCallbacks() {
    this.drawFinishedCallbacks.length = 0;
  }

  //   初始化事件
  start() {
    this.clear();
    this.setCursorStyle(true);
    this.activity = true;
    // 绑定左键事件
    this.handler.setInputAction(
      this.leftClickHandler.bind(this),
      Cesium.ScreenSpaceEventType.LEFT_CLICK
    );
    if (this.DrawMode != GeoMetryEnum.POINT) {
      // 鼠标移动事件
      this.handler.setInputAction(
        this.mouseMoveHandler.bind(this),
        Cesium.ScreenSpaceEventType.MOUSE_MOVE
      );
    }

    // 结束事件
    this.handler.setInputAction(this.endDraw.bind(this), Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }

  //  鼠标左键事件处理
  leftClickHandler(evt) {
    let earthPosition = this.viewer.scene.pickPosition(evt.position);
    if (!earthPosition) return;
    if (!this.floatingPt) this.floatingPt = createPoint(earthPosition);
    if (earthPosition) {
      this.activeShapePoints.push(earthPosition);
    }
  }

  //  鼠标移动事件处理
  mouseMoveHandler(evt) {
    const newPosition = this.viewer.scene.pickPosition(evt.endPosition);
    if (Cesium.defined(newPosition)) {
      if (this.floatingPt) this.floatingPt.position.setValue(newPosition);
      this.activeShapePoints.pop();
      this.activeShapePoints.push(newPosition);
      this.updateTempEntity(this.activeShapePoints);
      this.sendPositions();
    }
  }

  // 结束绘制
  endDraw() {
    this.activity = false;
    this.sendPositions();
    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    this.setCursorStyle(false);
  }
  // 发送坐标
  sendPositions() {
    if (!this.activity) {
      this.activeShapePoints.pop();
    }
    this.drawFinishedCallbacks.forEach((item) => {
      item({
        positions: Array.from(this.activeShapePoints),
        entity: this.tempEntity,
        finish: !this.activity,
      });
    });
  }

  clear() {
    this.tempEntity = undefined;
    this.activeShapePoints.length = 0;
  }

  /**
   * @description 绘制几何
   * @param {Array} positions
   * @memberof DrawHandler
   */
  updateTempEntity(positions) {
    const dynamicPositions = new Cesium.CallbackProperty(() => {
      if (this.DrawMode === GeoMetryEnum.POLYGON) {
        return new Cesium.PolygonHierarchy(positions);
      } else return positions;
    });
    if (!this.tempEntity) {
      this.tempEntity = drawShape(dynamicPositions, {
        drawingMode: this.DrawMode,
        clampMod: true,
      });
    }
  }

  // 设置地图鼠标样式
  setCursorStyle(flag) {
    try {
      let map = document.getElementById("map");
      map.style.cursor = flag === true ? "crosshair" : "pointer";
    } catch {
      console.error("未匹配到地图元素！");
    }
  }
}
