export class LayerEum {
  static get LAYER() {
    return "layer";
  }
  static get LAYER_GROUP() {
    return "layerGroup";
  }
  static get LAYER_FOLDER() {
    return "layerFolder";
  }
}

export class MapServiceTypeEnum {
  static get WFS() {
    return "WFS";
  }
  static get WMTS() {
    return "WMTS";
  }
  static get WMS() {
    return "WMS";
  }
}

/**
 * @typedef WMSLayerOpt
 * @property {String} zhName
 * @property {String} name
 * @property {Number} id
 * @property {LayerEum} type
 * @property {String} workSpace
 * @property {Object} params
 */

/**
 * @typedef WMTSLayerOpt
 * @property {String} zhName
 * @property {String} name
 * @property {Number} id
 * @property {LayerEum} type
 * @property {String} workSpace
 * @property {{url, layer, style, format, tileMaxtrixSetID,tileMatrixLabels }} params
 */
