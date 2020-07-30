<template>
  <div>
    <div class="upload_box" v-if="show">
      <el-upload
        ref="imgUpload"
        :headers="headers"
        :action="action"
        list-type="picture-card"
        :file-list="fileList"
        :on-remove="handleRemove"
        :auto-upload="false"
        :on-success="handleSuccess"
        :on-change="handleChange"
        :on-error="handleError"
        :accept="accept"
        :limit="limit"
        :on-exceed="handleExceed"
        :before-upload="beforeUpload"
        :multiple="multiple"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
    </div>
    <div class="img-preview-box clearfix" v-else>
      <div
        class="img-preview-item"
        v-for="(item, index) in detailImgList"
        :key="index"
      >
        <img :src="item.url" />
        <div class="bigger-view-warpper">
          <i class="el-icon-search" @click="preview(item)"></i>
        </div>
      </div>
    </div>
    <div class="img-preview-bigger">
      <div class="img-preview-bigger-mask"></div>
      <img src alt id="biggerImg" />
      <i class="el-icon-circle-close" @click="closePreview"></i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: Boolean,
    pictureUploadDisabled: Boolean,
    headers: Object,
    action: String,
    fileList: Array,
    accept: String,
    limit: Number,
    multiple: Boolean,
    detailImgList: Array
  },
  components: {},
  data() {
    return {
      imgPreviewBigger: null,
      biggerImg: null
    }
  },
  created() {},
  mounted() {},
  methods: {
    // 图片上传成功
    handleSuccess(response, file, fileList) {
      this.$emit('handle-success', response, file, fileList)
    },
    // 图片上传触发
    handleChange(file, fileList) {
      this.$emit('handle-change', file, fileList)
    },
    // 图片上传移除
    handleRemove(file, fileList) {
      this.$emit('handle-remove', file, fileList)
    },
    // 图片上传错误
    handleError(err, file, fileList) {
      this.$emit('handle-error', err, file, fileList)
    },
    // 图片上传超过限制
    handleExceed(file, fileList) {
      this.$emit('handle-exceed', file, fileList)
      // this.$message.info(`最多只能上传一张图片！`);
    },
    // 文件上传之前做文件大小校验
    beforeUpload(file) {
      this.$emit('before-upload', file)
    },
    preview(path) {
      this.imgPreviewBigger = document.getElementsByClassName(
        'img-preview-bigger'
      )[0]
      this.imgPreviewBigger.style.display = 'block'
      this.biggerImg = document.getElementById('biggerImg')
      let url = ''
      if (path.type === 3) {
        url = '/images/compress.png'
      } else {
        url = path.url
      }
      this.biggerImg.src = url
    },
    closePreview() {
      this.imgPreviewBigger.style.display = 'none'
      this.biggerImg.style.width = 'auto'
    }
  }
}
</script>

<style>
</style>
