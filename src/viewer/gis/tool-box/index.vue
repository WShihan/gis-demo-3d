<template>
  <DialogContainer :top="0.18" :left="1.23" :show-close="false">
    <div class="panel" @mouseenter="enter" @mouseleave="leave">
      <div class="box" :style="styleObj">
        <div :class="['box-switch', , expand ? 'active' : '']" title="工具箱" @click="fixBox">
          <i class="icon iconfont icon-model" :class="[fixed ? 'active' : '']"></i>
        </div>
        <div class="box-body" v-if="expand">
          <div
            v-for="(tool, key) in tools"
            :title="tool.title"
            :key="key"
            class="tool-icon"
            @click="this.$emit('choose', tool.name)"
          >
            <i
              class="icon iconfont"
              :class="[tool.icon, tool.name === selected ? 'active' : '']"
            ></i>
          </div>
        </div>
      </div>
    </div>
  </DialogContainer>
</template>

<script>
import { PopTip } from "@/utils/tool";

export default {
  name: "ToolBox",
  emits: ["choose"],
  props: {
    // 当前选中工具
    selected: {
      type: String,
      default: "",
    },
    // 所有工具集合
    tools: {
      type: Array,
      default: [
        {
          name: "measure",
          title: "量测",
          icon: "icon-celiang",
        },
        {
          name: "profile",
          title: "剖面线分析",
          icon: "icon-profile",
        },
        {
          name: "flood",
          title: "淹没分析",
          icon: "icon-flood",
        },
        {
          name: "sightLine",
          title: "通视分析",
          icon: "icon-sight-line",
        },
      ],
    },
  },
  data() {
    return {
      size: {
        width: 30,
        height: 30,
      },
      // 是否展开
      expand: false,
      fixed: false,
    };
  },
  components: {},
  mounted() {},
  unmounted() {},
  methods: {
    enter() {
      if (this.fixed) return;
      setTimeout(() => {
        this.size.width = this.tools.length * 55;
        this.expand = true;
      }, 0);
    },
    leave() {
      if (this.fixed) return;
      setTimeout(() => {
        this.size.width = 30;
        this.expand = false;
      }, 1000);
    },
    fixBox() {
      if (this.fixed) {
        this.fixed = false;
        PopTip.success("取消固定！");
      } else {
        this.fixed = true;
        this.expand = true;
        PopTip.success("固定工具箱，再次点击取消固定！");
      }
    },
  },
  watch: {},
  computed: {
    styleObj() {
      return {
        width: this.size.width / 64 + "rem",
        height: this.size.height / 64 + "rem",
      };
    },
  },
};
</script>

<style scoped lang="less">
.panel {
  .box {
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: center;
    cursor: pointer;
    overflow: hidden;
    transition: width 0.5s;
    .box-switch {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding: 0.025rem;
      i {
        color: #fff;
        font-size: 0.375rem;
        &.active {
          color: rgb(60, 131, 223);
        }
      }
      &.active {
        transform: rotate(-90deg);
        transition: transform 0.5s;
      }
    }

    .box-body {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin: 0rem 0.125rem;
      .tool-icon {
        width: 45px;
        height: 30px;
        display: flex;
        color: #fff;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        &:hover {
          background-color: rgb(91, 91, 94);
        }
      }
      margin: 0rem 0.0625rem;
      border-left: 0.5px solid white;
      i {
        color: #fff;
        &.active {
          color: rgb(60, 131, 223);
        }
      }
    }
  }
}
</style>
