<template>
  <div id="DemandApproveDetail" ref="DemandApproveDetail" class="com-detail-wrap">
    <div class="detail-item">
      <div class="detail-head">
        <div class="tit">基本信息</div>
        <div class="btns">
          <el-button v-if="$route.query.type!='detail'" class="com-btn" type="primary" @click="save" plain>保存</el-button>
        </div>
      </div>
      <div class="detail-content">
        <form-list
          :disabled="disabled"
          :datas="formData"
          ref="formList"
          :form-config="formConfig"
          @handle-btn-click="handleBtnClick"
          @handle-cert-success="handleCertSuccess"
          @handle-cert-change="handleCertChange"
          @handle-cert-remove="handleCertRemove"
          @handle-cert-error="handleCertError"
          @handle-exceed="handleExceed"
          @handle-cert-preview="handleCertPreview"
          @before-upload="beforeUpload"

          @handle-success="handleSuccess"
          @handle-change="handleChange"
          @handle-remove="handleRemove"
          @handle-error="handleError"
        >
        </form-list>
      </div>

      <div v-if="$route.query.type=='detail'" class="detail-item">
        <div class="detail-head">
          <div class="tit">附件信息</div>
        </div>
        <div ref="EditTable" class="EditTable-wrap" style="width: 500px">
          <el-table :data="uploadFileList" border stripe :height="200" :header-cell-style="tableHeaderCellStyle" :cell-style="tableCellStyle">
            <el-table-column width="50" align="center" type="index" label="序号"></el-table-column>
            <el-table-column prop="name" align="center" label="附件名称"></el-table-column>
            <el-table-column align="center" label="下载">
              <template slot-scope="scope">
                <a target="_blank" :href="scope.row.url">下载</a>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import FormList from '@/components/form/FormList'
  import { dictMixin } from '@/mixins/dictMixin'
  import { uploadUrl, uploadCert } from '@/axios/common'
  import { BASE_URL } from '@/axios/Global'
  import {
    addConfidentiality
  } from './api';
  import EditTable from '../../../components/table/EditTable';
  import AssetSelectTable from '../../../components/pop/AssetSelectTable';

  export default {
    components: {
      FormList,
      EditTable,
      AssetSelectTable
    },
    mixins: [dictMixin],
    data() {
      return {
        type: false,
        UserName: localStorage.getItem('UserName'),
        date: new Date().toISOString(),
        UnitList: [],
        AssetTypeList: [],
        removeList: [],
        uploadFileList: [],
        tableHeaderCellStyle: {
          background: 'rgba(243,243,245,1)',
          padding: '0',
          color: '#333'
        },
        tableCellStyle: {
          padding: '10px 0',
          color: '#666'
        },
        TypeCode: 'JB01ZJLY',
        disabled: false,
        formData: {
          dataType: 2
        },
        // 表格数据
        tableData: [],
        // 表格高度
        tableHeight: 400,
        dialogVisibleSupples: false
      }
    },
    created() {
      // this.formConfig.cert.show = false
      // this.formConfig.postHeaders.Authorization = `Bearer ${sessionStorage.getItem('TOKEN')}`
      // console.log(this.formConfig.postHeaders.Authorization)
    },
    async mounted() {
      this.getDepartList()
      this.getConfidentialityLevel()

      await this.getUnitList().then(res => {
        this.UnitList = res
      })
      await this.getAssetTypeList().then(res => {
        this.AssetTypeList = res
      })
      this.getDepartDictList().then(res => {
        if(this.$route.query.type !== 'edit') {

        }

      })
    },
    methods: {
      // 文件上传成功
      handleSuccess(response, file, fileList) {
        this.formConfig.picture.imgFileList.push({
          url: response.data.url,
          id: response.data.id
        })
      },
      // 文件上传触发
      handleChange(file, fileList) {
        this.submit();
      },
      async submit() {
        this.$refs.formList.submit()
      },
      // 文件上传移除
      handleRemove(file, fileList) {
        this.formConfig.picture.imgFileList.forEach((r, i) => {
          if(file.id === r.id){
            this.formConfig.picture.imgFileList.splice(i, 1)
          }
        })
      },
      // 文件上传错误
      handleError(err, file, fileList) {
        console.log(err);
      },
      removeClick(value) {
        if(typeof value.row.id !== 'undefined') {
          this.removeList.push(value.row.id)
        }
        this.tableData.splice(value.$index, 1)
      },
      handleCertPreview(response) {
        console.log(response);
      },
      // 文件上传成功
      async handleCertSuccess(response, file, fileList) {
        this.uploadFileList.push({
          id: response.data.id,
          path: response.data.path
        });
      },
      // 文件上传触发
      handleCertChange(file, fileList) {
        this.submit();
      },
      // 文件上传移除
      handleCertRemove(file, fileList) {
        this.uploadFileList.forEach((re, index) => {
          if(typeof file.response === 'undefined') {
            if(re.id === file.id) {
              this.uploadFileList.splice(index, 1);
            }
          }else {
            if(re.id === file.response.data.id) {
              this.uploadFileList.splice(index, 1);
            }
          }
        })
      },
      // 文件上传错误
      handleCertError(err, file, fileList) {
        console.log(err);
      },
      // 文件上传超过限制
      handleExceed(file, fileList) {
        // this.$message.info(`最多只能上传一张图片！`);
      },
      // 文件上传之前做文件大小校验
      beforeUpload(file) {
        this.$emit('before-upload', file)
      },
      getFormData() {
        console.log(this.formData.data)
      },
      handleBtnClick(res) {
        this[res] && this[res]()
      },
      async submit() {
        this.$refs.formList.submit()
      },
      // 文件上传之前做文件大小校验
      beforeUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 10
        if (!isLt2M) {
          this.$message.error('上传文件大小不能超过 10MB!')
        }
        return isLt2M
      },
      save() {

        var img = [];
        this.formConfig.picture.imgFileList.forEach(re => {
          img.push(re.id)
        })
        this.formData.imgIds = img.join(',')


        var file = [];
        this.uploadFileList.forEach(re => {
          file.push(re.id)
        })
        this.formData.enclosureIds = file.join(',')


        addConfidentiality(this.formData).then((res) => {
          this.$message('保存成功');
          this.cancel();
        });

      },
      cancel() {
        this.$router.push({ path: '/teachingmaterial/confidential-information/data-query' });
      },
      tableAdd() {
        this.tableData.push({});
      },
      handlePopSelect(res) {
        this.dialogVisibleSupples = false
        this.tableData.push({
          assetName: res.assetName,
          quantity: res.quantity,
          specification: res.specification,
          assetsUnit: res.unit,
          assetsType: res.type
        })
      }
    },
    computed: {
      formConfig() {
        return {
          picture: {
            show: true,
            pictureLabel: '资料图片',
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
            // show: false,
            show: this.$route.query.type !== 'detail',
            certLabel: '附件信息',
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
          labelWidth: '100px',
          config: [
            {
              label: ' 基本信息',
              props: [
                [
                  {
                    label: '教材类型',
                    type: 'radio',
                    prop: 'dataType',
                    options: [
                      {
                        label: '地图',
                        value: 1
                      },
                      {
                        label: '教材',
                        value: 2
                      }
                    ]
                  },
                  {
                    label: '资料编号',
                    labelWidth: '80px',
                    prop: 'dataCode',
                    disabled: true,
                    placeholder: '系统自动生成',
                    type: 'text'
                  },
                  {
                    label: '出版日期',
                    type: 'date',
                    prop: 'publishDate',
                    placeholder: '请输入出版日期'
                  },
                  {
                    label: '资料名称',
                    type: 'text',
                    prop: 'dataName',
                    placeholder: '请输入资料名称'
                  },
                  {
                    label: '管理部门',
                    type: 'text',
                    prop: 'deptId',
                    placeholder: '请选择',
                    type: 'select',
                    options: this.mxDepartlist
                  },
                  {
                    label: '保密级别',
                    type: 'text',
                    prop: 'secrecyLevelid',
                    placeholder: '请选择',
                    type: 'select',
                    options: this.mxconfidentialityLevel
                  },
                  {
                    label: '作者',
                    type: 'text',
                    prop: 'author',
                    placeholder: '请输入作者'
                  },
                  {
                    label: '数量',
                    type: 'number',
                    prop: 'dataNum',
                    placeholder: '请输入数量'
                  },
                  {
                    label: '货架号',
                    type: 'text',
                    prop: 'dataShelf',
                    placeholder: '请输入货架号'
                  },
                  {
                    label: '存放地点',
                    type: 'text',
                    prop: 'dataAddr',
                    placeholder: '请输入存放地点'
                  }
                ]
              ]
            }
          ]
        }
      },
      // 表格配置
      tableConfig() {
        return [
          {
            prop: 'assetName',
            label: '资产名称',
          },
          {
            prop: 'quantity',
            label: '申报数量',
            editable: true
          },
          {
            prop: 'specification',
            label: '规格型号'
          },
          {
            prop: 'assetsUnit',
            label: '计量单位'
          },
          {
            prop: 'assetsType',
            label: '资产类型'
          }
        ]
      }
    }
  }
</script>

<style lang='less'>
  @import '../../../assets/css/variable.less';
  @import '../../../assets/css/style.less';
  #DemandApproveDetail {
    flex: 1;
  }
  .Footer{text-align: right; color: #666; line-height: 40px;}
  .Footer span{margin-right: 30px}
  .Footer span:last-child{margin-right: 0}
</style>
