const { defineConfig } = require("@vue/cli-service");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const path = require("path");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
// process.env.VUE_APP_VERSION = "development";
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: "./",
  outputDir: "dist", // 输出文件目录
  lintOnSave: false, // eslint 是否在保存时检查 关闭语法检查
  assetsDir: "static/gis", // 配置js、css静态资源二级目录的位置
  configureWebpack: {
    output: {
      sourcePrefix: " ",
    },
    amd: {
      toUrlUndefined: true,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        Cesium: path.resolve(__dirname, "public/static/gis/Cesium/Cesium"),
      },
    },
    plugins: [
      new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify("./"),
      }),
      new NodePolyfillPlugin(),
    ],
  },
  chainWebpack: (config) => {
    config.module.rule("svg").exclude.add(resolve("src/assets/icons")).end();
    // set svg-sprite-loader
    config.module.rule("svg").exclude.add(resolve("src/assets/icons")).end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/assets/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end();
  },
});
