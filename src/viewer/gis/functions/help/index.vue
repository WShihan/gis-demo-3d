<template>
  <DialogContainer title="关于" :top="2.1" :left="9.9" width="4rem">
    <div class="panel" v-loading="loading">
      <p class="content">
        {{ helpStr }}
      </p>
    </div>
  </DialogContainer>
</template>

<script>
import { apis } from "@/config/apis";
import axios from "axios";
export default {
  name: "help",
  props: {},
  data() {
    return {
      helpStr: "",
      loading: true,
    };
  },
  components: {},
  mounted() {
    axios
      .get(apis.about.url)
      .then((response) => {
        this.helpStr = response.data.content;
      })
      .catch(() => {
        this.helpStr = "这是一个webgis练手项目……";
      })
      .finally(() => {
        this.loading = false;
      });
  },
  unmounted() {},
  methods: {},
  watch: {},
  computed: {},
};
</script>

<style scoped lang="less">
.panel {
  width: 100%;
  height: 1.5625rem;
  padding: 0.1563rem;
  p.content {
    font-size: 0.1563rem;
  }
}
</style>
