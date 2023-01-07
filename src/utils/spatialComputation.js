/**
 * @description 计算空间距离
 * @export
 * @param {Array<Cesium.Cartesian3>} positions
 * @return {Promise}
 */
export function calcSpaceDistance(positions) {
  try {
    let totalDist = 0;
    const ptLength = positions.length;
    for (let i = 0; i < ptLength - 1; i++) {
      const dist = Cesium.Cartesian3.distance(positions[i], positions[i + 1]);
      totalDist += dist;
    }
    return totalDist;
  } catch (e) {
    return undefined;
  }
}
/**
 * 计算表面距离返回参数
 * @typedef calcSurfaceDistReturns
 * @property {Number} distance 距离
 * @property {Array<Number>} category 分段距离，每一段是前端累加
 * @property {Array<Cesium.Cartesian3>} positions 修改后的世界坐标系
 */

export const calcSurfaceDistReturns = {};
/**
 * @description 计算表面距离
 * @export
 * @param {Cesium.Viewer} viewer
 * @param {Array<Cesium.Cartesian3>} pts
 * @return {Promise}
 */
export function calcSurfaceDistance(viewer, pts) {
  return new Promise((resolve, reject) => {
    let positions = [];
    for (let i = 0; i < pts.length - 1; i++) {
      let startPosition = pts[i];
      let endPosition = pts[i + 1];
      let linearDistance = Cesium.Cartesian3.distance(
        startPosition,
        endPosition
      ); //高度采样
      let count = Math.floor(linearDistance); //100米之内的精确到厘米
      if (linearDistance < 100) {
        count *= 100; //5000米之内的精确到分米
      } else if (linearDistance < 5000) {
        count *= 5;
      }
      let startCartographic = Cesium.Cartographic.fromCartesian(startPosition);
      let endCartographic = Cesium.Cartographic.fromCartesian(endPosition);
      positions.push(startCartographic);
      for (let i = 1; i < count; i++) {
        let cart = Cesium.Cartesian3.lerp(
          startPosition,
          endPosition,
          i / count,
          new Cesium.Cartesian3()
        );
        positions.push(Cesium.Cartographic.fromCartesian(cart));
      }
      positions.push(endCartographic);
    }
    let promise = Cesium.sampleTerrainMostDetailed(
      viewer.terrainProvider,
      positions
    );
    promise
      .then((updatedPositions) => {
        let distCatogry = [];
        let surfaceDistance = 0;
        for (let i = 0; i < updatedPositions.length; i++) {
          if (i == updatedPositions.length - 1) continue;
          const dist = Cesium.Cartesian3.distance(
            Cesium.Cartesian3.fromRadians(
              updatedPositions[i].longitude,
              updatedPositions[i].latitude,
              updatedPositions[i].height
            ),
            Cesium.Cartesian3.fromRadians(
              updatedPositions[i + 1].longitude,
              updatedPositions[i + 1].latitude,
              updatedPositions[i + 1].height
            )
          );
          surfaceDistance += dist;
          distCatogry.push(surfaceDistance.toFixed(0));
        }
        resolve({
          distance: surfaceDistance,
          category: distCatogry,
          positions: updatedPositions,
        });
      })
      .catch((e) => {
        reject(e);
      });
  });
}

/**
 * @description 计算多边形面积
 * @param {Array<Cesium.Cartesian3>} points
 * @return {Promise}
 */
export function calcSurfaceArea(points) {
  return new Promise((resolve, reject) => {
    try {
      var res = 0;
      //拆分三角曲面
      for (var i = 0; i < points.length - 2; i++) {
        var j = (i + 1) % points.length;
        var k = (i + 2) % points.length;
        var totalAngle = Angle(points[i], points[j], points[k]);

        var dis_temp1 = distance(points[j], points[0]);
        var dis_temp2 = distance(points[k], points[0]);
        res += (dis_temp1 * dis_temp2 * Math.sin(totalAngle)) / 2;
      }
      resolve(Math.abs((res / 1000000.0).toFixed(4)));
    } catch {
      reject("错误");
    }
  });
}

/**
 * @description 计算角度
 * @param {Cesium.Cartesian3} p1
 * @param {Cesium.Cartesian3} p2
 * @param {Cesium.Cartesian3} p3
 * @return {Number}
 */
function Angle(p1, p2, p3) {
  var bearing21 = Bearing(p2, p1);
  var bearing23 = Bearing(p2, p3);
  var angle = bearing21 - bearing23;
  if (angle < 0) {
    angle += 360;
  }
  return angle;
}

/**
 * @description 计算方向
 * @param {Cesium.Cartesian3} from
 * @param {Cesium.Cartesian3} to
 * @return {Number}
 */
function Bearing(from, to) {
  var radiansPerDegree = Math.PI / 180.0; //角度转化为弧度(rad)
  var degreesPerRadian = 180.0 / Math.PI; //弧度转化为角度
  let fromPt = Cesium.Cartographic.fromCartesian(from);
  let toPt = Cesium.Cartographic.fromCartesian(to);

  var lon1 = Cesium.Math.toDegrees(fromPt.longitude) * radiansPerDegree;
  var lat1 = Cesium.Math.toDegrees(fromPt.latitude) * radiansPerDegree;
  var lon2 = Cesium.Math.toDegrees(toPt.longitude) * radiansPerDegree;
  var lat2 = Cesium.Math.toDegrees(toPt.latitude) * radiansPerDegree;

  var angle = -Math.atan2(
    Math.sin(lon1 - lon2) * Math.cos(lat2),
    Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2)
  );
  if (angle < 0) {
    angle += Math.PI * 2.0;
  }
  angle = angle * degreesPerRadian; //角度
  return angle;
}

/**
 * @description 计算基于水准面距离
 * @param {Cesium.Cartesian3} point1
 * @param {Cesium.Cartesian3} point2
 * @return {Number}
 */
function distance(point1, point2) {
  var point1cartographic = Cesium.Cartographic.fromCartesian(point1);
  var point2cartographic = Cesium.Cartographic.fromCartesian(point2);
  var geodesic = new Cesium.EllipsoidGeodesic();
  geodesic.setEndPoints(point1cartographic, point2cartographic);
  var s = geodesic.surfaceDistance;
  s = Math.sqrt(
    Math.pow(s, 2) +
      Math.pow(point2cartographic.height - point1cartographic.height, 2)
  );
  return s;
}

/**
 * @description
 * @param {Cesium.JulianDate} start 开始时间
 * @param {Number} interval 间隔
 * @param {Array<Cesium.Cartographic>} positions 位置
 * @return {Promise}
 */
export function computeCirclularFlight(start, interval = 10, positions = []) {
  return new Promise((resolve, reject) => {
    if (positions.length === 0) reject(undefined);
    try {
      var property = new Cesium.SampledPositionProperty();
      for (var i = 0; i < positions.length; i++) {
        var time = Cesium.JulianDate.addSeconds(
          start,
          i * interval,
          new Cesium.JulianDate()
        );
        var position = Cesium.Cartographic.toCartesian(positions[i]);
        property.addSample(time, position);
      }
      resolve(property);
    } catch (err) {
      console.error("计算路线失败：" + err);
      reject(undefined);
    }
  });
}
