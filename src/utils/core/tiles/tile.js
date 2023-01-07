import { MapServiceTypeEnum } from "@/utils/core/layer/layerEum";
export class WMSTileLayer extends Cesium.ImageryLayer {
  /**
   * Creates an instance of WMSTileLayer.
   * @param {Cesium.WebMapServiceImageryProvider} provider
   * @param {{name, id}} options
   */
  constructor(provider, options) {
    super(provider, options);
    this.name = options.name;
    this.id = options.id;
    this.type = MapServiceTypeEnum.WMS;
  }
}

export class WMTSTileLayer extends Cesium.ImageryLayer {
  /**
   * Creates an instance of WMTSTileLayer.
   * @param {Cesium.WebMapTileServiceImageryProvider} provider
   * @param {{params,id, name}} options
   * @memberof WMTSTileLayer
   */
  constructor(provider, options) {
    super(provider, options);
    this.name = options.name;
    this.id = options.id;
    this.type = MapServiceTypeEnum.WMTS;
  }
}
