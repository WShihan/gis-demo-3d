<template>
  <DialogContainer left="10.4rem" top="3.4rem" title="特效" width="5rem">
    <div class="effect-panel">
      <div class="weathers-types">
        <el-button
          v-for="(item, key) in weather"
          :class="{ 'select-btn': true, active: item.open }"
          :title="item.title"
          @click="switchWeather(item.name)"
        >
          <img :src="item.icon" alt="" />
        </el-button>
      </div>
      <component v-if="activeWeather != ''" :is="activeWeather"></component>
    </div>
  </DialogContainer>
</template>

<script>
import Rainy from "./weather/rainy.vue";
import Snowy from "./weather/snowy.vue";
import Foggy from "./weather/foggy.vue";
export default {
  name: "weather-effect",
  props: {},
  data() {
    return {
      // 天气类型集合
      weather: [
        {
          name: "rainy",
          title: "雨天",
          open: false,
          icon: "https://md-1301600412.cos.ap-nanjing.myqcloud.com/icons/rainy.svg",
        },
        {
          name: "snowy",
          title: "雪天",
          open: false,
          icon: "https://md-1301600412.cos.ap-nanjing.myqcloud.com/icons/snowy.svg",
        },
        {
          name: "foggy",
          title: "雾天",
          open: false,
          icon: "https://md-1301600412.cos.ap-nanjing.myqcloud.com/icons/foggy.svg",
        },
      ],
    };
  },
  components: { Rainy, Snowy, Foggy },
  mounted() {},
  beforeUnmount() {},
  unmounted() {},
  methods: {
    switchWeather(name) {
      this.weather.forEach((item) => {
        if (item.name === name) {
          if (item.open) item.open = false;
          else item.open = true;
        } else item.open = false;
      });
    },
  },
  watch: {},
  computed: {
    activeWeather() {
      let curWeather = this.weather.find((item) => item.open === true);
      if (curWeather) return curWeather.name;
      else return "";
    },
  },
};
</script>

<style scoped lang="less">
.effect-panel {
  width: 100%;
  padding: 0.1852rem;
  .weathers-types {
    display: flex;
    flex-direction: row;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin: 0.0926rem 0px 0.0926rem;
    :deep(.el-button) {
      background-color: transparent;
      width: 32px;
      height: 32px;
      margin: 0px 20px;
      img {
        width: 30px;
        height: 30px;
      }
      &.active {
        border: 1px solid rgb(36, 146, 209);
      }
    }
  }
}
</style>
