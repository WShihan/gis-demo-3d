<template>
  <DialogContainer title="加载本地数据" width="5rem" :top="1" :left="10">
    <div class="file-open-panel">
      <el-upload
        class="upload-demo"
        drag
        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
        multiple
        :auto-upload="false"
        v-model:file-list="files"
      >
        <div class="el-upload__text">拖动文件或 <em>点击选择</em></div>
        <template #tip>
          <div class="el-upload__tip">目前仅支持加载本地geojson格式。</div>
        </template>
      </el-upload>
      <div class="buttons">
        <el-button type="primary" @click="addData">添加</el-button>
        <el-button type="primary" @click="removeData">移除</el-button>
      </div>
    </div>
  </DialogContainer>
</template>

<script>
import fileOpen from "./fileOpen.js";
export default {
  name: "FileOpener",
  props: {},
  components: {},
  data() {
    return {};
  },
  setup() {
    return fileOpen();
  },
};
</script>

<style scoped lang="less">
.file-open-panel {
  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin: 10px auto 5px;
  }
}
</style>
