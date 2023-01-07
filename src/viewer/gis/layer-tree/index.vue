<template>
  <DialogContainer
    :title="title"
    top="0.38rem"
    left="21.7rem"
    :show-close="false"
  >
    <div class="panel">
      <el-tree
        ref="tree"
        :props="props"
        :data="layers"
        node-key="id"
        :default-checked-keys="defaultLayers"
        show-checkbox
        @check-change="handleCheckChange"
      />
    </div>
  </DialogContainer>
</template>

<script>
import { LayerEum } from "@/utils/core/layer/layerEum.js";

export default {
  name: "LayerTree",
  emits: ["addLayerEvt", "removeLayerEvt"],
  props: {
    title: {
      type: String,
      default: "图层资源",
    },
    // 默认打开的图层[id,id]
    defaultLayers: {
      type: Array,
      default: [],
    },
    layers: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      props: {
        label: "zhName",
        children: "subLayers",
      },
    };
  },
  mounted() {
    if (this.defaultLayers.length != 0) {
      const initLyrs = this.$refs.tree.getCheckedNodes(true, false);
      initLyrs.forEach((lyrOpt) => {
        this.$emit("addLayerEvt", lyrOpt);
      });
    }
  },
  unmounted() {},
  methods: {
    handleCheckChange(layer, checked, indeterminate) {
      /* 共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、
            节点本身是否被选中、节点的子树中是否有被选中的节点 */
      if (layer.type != LayerEum.LAYER_FOLDER) {
        if (checked) {
          this.$emit("addLayerEvt", layer);
        } else {
          this.$emit("removeLayerEvt", layer);
        }
      }
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
* :deep {
  padding: 0px;
  margin: 0px;
}
.panel:deep {
  min-width: 8%;
  height: 3.5%;
  padding: 0.0926rem 0.1852rem;
  border-radius: 0.0556rem;
  overflow: hidden;
  background-color: rgb(25, 25, 29);
  &:hover {
    height: auto;
  }
  .el-tree {
    background-color: rgb(25, 25, 29);
    .el-tree-node__children .el-tree-node :hover,
    .el-tree-node__content:hover {
      background-color: gray;
    }
  }
}
</style>
