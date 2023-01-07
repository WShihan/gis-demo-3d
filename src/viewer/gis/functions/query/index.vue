<template>
  <DialogContainer title="查询" width="6rem" left="10rem">
    <div class="query-panel">
      <el-form label-width="fit-content" size="small">
        <el-form-item label="图层">
          <el-select v-model="targetLayer" @change="propertyNameDescription">
            <el-option
              v-for="(item, key) in layer"
              :key="key"
              :label="item.zhName"
              :value="item.workSpace + ':' + item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="条件">
          <el-input v-model="whereClause" class="textarea" type="textarea"> </el-input>
        </el-form-item>
      </el-form>
      <div class="query-result" v-if="propNames.length != 0">
        <el-table :data="tableData" size="small" fit="false" max-height="300px">
          <el-table-column
            v-for="(item, key) in propNames"
            :key="key"
            :prop="item"
            :label="item"
            width="80"
          />
        </el-table>
      </div>
      <div class="buttons">
        <el-button type="primary" @click="add">添加</el-button>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="danger" @click="clear">清除</el-button>
      </div>
    </div>
  </DialogContainer>
</template>

<script>
import axios from "axios";
import { layerTree } from "@/config/layerConfig.js";
export default {
  name: "QueryByProperty",
  props: {
    layer: {
      type: Array,
      default: layerTree[0].subLayers,
    },
  },
  data() {
    return {
      targetLayer: "",
      tableData: [],
      propNames: [],
      geojsonObj: undefined,
      whereClause: "",
    };
  },
  components: {},
  mounted() {},
  unmounted() {},
  methods: {
    propertyNameDescription(lyrName) {
      let xmlhttp = new XMLHttpRequest();
      xmlhttp.open(
        "GET",
        `http://www.xiemolin233.cn:8081/geoserver/wfs?service=wfs&version=2.0.0&request=DescribeFeatureType&typeNames=${lyrName}`,
        false
      );
      xmlhttp.send();
      const xmlDoc = xmlhttp.responseXML;
      var propSequence = xmlDoc
        .getElementsByTagName("xsd:sequence")[0]
        .getElementsByTagName("xsd:element");
      this.propNames.length = 0;
      for (let i = 0; i < propSequence.length; i++) {
        this.propNames.push(propSequence[i].getAttribute("name"));
        console.log(propSequence[i].getAttribute("name"));
      }
    },
    search() {
      axios
        .get("http://www.xiemolin233.cn:8081/geoserver/wfs", {
          params: {
            service: "wfs",
            version: "2.0.0",
            request: "GetFeature",
            typeName: this.targetLayer,
            outputFormat: "JSON",
            count: 5,
            // cql_filter: this.whereClause,
          },
        })
        .then((response) => {
          if (response.data) {
            this.geojsonObj = response.data;
            response.data.features.forEach((feature) => {
              this.tableData.push(feature.properties);
            });
          }
        });
    },
    add() {
      if (!this.geojsonObj) return;
      Cesium.GeoJsonDataSource.load(this.geojsonObj, {
        stroke: Cesium.Color.RED,
        fill: Cesium.Color.BLUE,
        clampToGround: true,
      }).then((dataSource) => {
        window.viewer.dataSources.add(dataSource);
      });
    },
    clear() {
      this.tableData.length = 0;
      // this.propNames.length = 0;
    },
  },
  watch: {},
  computed: {},
};
</script>

<style scoped lang="less">
.query-panel {
  width: 100%;
  height: 100%;
  padding: 0.0926rem;
  :deep(.el-select) {
    width: 95%;
  }
  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    .el-button {
      width: 20%;
      margin: 1% 5%;
    }
  }
  :deep(.el-textarea) {
    width: 95%;
    color: black;
    height: 1.1111rem;
  }
  .query-result {
    width: 100%;
    .el-table {
      width: 100%;
      font-size: 0.1852rem;
    }
  }
}
</style>
