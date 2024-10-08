import { LayerEum, MapServiceTypeEnum } from "@/utils/core/layer/layerEum";
const TileMatrixLabels = [
  "EPSG:900913:0",
  "EPSG:900913:1",
  "EPSG:900913:2",
  "EPSG:900913:3",
  "EPSG:900913:4",
  "EPSG:900913:5",
  "EPSG:900913:6",
  "EPSG:900913:7",
  "EPSG:900913:8",
  "EPSG:900913:9",
  "EPSG:900913:10",
  "EPSG:900913:11",
  "EPSG:900913:12",
  "EPSG:900913:13",
  "EPSG:900913:14",
  "EPSG:900913:15",
  "EPSG:900913:16",
  "EPSG:900913:17",
  "EPSG:900913:18",
];
export const layerTree = [
  {
    zhName: "云南省",
    type: LayerEum.LAYER_FOLDER,
    subLayers: [
      {
        zhName: "云南省行政边界",
        name: "yunnan",
        id: 100,
        serviceType: MapServiceTypeEnum.WMS,
        workSpace: "yunnan",
        type: LayerEum.LAYER,
        params: {
          request: "GetMap",
          transparent: true,
          format: "image/png",
          VERSION: "1.1.1",
          style: "",
          srs: "EPSG:4326",
          exceptions: "application/vnd.ogc.se_inimage",
        },
      },

      {
        zhName: "湖泊",
        name: "yunnanLakes",
        id: 110,
        serviceType: MapServiceTypeEnum.WMTS,
        workSpace: "Yunnan",
        type: LayerEum.LAYER,
        params: {
          url: process.env.VUE_APP_GEOSERVER_BASE_URL + "/wmts",
          layer: "yunnan:yunnanLakes",
          format: "image/png",
          style: "",
          tileMatrixSetID: "EPSG:900913",
          tileMatrixLabels: TileMatrixLabels,
        },
      },
      {
        zhName: "水系",
        name: "yunnanRivers",
        id: 120,
        serviceType: MapServiceTypeEnum.WMTS,
        workSpace: "Yunnan",
        type: LayerEum.LAYER,
        params: {
          url: process.env.VUE_APP_GEOSERVER_BASE_URL + "/wmts",
          layer: "yunnan:yunnanRivers",
          format: "image/png",
          style: "",
          tileMatrixSetID: "EPSG:900913",
          tileMatrixLabels: TileMatrixLabels,
        },
      },
      // {
      //   zhName: "2005年人口密度",
      //   name: "pop2005",
      //   id: 130,
      //   serviceType: MapServiceTypeEnum.WMTS,
      //   workSpace: "Yunnan",
      //   type: LayerEum.LAYER,
      //   params: {
      //     url: process.env.VUE_APP_GEOSERVER_BASE_URL + "/wmts",
      //     layer: "yunnan:pop2005",
      //     style: "pop2005",
      //     format: "image/png",
      //     tileMatrixSetID: "EPSG:900913",
      //     tileMatrixLabels: TileMatrixLabels,
      //   },
      // },
      // {
      //   zhName: "2016年夜间灯光",
      //   name: "Yunnan_night_light_2016",
      //   id: 140,
      //   serviceType: MapServiceTypeEnum.WMTS,
      //   workSpace: "Yunnan",
      //   type: LayerEum.LAYER,
      //   params: {
      //     url: process.env.VUE_APP_GEOSERVER_BASE_URL + "/wmts",
      //     layer: "yunnan:Yunnan_night_light_2016",
      //     style: "raster",
      //     format: "image/png",
      //     tileMatrixSetID: "EPSG:900913",
      //     tileMatrixLabels: TileMatrixLabels,
      //   },
      // },
      {
        zhName: "土壤类型",
        name: "YunnanSoilClass",
        id: 150,
        serviceType: MapServiceTypeEnum.WMTS,
        workSpace: "Yunnan",
        type: LayerEum.LAYER,
        params: {
          url: process.env.VUE_APP_GEOSERVER_BASE_URL + "/wmts",
          layer: "yunnan:YunnanSoilClass",
          style: "",
          format: "image/png",
          tileMatrixSetID: "EPSG:900913",
          tileMatrixLabels: TileMatrixLabels,
        },
      },
      // {
      //   zhName: "A级景区",
      //   name: "parks",
      //   id: 160,
      //   serviceType: MapServiceTypeEnum.WMS,
      //   workSpace: "Yunnan",
      //   type: LayerEum.LAYER,
      //   params: {
      //     request: "GetMap",
      //     transparent: true,
      //     format: "image/png",
      //     VERSION: "1.1.1",
      //     style: "",
      //     srs: "EPSG:4326",
      //     exceptions: "application/vnd.ogc.se_inimage",
      //   },
      // },
      // {
      //   zhName: "乐高风格",
      //   name: "YunnanLegoMap",
      //   id: 170,
      //   serviceType: MapServiceTypeEnum.WMTS,
      //   workSpace: "Yunnan",
      //   type: LayerEum.LAYER_GROUP,
      //   params: {
      //     url: process.env.VUE_APP_GEOSERVER_BASE_URL + "/wmts",
      //     layer: "YunnanLegoMap",
      //     // style: "raster",
      //     format: "image/png",
      //     tileMatrixSetID: "EPSG:900913",
      //     tileMatrixLabels: TileMatrixLabels,
      //   },
      // },
    ],
  },
  {
    zhName: "天地图",
    type: LayerEum.LAYER_FOLDER,
    subLayers: [
      {
        zhName: "天地图标注",
        name: "tiandituLabel",
        id: 180,
        serviceType: MapServiceTypeEnum.WMTS,
        type: LayerEum.LAYER,
        params: {
          url: "http://t0.tianditu.gov.cn/cia_w/wmts?tk=bdbf8bbd2d00a2731397dca87a489db0",
          layer: "cia",
          style: "default",
          tileMatrixSetID: "w",
          format: "tiles",
          maximumLevel: 18,
        },
      },
    ],
  },
];
