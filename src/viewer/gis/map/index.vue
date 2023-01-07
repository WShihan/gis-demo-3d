<template>
  <div id="map"></div>
</template>

<script>
import { mapper } from "@/utils/core/mapHandler.js";
export default {
  name: "mapBox",
  props: {},
  data() {
    return {};
  },
  components: {},
  mounted() {
    mapper();
  },
  unmounted() {},
  methods: {},
  watch: {},
  computed: {},
};
</script>

<style scoped lang="less">
#map {
  width: 100%;
  height: 100%;
  cursor: pointer;
}
</style>
