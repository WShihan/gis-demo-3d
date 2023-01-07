<template>
  <div id="dialog-container" class="dialog-container" :style="calcStyle">
    <div
      class="header"
      draggable="true"
      @drag.self="drag"
      @dragstart="dragStart"
      @dragend="dragEnd"
      :style="showClose == false ? 'cursor:move' : ''"
    >
      <header v-if="title">{{ title }}</header>
      <div v-if="showClose" class="icon close">
        <i
          :title="[collapsed ? '展开' : '折叠']"
          class="icon iconfont icon-zhedie"
          :class="[collapsed ? 'collapse' : '']"
          style="cursor: pointer"
          @click="collapsedChange"
        ></i>
        <i title="移动" class="icon iconfont icon-move" style="cursor: move"></i>
        <i title="关闭" class="icon iconfont icon-guanbi" @click="this.$emit('close')"></i>
      </div>
    </div>
    <div class="content" draggable="false" v-show="!collapsed">
      <transition>
        <slot></slot>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: "dialogContainer",
  props: {
    showClose: {
      type: Boolean,
      default: true,
    },
    width: {
      type: [String, Number],
      default: "auto",
    },
    height: {
      type: [String, Number],
      default: "auto",
    },
    top: {
      type: [String, Number],
      default: "0.37rem",
    },
    left: {
      type: [String, Number],
      default: "15rem",
    },
    title: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      position: {
        top: parseFloat(this.top),
        left: parseFloat(this.left),
      },
      clientX: 0,
      clientY: 0,
      offset: {
        x: 0,
        y: 0,
      },
      collapsed: false,
    };
  },
  components: {},
  mounted() {},
  unmounted() {},
  methods: {
    dragStart(evt) {
      this.offset.x = evt.offsetX;
      this.offset.y = evt.offsetY;
      evt.dataTransfer.setDragImage(document.createElement("div"), 0, 0);
    },
    drag(evt) {
      if (evt.clientX === 0 || evt.clientY === 0) {
        return;
      }
      this.clientX = evt.clientX - this.offset.x;
      this.clientY = evt.clientY - this.offset.y;
    },
    dragEnd(evt) {},
    collapsedChange() {
      this.collapsed = this.collapsed === true ? false : true;
    },
  },
  watch: {
    clientX(newX, oldX) {
      if (newX && oldX) {
        const movementX = newX - oldX;
        const newLeft = this.position.left + movementX / 63.9;
        newLeft > 0 && (this.position.left = newLeft);
      }
    },
    clientY(newY, oldY) {
      if (newY && oldY) {
        const movementY = newY - oldY;
        const newTop = this.position.top + movementY / 63.9;
        newTop > 0 && (this.position.top = newTop);
      }
    },
  },
  computed: {
    calcStyle() {
      return {
        width: this.width,
        height: this.height,
        position: "fixed",
        top: this.position.top + "rem",
        left: this.position.left + "rem",
        color: "gray",
      };
    },
  },
};
</script>
<style lang="less">
div.content,
div.icon {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
#dialog-container {
  border-radius: 0.0926rem;
  background-color: rgb(25, 25, 29);
  box-shadow: 0.0926rem 0.0556rem 0.1852rem 0.0185rem rgb(41, 38, 38);
  header {
    color: #fff;
    font-size: 0.2rem;
    font-weight: bold;
    background-color: rgb(25, 25, 29);
    position: relative;
    padding-top: 0.0625rem;
    border-radius: 0.0926rem;
  }
  div.content {
    width: inherit;
    text-align: left;
  }
  div.icon {
    position: absolute;
    right: 0.0852rem;
    top: 0px;
    cursor: pointer;
    i {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      width: 0.358rem;
      height: 0.358rem;
      font-size: 0.25rem;
      margin-left: 0.185rem;
      text-align: center;
      transform: rotate(0deg);
      transition: transform 0.5s;
      &:active {
        font-weight: bold;
        background-color: rgb(84, 84, 88);
      }
    }
    i.collapse {
      transform: rotate(-90deg);
      transition: transform 0.5s;
    }
  }
}
</style>
