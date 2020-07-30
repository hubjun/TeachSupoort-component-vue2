<template>
  <div id="PurchasePlanDetail" ref="PurchasePlanDetail" class="com-detail-wrap">
    <div class="detail-item">
      <div class="detail-head">
        <div class="tit">基本信息</div>
        <div class="btns">
          <el-button class="com-btn" type="info" @click="cancel" plain>返回</el-button>
          <el-button v-if="$route.query.type!='detail'" class="com-btn" type="primary" @click="save" plain>保存</el-button>
          <el-button v-if="$route.query.type!='detail'" class="com-btn" type="primary" @click="declare" plain>申报</el-button>
        </div>
      </div>
      <div class="detail-content">
        <form-list
          :datas="formData"
          ref="formList"
          :form-config="formConfig"
          @handle-btn-click="handleBtnClick"
          @handle-cert-success="handleCertSuccess"
          @handle-cert-change="handleCertChange"
          @handle-cert-remove="handleCertRemove"
          @handle-cert-error="handleCertError"
          @handle-exceed="handleExceed"
          @before-upload="beforeUpload"
        >
        </form-list>
      </div>


      <div v-if="$route.query.type === 'detail'"  class="detail-item">
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


      <div class="detail-item">
        <div class="detail-head">
          <div class="tit">表单信息</div>
          <div class="btns">
