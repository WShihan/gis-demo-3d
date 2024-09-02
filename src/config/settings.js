import localImageryMap from "@/assets/img/baseMap.webp";

export const gisServer = {
  geoServr: {
    url: "http://www.xiemolin233.cn:8081/geoserver",
    desc: "geoServer服务器地址",
  },
};

export const cesiumCfg = {
  // cesium 在线资源访问令牌
  token: "",
  init: {
    // 位置查找工具
    geocoder: false,
    // 视角返回初始位置
    homeButton: false,
    // 选择视角的模式（球体、平铺、斜视平铺）
    sceneModePicker: false,
    // 图层选择器（地形影像服务）
    baseLayerPicker: false,
    // 导航帮助(手势，鼠标)
    navigationHelpButton: false,
    // 左下角仪表盘（动画器件）
    animation: false,
    // 底部时间线
    timeline: false,
    // 点击信息弹窗
    infoBox: false,
    // 全屏
    fullscreenButton: false,
    // VR
    vrButton: false,
    //开启动画
    shouldAnimate: true,
    // 底图点击
    baseLayerPicker: false,
    // 在线的底图影像服务
    imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
      url: "https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer",
    }),
    // 本地的底图影像
    // imageryProvider: new Cesium.SingleTileImageryProvider({
    //   credit: "本地",
    //   url: localImageryMap,
    // }),
  },
};

export const defaultSettings = {
  // 地形默认开启
  terrain: false,
  // 地形透明度
  terrainOpacity: 1,
  // 深度检测
  depthTestAgainstTerrain: true,
  // 黑夜效果
  enableLighting: false,
  // arcgis底图
  baseMap: {
    url: "https://server.arcgisonline.com/arcgis/rest/services/World_Terrain_Base/MapServer",
    params: {},
  },
  // 默认打开图层集合id
  defaultOpenLayers: [100, 180],
  // arcgis在线地形
  arcgisTerrainUrl:
    "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer",
  // 天地图
  tianditu: {
    //天地图影像底图
    url: "http://t{s}.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=bdbf8bbd2d00a2731397dca87a489db0",
    // subdomains: subdomains,
    layer: "tdtImgLayer",
    style: "default",
    format: "image/jpeg",
    tileMatrixSetID: "GoogleMapsCompatible", //使用谷歌的瓦片切片方式
    show: true,
  },
  // 默认初始视图地址：经度，纬度，高度
  homeView: [102.57987976, 24.97855949, 1500000],
};

// 功能及工具箱配置
export const func = [
  {
    name: "drawing",
    title: "绘制",
    icon: "icon-drawing",
    action: 0,
  },
  {
    name: "fly",
    title: "漫游",
    icon: "icon-manyou",
    action: 0,
  },
  {
    name: "QueryByProperty",
    title: "查询",
    icon: "icon-chaxun",
    action: 0,

    subFuncs: [
      { name: "queryByProperty", title: "属性查询", icon: "dfd" },
      { name: "queryByLocation", title: "空间查询", icon: "dfd" },
    ],
  },
  {
    name: "bookmark",
    title: "书签",
    icon: "icon-shuqian",
    action: 0,
  },
  {
    name: "screenSplit",
    title: "分屏",
    icon: "icon-fenping",
    action: 2,
  },
  {
    name: "effect",
    title: "特效",
    icon: "icon-texiao",
    action: 0,
  },
  {
    name: "fileOpen",
    title: "数据加载",
    icon: "icon-file",
    action: 0,
  },
  {
    name: "dashBoard",
    title: "控制台",
    action: 1,
    icon: "icon-dashBoard",
  },
  {
    name: "settings",
    title: "设置",
    icon: "icon-settings",
    action: 0,
  },
  {
    name: "help",
    title: "帮助",
    icon: "icon-icon",
    action: 0,
  },
];
