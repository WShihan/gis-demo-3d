import { cesiumCfg, defaultSettings } from "@/config/settings.js";
/**
 * @description Cesium地图初始化
 */
export function mapper() {
  window.viewer = new Cesium.Viewer("map", cesiumCfg.init);
  window.viewer.imageryProvider = new Cesium.WebMapTileServiceImageryProvider(
    defaultSettings.tianditu
  );
  if (defaultSettings.terrain) {
    window.viewer.terrainProvider = new Cesium.ArcGISTiledElevationTerrainProvider({
      url: defaultSettings.arcgisTerrainUrl,
    });
  }

  // 旧版本token报错，不能使用cesium在线资源，索性直接不用
  // Cesium.Ion.defaultAccessToken = cesiumCfg.token;
  window.viewer._cesiumWidget._creditContainer.style.display = "none";
  window.viewer.scene.globe.enableLighting = defaultSettings.enableLighting;
  window.viewer.scene.globe.depthTestAgainstTerrain = defaultSettings.depthTestAgainstTerrain;
  var homeView = {
    destination: new Cesium.Cartesian3.fromDegrees(...defaultSettings.homeView),
  };
  // 定位到初始地点
  viewer.scene.camera.setView(homeView);
}

/**
 * @description 地图操作类
 * @export
 * @class MapToolHandler
 */
export class MapToolHandler {
  /**
   * Creates an instance of MapToolHandler
   * @param {*} viewer
   * @memberof MapToolHandler
   */
  constructor(viewer) {
    this.vw = viewer;
  }
  getHeight() {
    /**@type {Cesium.Camera} */
    const camera = window.viewer.scene.camera;
    return camera.positionCartographic.height;
  }

  /**
   * @return {lon:Number, lat:number, height:number}
   * @description 获取视图中心点
   */
  pickCenter() {
    var ellipsoid = window.viewer.camera.pickEllipsoid(
      new Cesium.Cartesian2(viewer.canvas.clientWidth / 2, viewer.canvas.clientHeight / 2)
    );
    var curPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(ellipsoid);
    var lon = (curPosition.longitude * 180) / Math.PI;
    var lat = (curPosition.latitude * 180) / Math.PI;
    return {
      lon: lon,
      lat: lat,
    };
  }

  /**
   * @param {Number} flag  0表示放大，1表示缩小
   * @description 放大缩小
   */
  zoomInOrOut(flag) {
    var center = this.pickCenter();
    var height = this.getHeight();
    var boundingSph = new Cesium.BoundingSphere(
      Cesium.Cartesian3.fromDegrees(center.lon, center.lat, 1000),
      height
    );
    var moveRate = 0;
    if (flag) {
      switch (height) {
        case height < 0:
          break;
        case 0 <= height < 100000:
          moveRate = 1.1;
          break;
        case 100000 <= height < 1000000:
          moveRate = 1.3;
          break;
        default:
          moveRate = 1.5;
          break;
      }
    } else {
      switch (height) {
        case height < 0:
          break;
        case 0 <= height < 100000:
          moveRate = 0.9;
          break;
        case 100000 <= height < 1000000:
          moveRate = 0.7;
          break;
        default:
          moveRate = 0.5;
          break;
      }
    }
    var zoomParams = {
      duration: 0.8,
      offset: new Cesium.HeadingPitchRange(
        this.vw.camera.heading,
        this.vw.camera.pitch,
        height * moveRate
      ),
    };
    this.vw.camera.flyToBoundingSphere(boundingSph, zoomParams);
  }

  /**
   * @description 定位
   * @param {Number} lon
   * @param {Number} lat
   * @param {Number} duration
   * @memberof MapToolHandler
   */
  locateByFly(lon, lat, height, duration) {
    this.vw.scene.camera.flyTo({
      duration: duration,
      destination: Cesium.Cartesian3.fromDegrees(lon, lat, height),
    });
  }
  locateHere(lon, lat) {
    let viewer = window.viewer;
    var position = Cesium.Cartesian3.fromDegrees(lon, lat, 100);
    position = viewer.scene.clampToHeight(position);
    let entity = viewer.entities.add({
      id: "location",
      name: "location",
      position: position,
      point: {
        color: new Cesium.Color(0.031, 0.36, 0.57, 0.4),
        pixelSize: 50,
        disableDepthTestDistance: 5000000000,
        outlineWidth: 1,
        outlineColor: new Cesium.Color(0.78, 0.87, 0.93, 1),
      },
    });
    viewer.zoomTo(entity);
  }

  /**
   * @param {Number} long 经度
   * @param {Number} lat 纬度
   * @param {Number} confidence 精度
   * @memberof MapToolHandler
   */
  static locate(lon, lat, confidence = 50) {
    var camera = window.viewer.camera;
    /** @type {Cesium.Viewer} */
    let viewer = window.viewer;
    var entity = viewer.entities.getById("location");
    var position = Cesium.Cartesian3.fromDegrees(lon, lat, 100);
    position = viewer.scene.clampToHeight(position);
    if (entity) {
      entity.position = position;
    } else {
      entity = viewer.entities.add({
        id: "location",
        name: "location",
        position: position,
        point: {
          color: new Cesium.Color(0.031, 0.36, 0.57, 0.4),
          pixelSize: confidence,
          disableDepthTestDistance: 5000000000,
          outlineWidth: 1,
          outlineColor: new Cesium.Color(0.78, 0.87, 0.93, 1),
        },
      });
    }
    camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(lon, lat, 10000),
      roll: camera.roll,
      pitch: camera.pitch,
    });
  }

  /**
   * @memberof MapToolHandler
   * description 修改相机朝向-北方
   */
  headingNorth() {
    let camera = this.vw.camera;
    camera.flyTo({
      destination: camera.positionWC,
      heading: 0,
      pitch: camera.pitch,
      roll: camera.roll,
    });
  }
  destroye() {
    delete this.vw;
    delete this.cdiffusion;
  }
}
/**
 * @description获取相机高度
 * @export
 * @param {Cesium.viewer} viewer
 * @return {Number}
 */
export function getHeight(viewer) {
  const camera = viewer.scene.camera;
  return camera.positionCartographic.height;
}