<!--            <el-button v-if="this.$route.query.type === 'Tadd'" class="com-btn" type="primary" @click="tableAdd" plain>新增</el-button>-->
          </div>
        </div>
        <div class="detail-content">
          <el-form :rules="rules" :model="Form" ref="Form">
            <el-form-item prop="table">
              <edit-table :table-data="Form.tableData" :table-height="Form.tableHeight">
                <el-table-column label="序号" type="index" width="50px" align="center"></el-table-column>
                <el-table-column
                  v-for="(item, index) in tableConfig"
                  :prop="item.prop"
                  :label="item.label"
                  align="center"
                  :width="item.width"
                  :key="index"
                  :show-overflow-tooltip="true"
                >
                  <template slot-scope="scope">

                    <el-input type="number" :disabled="$route.query.type === 'detail'" @change="unitPriceChange(scope)" v-model="scope.row.quantity" v-if="item.prop === 'quantity'"></el-input>
                    <el-input type="number" :disabled="$route.query.type === 'detail'" @change="unitPriceChange(scope)" placeholder="请输入单价(数字)" v-model="scope.row.unitPrice" v-else-if="item.prop === 'unitPrice'"></el-input>
                    <div v-else>{{scope.row[item.prop]}}</div>
                  </template>
                </el-table-column>
                <el-table-column  v-if="$route.query.type !== 'detail'" label="操作" width="150" align="center" fixed="right">
                  <template slot-scope="scope">
                    <div>
                      <el-button type="text" @click="tableDel(scope.$index)">删除</el-button>
                    </div>
                  </template>
                </el-table-column>
              </edit-table>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <el-dialog
        :visible.sync="dialogVisibleSupples"
        :close-on-click-modal="false"
        width="1200px"
        :center="true"
      >
        <div slot="title" class="dialog-title">
          <span>资产列表</span>
        </div>
        <asset-select-table  v-if="dialogVisibleSupples"  @handle-select="handlePopSelect"></asset-select-table>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import FormList from '@/components/form/FormList'
  import { dictMixin } from '@/mixins/dictMixin'
  import { uploadUrl, uploadCert } from '@/axios/common'
  import { BASE_URL } from '@/axios/Global'
  import {
    generateCentralizedProcessing,
    saveCentralizedProcessing,
    commitCentralizedProcessing,
    getCentralizedProcessingId
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
      let tableValidator = (rule, value, callback) => {
        if (!this.Form.tableData.length) {
          callback(new Error('请选择资产'))
        } else {
          callback()
        }
      }
      return {
        type: false,
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
        formData: {
          planningCode: '',
          useDept: '',
          checkState: '',
          batchNumber: '',
          applicant: '',
          remarks: '',
          declareDate: ''
        },
        // 表格数据
        tableData: [],
        // 表格高度
        tableHeight: 400,
        dialogVisibleSupples: false,
        rules: {
          table: [
            {
              validator: tableValidator,
              trigger: 'blur'
            }
          ]
        },
        Form: {
          // 表格数据
          tableData: [],
          // 表格高度
          tableHeight: 400
        },
        dialogVisibleSupples: false
      }
    },
    created() {

      if(this.$route.query.type === 'Tadd') {
        this.Form.tableData = JSON.parse(sessionStorage.getItem('PurchasePlanData'));
        // this.Form.tableData.forEach((r, i) => {
        //   this.Form.tableData[i].unitPrice = 1
        //   this.Form.tableData[i].amount = 1 * this.Form.tableData[i].quantity
        // })
        console.log(this.Form.tableData)
      }

      if(this.$route.query.type !== 'Tadd') {
        getCentralizedProcessingId(this.$route.query.id).then(res => {
          if (this.$route.query.type === 'edit') {
            this.formConfig.cert.certFileList = []
            res.data.fileInfos.forEach(re => {
              this.formConfig.cert.certFileList.push({
                name: re.fileName,
                id: re.id,
                url: re.url
              })
              this.uploadFileList.push({
                id: re.id,
                path: re.path,
                name: re.fileName,
                url: re.url
              })
            })
          }else {
            res.data.fileInfos.forEach(re => {
              this.uploadFileList.push({
                id: re.id,
                path: re.path,
                name: re.fileName,
                url: re.url
              })
            })
            delete this.formConfig.cert
          }

          this.formData = res.data;
          this.Form.tableData = res.data.lines;
        })
      }

    },
    async mounted() {



    },
    methods: {
      tableDel(i) {
        this.Form.tableData.splice(i, 1)
      },
      unitPriceChange(data) {
        let amount = parseFloat(data.row.unitPrice) * parseFloat(data.row.quantity)
        this.$set(this.Form.tableData[data.$index], 'amount', amount)
      },
      tableAdd() {
        this.dialogVisibleSupples = true
      },
      removeClick(value) {
        if(typeof value.row.id !== 'undefined') {
          this.removeList.push(value.row.id)
        }
        this.tableData.splice(value.$index, 1)
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
      declare() {
        for(let i = 0; i < this.Form.tableData.length; i++) {
          if(this.Form.tableData[i].unitPrice === undefined || this.Form.tableData[i].unitPrice === '') {
            this.$message.error('请填写所有资产的单价')
            return;
          }
        }

        if (this.$route.query.type === 'Tadd') {

          var file = [];
          this.uploadFileList.forEach(re => {
            file.push(re.id)
          })


          var lines = [];

          this.Form.tableData.forEach(arr => {


            lines.push({
              id: arr.id,
              quantity: arr.quantity,
              unitPrice: arr.unitPrice
            })
          });
          generateCentralizedProcessing(
            {
              'fileIds': file,
              'id': 0,
              'lines': lines,
              'remarks': this.formData.remarks
            }).then((res) => {
              commitCentralizedProcessing(
                {
                  'checkState': 1,
                  'id': res.data,
                  'remarks': this.formData.remarks
                }
              ).then(res => {
                this.$message('申报成功');
                this.cancel();
              })
          });



        } else {
          commitCentralizedProcessing(
            {
              'checkState': 1,
              'id': parseInt(this.$route.query.id),
              'remarks': this.formData.remarks
            }
          ).then(res => {
            this.$message('申报成功');
            this.cancel();
          })
        }

      },
      async save() {

        for(let i = 0; i < this.Form.tableData.length; i++) {
          if(this.Form.tableData[i].unitPrice === undefined || this.Form.tableData[i].unitPrice === '') {
            this.$message.error('请填写所有资产的单价')
            return;
          }
        }

        var file = [];
        this.uploadFileList.forEach(re => {
          file.push(re.id)
        })


        var lines = [];

        this.Form.tableData.forEach(arr => {


          lines.push({
            id: arr.id,
            quantity: arr.quantity,
            unitPrice: arr.unitPrice
          })
        });

        var _this = this;
        if (this.$route.query.type === 'Tadd') {
          generateCentralizedProcessing(
            {
              'fileIds': file,
              'id': 0,
              'lines': lines,
              'remarks': _this.formData.remarks
            }).then(() => {
              this.$message('新增采购计划成功');
              this.cancel();
          });
        } else {
          saveCentralizedProcessing(
            {
              'fileIds': file,
              'id': this.$route.query.id,
              'lines': lines,
              'remarks': _this.formData.remarks
            }).then(() => {
              this.$message('修改成功');
              this.cancel();
          });
        }
      },
      cancel() {
        if(this.$route.query.type === 'Tadd') {
          this.$router.push({ path: '/teachasset/purchase-plan/centralized-processing' });
        }else {
          this.$router.push({ path: '/teachasset/purchase-plan/purchase-plan' });
        }

      },
      tableAdd() {
        this.dialogVisibleSupples = true
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
          postHeaders: {
            Authorization: ''
          },
          cert: {
            show: true,
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
                    label: '单据编码',
                    type: 'text',
                    prop: 'planningCode',
                    disabled: true,
                    placeholder: '系统自动生成'
                  },
                  {
                    label: '申请日期',
                    type: 'text',
                    prop: 'batchNumber',
                    disabled: true,
                    placeholder: '系统自动生成'
                  },
                  {
                    label: '状态',
                    type: 'select',
                    prop: 'checkState',
                    disabled: true,
                    options: this.mxDemandPlanStatus
                  },
                  {
                    label: '申请人',
                    type: 'text',
                    prop: 'batchNumber',
                    disabled: true,
                    placeholder: '系统自动生成'
                  }
                ],
                [
                  {
                    label: '备注',
                    span: 12,
                    type: 'textarea',
                    prop: 'remarks',
                    placeholder: '请输入备注',
                    disabled: this.$route.query.type === 'detail'
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
            prop: 'assetsName',
            label: '资产名称'
          },
          {
            prop: 'quantity',
            label: '采购数量',
            editable: true
          },
          {
            prop: 'unitPrice',
            label: '单价'
          },
          {
            prop: 'amount',
            label: '金额'
          },
          {
            prop: 'specification',
            label: '规格型号'
          },
          {
            prop: 'assetsUnit',
            label: '单位'
          },
          {
            prop: 'assetsType',
            label: '资产类型'
          },
          {
            prop: 'batchNumber',
            label: '批件号'
          }
        ]
      }
    }
  }
</script>

<style lang='less'>
  @import '../../../assets/css/variable.less';
  @import '../../../assets/css/style.less';
  #PurchasePlanDetail {
    flex: 1;
  }
</style>
