import { WMSTileLayer, WMTSTileLayer } from "@/utils/core/tiles/tile.js";
import {
  LayerEum,
  MapServiceTypeEnum,
  WMSLayerOpt,
  WMTSLayerOpt,
} from "@/utils/core/layer/layerEum.js";
import { gisServer } from "@/config/settings.js";
import { toRaw } from "vue";
/**
 * @description图层管理类
 * @class LayerManager
 */
export class LayerManager {
  /**
   * Creates an instance of LayerManager.
   * @memberof LayerManager
   */
  constructor() {
    /**
     * @type {Array<WMSTileLayer>}
     */
    this.layers = [];
    this.ready = false;
  }

  /**
   * @description
   * @param {WMSLayerOpt|WMTSLayerOpt} layer
   * @return {Boolean}
   * @memberof LayerManager
   */
  isLayerExists(layer) {
    return window.viewer.imageryLayers.contains(layer);
  }

  /**
   * @description
   * @param {WMSLayerOpt|WMTSLayerOpt} layer
   * @param {Cesium.SplitDirection} position
   * @memberof LayerManager
   */
  addLayer(layer, position) {
    if (this.getLayerById(layer.id)) {
      this.removeById(layer.id);
    } else {
      let lyr = this.loadLayer(layer);
      if (lyr) {
        if (position) {
          lyr.splitDirection = position;
          window.viewer.imageryLayers.add(lyr, (this.layers.length + 1) * 10 + 1);
        } else {
          window.viewer.imageryLayers.add(lyr, this.layers.length + 1);
        }
        this.layers.push(lyr);
      }
    }
  }

  /**
   * @description
   * @param {WMSLayerOpt|WMTSLayerOpt} layer
   * @return {Cesium.ImageryLayer}
   * @memberof LayerManager
   */
  loadLayer(layer) {
    let lyr;
    switch (layer.serviceType) {
      case MapServiceTypeEnum.WMS:
        const geoServerLyrProv = new Cesium.WebMapServiceImageryProvider({
          url: gisServer.geoServr.url + "/" + layer.workSpace + "/wms",
          layers: layer.name,
          parameters: {
            ...layer.params,
          },
        });
        lyr = new WMSTileLayer(geoServerLyrProv, layer);
        break;
      case MapServiceTypeEnum.WMTS:
        let wmtsPro = new Cesium.WebMapTileServiceImageryProvider(layer.params);
        lyr = new WMTSTileLayer(wmtsPro, layer);
        break;
    }
    return lyr;
  }

  /**
   * 根据图层id获取图层
   * @param {Number} id
   * @returns {WMSTileLayer||undefined}
   */
  getLayerById(id) {
    var layer = this.layers.find((value) => value.id == id);
    if (!layer) {
      return undefined;
    }
    return toRaw(layer);
  }

  /**
   * 根据图层id获取图层
   * @param {String} name
   * @returns
   */
  getLayerByName(name) {
    var layer = this.layers.find((value) => value.enName() == name);
    if (!layer) {
      return undefined;
    }
    return layer;
  }

  clearAllLayer() {
    this.layers.forEach((lyr) => {
      window.viewer.imageryLayers.remove(lyr, true);
    });
    this.layers.len = 0;
  }

  /**
   * @description
   * @param {WMSLayerOpt|WMTSLayerOpt} layerOpt
   * @param {Boolean} isDestroy
   * @return {Boolean}
   * @memberof LayerManager
   */
  removeLayer(layerOpt, isDestroy) {
    var lyr = this.getLayerById(layerOpt.id);
    if (lyr) {
      if (window.viewer.imageryLayers.remove(lyr, isDestroy)) {
        this.layers.map((val, index) => {
          if (val.id == layerOpt.id) {
            if (this.layers.splice(index, 1)) return true;
            else return false;
          }
        });
      } else return false;
    }
  }
}

export default LayerManager;
