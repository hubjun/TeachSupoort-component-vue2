<template>
  <div id="purchaseManageDetail" ref="purchaseManageDetail" class="com-detail-wrap">
    <div class="detail-item">
      <div class="detail-head">
        <div class="tit">基本信息</div>
        <div class="btns">
          <el-button
            v-show="operate !== 'detail'"
            class="com-btn"
            type="info"
            @click="cancel"
            plain
          >返回</el-button>
          <el-button
            v-show="operate !== 'detail'"
            class="com-btn"
            type="primary"
            @click="save"
            plain
          >保存</el-button>
        </div>
      </div>
      <div class="detail-content">
        <form-list
          :disabled="disabled"
          :datas="formData"
          :rules="listRules"
          ref="formList"
          :form-config="formConfig"
          @handle-btn-click="handleBtnClick"
          @handle-success="handleSuccess"
          @handle-cert-success="handleCertSuccess"
          @handle-change="handleChange"
          @handle-cert-change="handleCertChange"
          @handle-remove="handleRemove"
          @handle-cert-remove="handleCertRemove"
          @handle-error="handleError"
          @handle-cert-error="handleCertError"
          @handle-exceed="handleExceed"
          @before-upload="beforeUpload"
          @checkbox-change="checkboxChange"
          @handle-cert-preview="handleCertPreview"
        ></form-list>
      </div>
    </div>
    <div class="detail-item">
      <div class="detail-head">
        <div class="tit">需求信息</div>
      </div>
      <div class="detail-content">
        <table-component :tableData="tableConfig.data" :tableHeight="tableConfig.height">
          <el-table-column
            v-for="(item,index) in tableConfig.config"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            align="center"
            :sortable="item.sortable"
            :show-overflow-tooltip="true"
          ></el-table-column>
        </table-component>
      </div>
    </div>
    <div class="detail-item">
      <div class="detail-head">
        <div class="tit">采购信息</div>
      </div>
      <div class="detail-content">
        <form-list
          :disabled="Disabled"
          :datas="FormData"
          :rules="rules"
          ref="FormList"
          :form-config="FormConfig"
        ></form-list>
      </div>
    </div>
  </div>
</template>

