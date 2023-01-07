<template>
  <DialogContainer title="书签" width="5rem" :top="4" :left="10">
    <div class="panel" v-if="editId === ''">
      <div class="buttons">
        <i title="保存当前场景" class="icon iconfont icon-xinjian" @click="createMK"></i>
        <!-- <i title="本地导入" class="icon iconfont icon-daoru"></i> -->
        <i title="删除所选" class="icon iconfont icon-shanchu" @click="clearAllMK"></i>
      </div>
      <div class="tree">
        <el-tree :data="mks" :props="prop" show-checkbox accordion @check-change="checkChange">
          <template #default="{ node, data }">
            <span
              class="custom-tree-node"
              @mouseenter="() => (viewId = data._id)"
              @mouseleave="() => (viewId = '')"
              @dblclick="restoreMK(data._id)"
            >
              <span class="name">{{ node.label }}</span>
              <!-- <input class="name" type="text" :value="node.label" /> -->
              <span class="node-icon" v-show="viewId === data._id">
                <i
                  title="重命名"
                  class="icon iconfont icon-zhongmingming"
                  @click="() => (editId = data._id)"
                ></i>
                <i title="定位" class="icon iconfont icon-weizhi" @click="restoreMK(data._id)"></i>
                <i title="删除" class="icon iconfont icon-shanchu" @click="deleteMK(data._id)"></i>
              </span>
            </span> </template
        ></el-tree>
      </div>
    </div>
    <Rename v-else :name="editText" @confirmEvt="setName" @cancelEvt="() => (editId = '')"></Rename>
  </DialogContainer>
</template>

<script>
import bookmark from "./bookmark";
export default {
  name: "bookmark",
  props: {},
  components: {},
  data() {
    return {
      prop: {
        label: "_name",
        children: "children",
      },
    };
  },
  setup() {
    let {
      mks,
      iconShow,
      viewId,
      editId,
      editText,
      createMK,
      deleteMK,
      setNodeIconVisible,
      restoreMK,
      downloadMK,
      clearAllMK,
      setName,
      checkChange,
    } = bookmark();
    return {
      mks,
      iconShow,
      viewId,
      editId,
      editText,
      createMK,
      deleteMK,
      setNodeIconVisible,
      restoreMK,
      downloadMK,
      clearAllMK,
      setName,
      checkChange,
    };
  },
};
</script>

<style scoped lang="less">
* {
  padding: 0rem;
  margin: 0rem;
}
// flex定位
.panel,
.buttons,
i {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.panel :deep {
  width: 100%;
  margin-bottom: 0.125rem;
  div.tree {
    width: 100%;
    .el-tree {
      background-color: rgb(25, 25, 29);

      .el-tree-node__children .el-tree-node :hover,
      .el-tree-node__content {
        .custom-tree-node {
          width: 80%;
          height: 0.375rem;
          margin: 5px auto;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          text-align: center;
          color: rgb(187, 184, 184);
          font-size: 0.25rem;
        }
        &:hover {
          background-color: gray;
        }

        .name {
          width: 2.25rem;
          font-size: 15px;
          text-align: left;
          overflow: hidden;
        }
        .node-icon {
          margin-left: 0.25rem;
          display: flex;
          flex-direction: row;
          justify-content: right;
          align-items: center;

          i {
            width: 0.3rem;
            height: 0.3rem;
            font-size: 0.2rem;
            margin: 0.05rem;
            &:hover {
              background-color: rgb(60, 57, 57);
            }
          }
        }
      }
    }
  }
  .buttons {
    width: 100%;
    justify-content: right;
    i {
      font-size: 0.3rem;
      margin: 0.05rem 0.125rem;
      cursor: pointer;
      &:hover {
        background-color: rgb(177, 171, 171);
      }
    }
  }
}
</style>
