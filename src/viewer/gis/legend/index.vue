<template>
  <DialogContainer
    v-if="legendOption.workspace != ''"
    title="图例"
    left="0.922rem"
    top="9.46rem"
    :show-close="false"
  >
    <div class="panel">
      <div class="legend-body">
        <img
          :src="
            this.legendOption.baseUrl +
            '' +
            this.legendOption.workSpace +
            ':' +
            this.legendOption.layer
          "
          alt=""
        />
      </div>
    </div>
  </DialogContainer>
</template>

<script>
import emitter from "@/utils/eventBus";
export default {
  name: "Legend",
  props: {
    workspace: {
      type: String,
      default: () => {
        return "Yunnan";
      },
    },
    layer: {
      type: String,
      default: () => {
        return "parks";
      },
    },
    width: {
      type: Number,
      default: 20,
    },
    height: {
      type: String,
    },
  },
  data() {
    return {
      legendOption: {
        baseUrl:
          "http://www.xiemolin233.cn:8081/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=",
        workSpace: "Yunnan",
        layer: "",
      },
    };
  },
  components: {},
  mounted() {
    emitter.on("add-layer-evt", this.addLayerHandler);
  },
  methods: {
    addLayerHandler(signal) {
      this.legendOption.workSpace = signal.workSpace;
      this.legendOption.layer = signal.name;
    },
  },
  watch: {
    legendUrl: {
      deep: true,
      handler() {},
    },
  },
  computed: {},
};
</script>

<style scoped lang="less">
* {
  padding: 0px;
  margin: 0px;
}
.panel {
  h5 {
    color: #fff;
  }
  .legend-body {
    width: 100%;
    height: 100%;
    img {
      width: 100%;
    }
  }
}
</style>