<script>
import FormList from '@/components/form/FormList'
import tableComponent from '@/components/table/table_2'
import { uploadUrl, uploadCert } from '@/axios/common'
import { BASE_URL, urlName1 } from '@/axios/Global'
import { dictMixin } from '../../../mixins/dictMixin'
export default {
  components: { FormList, tableComponent },
  mixins: [dictMixin],
  data() {
    return {
      operate: '',
      disabled: false,
      formData: {
        categoryCode: '',
        categoryName: '',
        publisher: '',
        publishDate: '',
        materialTypeName: '',
        author: '',
        bookNum: '',
        department: '教保处',
        id: ''
      },
      listRules: {},
      tableConfig: {
        data: [],
        height: 400,
        config: [
          {
            prop: 'schoolYear',
            label: '课程',
            sortable: false
          },
          {
            prop: 'courseCode',
            label: '班级',
            sortable: true
          },
          {
            prop: 'trainLevelName',
            label: '培养层次',
            sortable: false
          },
          {
            prop: 'className',
            label: '学年',
            sortable: false
          },
          {
            prop: 'classCount',
            label: '需求数量',
            sortable: false
          }
        ]
      },
      Disabled: false,
      FormData: {
        purchasePlanCode: '',
        purchaseDate: '',
        creator: '',
        chooseWayId: '',
        purchaseStatus: '',
        purchaseNum: '',
        referenceNum: '',
        requireNum: '',
        abnormalReason: ''
      },
      rules: {}
    }
  },
  computed: {
    formConfig() {
      return {
        labelWidth: '110px',
        deleteList: [], // 用于删除图片
        picture: {
          show: true,
          pictureLabel: '教材图片',
          pictureUploadDisabled: false,
          imgFileList: [],
          uploadImgUrl: `${uploadUrl}`,
          acceptImgType: '',
          detailImgList: [],
          multiple: false,
          uploadImgNum: 0,
          uploadedImgNum: 0,
          uploadSuccessImgNum: 0,
          uploadImg: false,
          submitImg: false,
          addImgList: []
        },
        cert: {
          show: true,
          certLabel: '上传附件',
          certFileList: [],
          uploadCertUrl: `${uploadCert}`,
          acceptCertType: '',
          detailCertList: [],
          multiple: false,
          uploadCertNum: 0,
          uploadedCertNum: 0,
          uploadSuccessCertNum: 0,
          uploadCert: false,
          submitCert: false,
          addCertList: []
        },
        config: [
          {
            label: ' 基本信息',
            props: [
              [
                {
                  label: '教材编码',
                  type: 'text',
                  prop: 'categoryCode',
                  disabled: true,
                  placeholder: '自动生成'
                },
                {
                  label: '教材名称',
                  type: 'text',
                  prop: 'categoryName',
                  placeholder: '请输入教材名称'
                },
                {
                  label: '出版社',
                  type: 'text',
                  prop: 'publisher',
                  placeholder: '请输入出版社'
                },
                {
                  label: '出版日期',
                  type: 'date',
                  prop: 'publishDate',
                  placeholder: '请输入出版日期'
                },
                {
                  label: '教材类型',
                  type: 'text',
                  prop: 'materialTypeName',
                  placeholder: '请输入教材类型'
                },
                {
                  label: '作者',
                  type: 'text',
                  prop: 'author',
                  placeholder: '请输入作者'
                },
                {
                  label: '书号',
                  type: 'text',
                  prop: 'bookNum',
                  placeholder: '请输入书号'
                }
              ]
            ]
          }
        ]
      }
    },
    FormConfig() {
      return {
        labelWidth: '110px',
        config: [
          {
            props: [
              [
                {
                  label: '采购单据编码',
                  type: 'text',
                  prop: 'purchasePlanCode',
                  disabled: true,
                  placeholder: '自动生成'
                },
                {
                  label: '采购日期',
                  type: 'date',
                  prop: 'purchaseDate',
                  placeholder: '请选择采购日期'
                },
                {
                  label: '制单人',
                  type: 'text',
                  prop: 'creator',
                  placeholder: '默认当前用户'
                },
                {
                  label: '选用方式',
                  type: 'select',
                  prop: 'chooseWayId',
                  placeholder: '',
                  options: this.mxSelectWay
                },
                {
                  label: '采购状态',
                  type: 'select',
                  prop: 'purchaseStatus',
                  placeholder: '请选择采购状态',
                  options: this.mxPurchaseStatus
                },
                {
                  label: '采购数量',
                  type: 'number',
                  prop: 'purchaseNum',
                  placeholder: '请输入采购数量'
                },
                {
                  label: '参考数量',
                  type: 'number',
                  prop: 'referenceNum',
                  placeholder: '请输入参考数量'
                },
                {
                  label: '库存数量',
                  type: 'number',
                  prop: 'requireNum',
                  placeholder: '请输入库存数量'
                },
                this.FormData.purchaseStatus === 2
                  ? {
                      label: '异常采购原因',
                      type: 'textarea',
                      span: 12,
                      prop: 'abnormalReason',
                      placeholder: '请输入异常采购原因'
                    }
                  : {}
              ]
            ]
          }
        ]
      }
    }
  },
  created() {
    this.baseList('JB02JCLX').then(res => {
      this.mxSelectWay = res
    })
    this.formData.receiptDate = this.$formatDate(new Date())
    this.operate = this.$route.query.type || ''
    this.formData.userName = sessionStorage.getItem('user') || ''
    this.operate !== 'add' && this.getDetail()
  },
  mounted() {},
  methods: {
    handleBtnClick(res) {
      this[res] && this[res]()
    },
    getDetail() {},
    cancel() {
      this.$router.go(-1)
    },
    save() {
      //   this.$refs.formList.validFormList(valid => {
      //     if (valid) {
      //       this.formConfig.picture.uploadImgNum !== 0 ||
      //       this.formConfig.cert.uploadCertNum !== 0
      //         ? this.submit()
      //         : this.saveForm()
      //     } else {
      //       return false
      //     }
      //   })
    },
    submit() {
      //   this.formConfig.picture.submitImg =
      //     this.formConfig.picture.uploadImgNum === 0
      //   this.formConfig.cert.submitCert = this.formConfig.cert.uploadCertNum === 0
      //   this.$refs.formList.submit()
    },
    saveForm() {
      //   this.formData.userDepartmentId = parseFloat(
      //     this.formData.userDepartmentId
      //   )
      //   if (this.formData.userDepartmentId) {
      //     this.formData['userDepartment'] = this.mxDepartlist.filter(e => {
      //       return e.value === this.formData.userDepartmentId
      //     })[0].label
      //   }
      //   this.formData.assetTypeId = parseFloat(
      //     this.formData.assetTypeId
      //   )
      //   if (this.formData.assetTypeId) {
      //     this.formData['type'] = this.mxAssetType.filter(e => {
      //       return e.value === this.formData.assetTypeId
      //     })[0].label
      //   }
      //   let assetImg = JSON.stringify(this.formConfig.picture.addImgList)
      //   let accessory = JSON.stringify(this.formConfig.cert.addCertList)
      //   let params = {
      //     ...this.formData,
      //     assetImg,
      //     accessory
      //   }
      //   if (this.operate === 'add') {
      //     addAssetsRecord(params).then(res => {
      //       if (res.status) {
      //         this.$success('新增台账')
      //         this.$router.go(-1)
      //       }
      //     })
      //   } else {
      //     updateAssetsRecord(params).then(res => {
      //       if (res.status) {
      //         this.$success('修改台账')
      //         this.$router.go(-1)
      //       }
      //     })
      //   }
    },
    // 文件上传成功
    handleSuccess(response, file, fileList) {
      debugger
      if (response.status) {
        this.formConfig.picture.uploadSuccessImgNum++
        this.formConfig.picture.addImgList.push(response.data.id)
        if (
          this.formConfig.picture.uploadSuccessImgNum ===
          this.formConfig.picture.uploadImgNum
        ) {
          this.formConfig.picture.submitImg = true
        }
        if (
          this.formConfig.picture.submitImg &&
          this.formConfig.cert.submitCert
        ) {
          this.saveForm()
        }
      } else {
        this.$error(response.msg)
        return false
      }
    },
    // 文件上传成功
    handleCertSuccess(response, file, fileList) {
      debugger
      if (response.status) {
        this.formConfig.cert.uploadSuccessCertNum++
        this.formConfig.cert.addCertList.push(response.data.id)
        if (
          this.formConfig.cert.uploadSuccessCertNum ===
          this.formConfig.cert.uploadCertNum
        ) {
          this.formConfig.cert.submitCert = true
        }
        if (
          this.formConfig.picture.submitImg &&
          this.formConfig.cert.submitCert
        ) {
          this.saveForm()
        }
      } else {
        this.$error(response.msg)
        return false
      }
    },
    // 文件上传触发
    handleChange(file, fileList) {
      const fileType = file.raw.type.split('/')[0]
      if (fileList.length > 0) {
        this.formConfig.picture.uploadImg = true
      }
      this.formConfig.picture.uploadImgNum =
        fileList.length - this.formConfig.picture.uploadedImgNum
    },
    // 文件上传触发
    handleCertChange(file, fileList) {
      if (fileList.length > 0) {
        this.formConfig.cert.uploadCert = true
      }
      this.formConfig.cert.uploadCertNum =
        fileList.length - this.formConfig.cert.uploadedCertNum
    },
    // 文件上传移除
    handleRemove(file, fileList) {
      this.formConfig.picture.uploadImg = fileList.length > 0
      if (file.status === 'success') {
        this.formConfig.picture.addImgList.splice(
          this.formConfig.picture.addImgList.indexOf(file.id),
          1
        )
        this.formConfig.picture.uploadedImgNum--
      }
      this.formConfig.picture.uploadImgNum =
        fileList.length - this.formConfig.picture.uploadedImgNum
    },
    // 文件上传移除
    handleCertRemove(file, fileList) {
      this.formConfig.cert.uploadCert = fileList.length > 0
      if (file.status === 'success') {
        this.formConfig.cert.addCertList.splice(
          this.formConfig.cert.addCertList.indexOf(file.id),
          1
        )
        this.formConfig.cert.uploadedCertum--
      }
      this.formConfig.cert.uploadCertNum =
        fileList.length - this.formConfig.cert.uploadedCertNum
    },
    // 文件上传错误
    handleError(err, file, fileList) {
      if (err.status === 401) {
        this.$router.push({ path: '/login' })
      }
      this.$message({
        message: err.msg,
        type: 'error'
      })
    },
    // 文件上传错误
    handleCertError(err, file, fileList) {
      if (err.status === 401) {
        this.$router.push({ path: '/login' })
      }
      this.$message({
        message: err.msg,
        type: 'error'
      })
    },
    // 文件上传超过限制
    handleExceed(file, fileList) {
      // this.$message.info(`最多只能上传一张图片！`);
    },
    // 文件预览
    handleCertPreview(file) {},
    // 文件上传之前做文件大小校验
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 10MB!')
      }
      return isLt2M
    },
    checkboxChange(event, item) {}
  }
}
</script>

<style lang="less">
#purchaseManageDetail {
  height: calc(100% - 60px);
  overflow-y: auto;
}
#purchaseManageDetail .detail-item:last-child {
  margin-top: 20px;
}
</style>
