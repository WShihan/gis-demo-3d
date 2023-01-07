/**
 * @description 返回值
 * @typedef Response
 * @property {String} status 状态
 * @property {String|Number|Object|Array} content 内容
 */
import Mock from "mockjs";
// 路由
const url = {
  test: "./api/test",
  help: "./api/webgis/help",
  login: "./api/login",
};
/** @type {{Response}} */
const response = {
  test: {
    status: 200,
    content: "",
  },
  help: {
    status: 200,
    content: "一个webgis练习项目……",
  },
  login: {
    status: 200,
    token: "wsh123",
    expired: "",
  },
};

export const mockRule = [
  Mock.mock(url.test, response.test),
  Mock.mock(url.help, response.help),
  Mock.mock(url.login, response.login),
];
