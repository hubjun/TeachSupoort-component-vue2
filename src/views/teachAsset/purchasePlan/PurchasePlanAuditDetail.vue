<template>
  <div id="PurchasePlanAuditDetail" ref="PurchasePlanAuditDetail" class="com-detail-wrap">
    <div class="detail-item">
      <div class="detail-head">
        <div class="tit">基本信息</div>
        <div class="btns">
          <el-button class="com-btn" type="info" @click="cancel" plain>返回</el-button>
          <el-button class="com-btn" type="danger" @click="turnDown" plain>驳回</el-button>
          <el-button class="com-btn" type="primary" @click="declare" plain>审批</el-button>
        </div>
      </div>
      <div class="detail-content">
        <form-list
          :datas="formData"
          ref="formList"
          :form-config="formConfig"
          @handle-btn-click="handleBtnClick"
          @handle-exceed="handleExceed"
          @before-upload="beforeUpload"
        >
        </form-list>
      </div>

      <div class="detail-item">
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
      }

      if(this.$route.query.type === 'edit') {
        getCentralizedProcessingId(this.$route.query.id).then(res => {

          res.data.fileInfos.forEach(re => {
            this.uploadFileList.push({
              id: re.id,
              path: re.path,
              name: re.fileName,
              url: re.url
            })
          })
          this.formData = res.data;
          this.Form.tableData = res.data.lines;
        })
      }

    },
    async mounted() {



    },
    methods: {
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
        if(typeof file === 'undefined') {
          this.uploadFileList.forEach((re, index) => {
            if(re.id === file.response.data.id) {
              this.uploadFileList.splice(index, 1);
            }
          })
        }else{
          this.uploadFileList.forEach((re, index) => {
            if(re.id === file.id) {
              this.uploadFileList.splice(index, 1);
            }
          })
        }
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
      turnDown() {
        commitCentralizedProcessing(
          {
            'checkState': 9,
            'id': parseInt(this.$route.query.id),
            'remarks': this.formData.remarks
          }
        ).then(res => {
          this.$message('已驳回需求计划');
          this.cancel();
        })
      },
      declare() {
        commitCentralizedProcessing(
          {
            'checkState': 8,
            'id': parseInt(this.$route.query.id),
            'remarks': this.formData.remarks
          }
        ).then(res => {
          this.$message('审核成功');
          this.cancel();
        })
      },
      async save() {

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
        console.log(lines);


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
        this.$router.push({ path: '/teachasset/purchase-plan/purchase-plan-audit' });
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
                    options: this.mxPurchasePlanStatus
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
                    placeholder: '请输入备注'
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
  #PurchasePlanAuditDetail {
    flex: 1;
  }
</style>
