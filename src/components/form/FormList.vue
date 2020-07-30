<template>
  <div id="FormList" class="FormList-wrap">
    <el-scrollbar>
      <el-form
        :model="datas"
        :rules="rules"
        :label-width="formConfig.labelWidth || '100px'"
        :disabled="disabled"
        :ref="refName"
        id="formListWrap"
        :label-position="formConfig.labelPosition || 'right'"
      >
        <div class="form-item" v-for="(rowData, $index) in formConfig.config" :key="$index">
          <el-row v-for="(row, rowIndex) in rowData.props" :key="rowIndex">
            <el-col v-for="(col, colIndex) in row" :key="colIndex" :span="col.span || 6">
              <el-form-item :label="col.label" :prop="col.prop" v-if="!col.hidden">
                <!-- text 文本框 -->
                <el-input
                  v-if="col.type === 'text'"
                  v-model.trim="datas[col.prop]"
                  :maxlength="col.maxlength"
                  :placeholder="col.placeholder"
                  :disabled="col.disabled"
                  :style="{width: col.width + 'px' || '100%'}"
                ></el-input>

                <!-- unit 带单位文本框 -->
                <el-input
                  v-if="col.type == 'unit'"
                  :type="col.inputType || 'number'"
                  v-model.number="datas[col.prop]"
                  :maxlength="col.maxlength"
                  :placeholder="col.placeholder"
                  :disabled="col.disabled"
                  @keyup.native="$limitFloat(datas,col.prop)"
                  clearable
                >
                  <i slot="suffix">{{col.unit}}</i>
                </el-input>

                <!-- password 密码 -->
                <el-input
                  v-if="col.type === 'password'"
                  type="password"
                  v-model.trim="datas[col.prop]"
                  :maxlength="col.maxlength"
                  :placeholder="col.placeholder"
                  :disabled="col.disabled"
                ></el-input>

                <!-- 数字校验-->
                <el-input
                  v-if="col.type === 'number'"
                  type="text"
                  v-model="datas[col.prop]"
                  :maxlength="col.maxlength"
                  :placeholder="col.placeholder"
                  :disabled="col.disabled"
                  @keyup.native="$limitInt(datas,col.prop)"
                ></el-input>

                <!-- select 下拉框 -->
                <el-select
                  v-if="col.type === 'select'"
                  v-model="datas[col.prop]"
                  :disabled="col.disabled"
                  :placeholder="col.placeholder"
                  clearable
                  @change="HandleChange(col.callback)"
                  filterable
                >
                  <el-option
                    v-for="option in col.options"
                    :label="option.label"
                    :value="option.value"
                    :key="option.value"
                  ></el-option>
                </el-select>

                <!-- date 日期选择 -->
                <el-date-picker
                  v-if="col.type === 'date'"
                  v-model="datas[col.prop]"
                  value-format="yyyy-MM-dd"
                  type="date"
                  :placeholder="col.placeholder"
                  :disabled="col.disabled"
                  :style="{width: col.width + 'px' || '100%'}"
                ></el-date-picker>

                <!-- date 年度选择 -->
                <el-date-picker
                  v-if="col.type === 'year'"
                  v-model="datas[col.prop]"
                  value-format="yyyy"
                  type="year"
                  :placeholder="col.placeholder"
                  :disabled="col.disabled"
                ></el-date-picker>

                <!-- date 日期选择 -->
                <el-date-picker
                  v-if="col.type === 'dateTime'"
                  v-model="datas[col.prop]"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="date"
                  :placeholder="col.placeholder"
                  :disabled="col.disabled"
                ></el-date-picker>

                <!-- datetime 日期时间选择 -->
                <el-date-picker
                  v-if="col.type === 'datetime'"
                  v-model="datas[col.prop]"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  :placeholder="col.placeholder"
                  :disabled="col.disabled"
                ></el-date-picker>

                <!-- radio 单选框 -->
                <el-radio-group
                  v-if="col.type === 'radio'"
                  v-model="datas[col.prop]"
                  :disabled="col.disabled"
                >
                  <el-radio
                    :label="option.value"
                    v-for="option in col.options"
                    :key="option.value"
                  >{{option.label}}</el-radio>
                </el-radio-group>

                <!-- checkbox 单选框 -->
                <el-checkbox-group
                  v-if="col.type === 'checkbox'"
                  v-model="datas[col.prop]"
                  :disabled="col.disabled"
                >
                  <el-checkbox
                    :label="option.value"
                    v-for="option in col.options"
                    :key="option.value"
                  >{{option.label}}</el-checkbox>
                </el-checkbox-group>

                <!-- textarea 文本域 -->
                <el-input
                  v-if="col.type === 'textarea'"
                  v-model.trim="datas[col.prop]"
                  type="textarea"
                  :placeholder="col.placeholder"
                  :maxlength="col.maxlength"
                  :disabled="col.disabled"
                  show-word-limit
                ></el-input>

                <!-- range 区间 -->
                <div class="form-item-range" v-if="col.type === 'range'">
                  <el-input v-model="datas[col.prop][0]"></el-input>
                  <span class="split-tit">{{col.split || '至'}}</span>
                  <el-input v-model="datas[col.prop][1]"></el-input>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-form-item
          class="picture"
          :label-width="formConfig.labelWidth || '100px'"
          :label="formConfig.picture.pictureLabel || '图片上传'"
          prop="pictureUploadFile"
          v-if="formConfig.picture"
        >
          <!--
          formConfig.labelWidth:form-lable的宽度
          formConfig.picture.pictureLabel:form-lable
          pictureUploadFile:用于校验图片上传
          formConfig.pictur:判断图片上传是否显示
          formConfig.picture.pictureUploadDisabled：可以给upload加类名，控制只能上传一张
          formConfig.postHeaders：可以在上传是触发接口添加请求头
          formConfig.picture.uploadImgUrl：上传的接口地址
          formConfig.picture.imgFileList：文件的集合
          handleRemove：图片移除的方法
          handleSuccess：图片上传成功的方法
          handleChange：图片选择的方法
          handleError：图片上传失败的方法
          handleExceed：图片上传超出限制数量的方法
          beforeUpload：图片触发上传接口之前的方法，一般做文件大小验证
          formConfig.picture.acceptImgType：图片上传能接受的文件格式
          formConfig.picture.limitImgNum：限制文件上传的数量
          formConfig.picture.multiple：图片是否可以多选上传
          -->
          <div class="upload_box" v-if="formConfig.picture.show">
            <el-upload
              ref="imgUpload"
              :class="{disabled:formConfig.picture.pictureUploadDisabled}"
              :headers="postHeaders"
              :action="formConfig.picture.uploadImgUrl"
              list-type="picture-card"
              :file-list="formConfig.picture.imgFileList"
              :on-remove="handleRemove"
              :auto-upload="false"
              :on-success="handleSuccess"
              :on-change="handleChange"
              :on-error="handleError"
              :accept="formConfig.picture.acceptImgType"
              :limit="formConfig.picture.limitImgNum"
              :on-exceed="handleExceed"
              :before-upload="beforeUpload"
              :multiple="formConfig.picture.multiple"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
          <div class="img-preview-box clearfix" v-else>
            <div
              class="img-preview-item"
              v-for="(item, index) in formConfig.picture.detailImgList"
              :key="index"
            >
              <img :src="item.url" />
              <div class="bigger-view-warpper">
                <i class="el-icon-search" @click="preview(item)"></i>
              </div>
            </div>
          </div>
        </el-form-item>
        <slot name="qrcodes"></slot>
        <el-form-item
          class="cert"
          :label-width="formConfig.labelWidth || '100px'"
          :label="formConfig.cert.certLabel || '附件上传'"
          prop="certUploadFile"
          v-if="formConfig.cert"
        >
          <div class="certUpload_box" v-if="formConfig.cert.show">
            <el-upload
              ref="certUpload"
              :headers="postHeaders"
              :action="formConfig.cert.uploadCertUrl"
              :file-list="formConfig.cert.certFileList"
              :auto-upload="false"
              :accept="formConfig.cert.acceptCertType"
              :on-success="handleCertSuccess"
              :on-change="handleCertChange"
              :on-error="handleCertError"
              :on-remove="handleCertRemove"
              :before-upload="beforeUpload"
              :on-preview="handleCertPreview"
              multiple
            >
              <el-button type="primary" plain class="com-btn">上传附件</el-button>
            </el-upload>
          </div>
          <el-button type="primary" plain class="com-btn" v-if="!formConfig.cert.show">下载</el-button>
          <ul v-if="!formConfig.cert.show">
            <li v-for="(item,index) in formConfig.cert.detailCertList" :key="index">
              <el-checkbox @change="checkboxChange($event, item)"></el-checkbox>
              {{item.fileName}}
            </li>
          </ul>
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <div class="img-preview-bigger">
      <div class="img-preview-bigger-mask"></div>
      <img src alt id="biggerImg" />
      <i class="el-icon-circle-close" @click="closePreview"></i>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    datas: Object,
    formConfig: Object,
    disabled: Boolean,
    rules: Object,
    refName: {
      type: String,
      default: 'formList'
    }
  },
  data() {
    return {
      imgPreviewBigger: null,
      biggerImg: null,
      postHeaders: {
        Authorization: `Bearer ${sessionStorage.getItem('TOKEN')}`
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    change(callback) {
      this.$emit('Change', callback)
    },
    // 图片上传成功
    handleSuccess(response, file, fileList) {
      this.$emit('handle-success', response, file, fileList)
    },
    // 文件上传成功
    handleCertSuccess(response, file, fileList) {
      this.$emit('handle-cert-success', response, file, fileList)
    },
    // 图片上传触发
    handleChange(file, fileList) {
      this.$emit('handle-change', file, fileList)
    },
    // 文件上传触发
    handleCertChange(file, fileList) {
      this.$emit('handle-cert-change', file, fileList)
    },
    // 图片上传移除
    handleRemove(file, fileList) {
      this.$emit('handle-remove', file, fileList)
    },
    // 文件上传移除
    handleCertRemove(file, fileList) {
      this.$emit('handle-cert-remove', file, fileList)
    },
    // 图片上传错误
    handleError(err, file, fileList) {
      this.$emit('handle-error', err, file, fileList)
    },
    // 文件上传错误
    handleCertError(err, file, fileList) {
      this.$emit('handle-cert-error', err, file, fileList)
    },
    // 图片上传超过限制
    handleExceed(file, fileList) {
      this.$emit('handle-exceed', file, fileList)
      // this.$message.info(`最多只能上传一张图片！`);
    },
    // 文件预览
    handleCertPreview(file) {
      this.$emit('handle-cert-preview', file)
    },
    // 文件上传之前做文件大小校验
    beforeUpload(file) {
      this.$emit('before-upload', file)
    },
    validFormList(callback) {
      this.$refs.formList.validate(valid => {
        if (valid) {
          callback && callback(valid)
        } else {
          return false
        }
      })
    },
    submit() {
      this.formConfig.picture && this.$refs.imgUpload.submit()
      this.formConfig.cert && this.$refs.certUpload.submit()
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
    },
    checkboxChange(event, item) {
      this.$emit('checkbox-change', event, item)
    },
    clearValidate() {
      this.$refs[this.refName].clearValidate()
    },
    limitInt(target) {
      debugger
      target[name] = target[name].replace(/[^0-9]/g, '')
    },
    HandleChange(callback) {
      this.$emit('Handle-change', callback)
    }
  },
  computed: {
    propRules() {
      const data = this.validFunc(this.formConfig.config)
      return data
    }
  },
  watch: {}
}
</script>
<style lang="less">
@import '../../assets/css/variable.less';
.FormList-wrap {
  width: 100%;
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner,
  .el-select {
    width: 100%;
  }
  .form-item-range {
    width: 100%;
    display: flex;
    .split-tit {
      min-width: 30px;
      text-align: center;
    }
  }
  .el-form-item__label::before {
    display: inline-block;
    position: relative;
    top: 0;
    transform: none;
  }
}
</style>
