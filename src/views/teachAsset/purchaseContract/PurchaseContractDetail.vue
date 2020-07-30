<template>
  <div id="PurchaseContractDetail" ref="PurchaseContractDetail" class="com-detail-wrap">
    <div class="detail-item">
      <div class="detail-head">
        <div class="tit">基本信息</div>
        <div class="btns">
          <el-button class="com-btn" type="info" @click="cancel" plain>返回</el-button>
          <el-button v-if="$route.query.type!='detail'" class="com-btn" type="primary" @click="save" plain>保存</el-button>
<!--          <el-button v-if="$route.query.type!='detail'&&$route.query.type!='add'" class="com-btn" type="primary" @click="declare" plain>申报</el-button>-->
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
          @before-upload="beforeUpload"
        >
        </form-list>
      </div>

      <div v-if="$route.query.type=='edit'" class="detail-item">
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
          </div>
        </div>

        <el-form  v-if="$route.query.type !== 'edit'">
          <el-row :gutter="20">
            <el-col :span="15">
              <el-form-item label="采购计划单据编码" label-width="150px">
                <el-input v-model="djbm"  placeholder="请输入采购计划单据编码"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-button class="com-btn" type="primary" @click="tableAdd" plain>查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div id="EditTable" ref="EditTable" class="EditTable-wrap">
          <el-table :data="tableData" border stripe :height="400" :header-cell-style="tableHeaderCellStyle" :cell-style="tableCellStyle">
            <el-table-column width="50" align="center" type="index" label="序号"></el-table-column>
            <el-table-column prop="purchasePlanAssetName" align="center" label="资产名称"></el-table-column>
            <el-table-column prop="purchaseNumber" align="center" label="采购数量"></el-table-column>
            <el-table-column prop="price" align="center" label="单价">
              <template slot-scope="scope">
                <el-input v-model="scope.row.price" placeholder="请输入内容"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="totalPrice" align="center" label="金额"></el-table-column>
            <el-table-column prop="specification" align="center" label="规格型号"></el-table-column>
            <el-table-column prop="unit" align="center" label="单位"></el-table-column>
            <el-table-column prop="type" align="center" label="资产类型"></el-table-column>
            <el-table-column prop="petitionNo" align="center" label="批件号"></el-table-column>
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
    PurchaseContractId,
    updatePurchaseContract,
    addPurchaseContract,
    searchCode
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
        UnitList: [],
        AssetTypeList: [],
        removeList: [],
        uploadFileList: [],
        djbm: '',
        djbmid: 0,
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
        formData: {},
        // 表格数据
        tableData: [],
        // 表格高度
        tableHeight: 400,
        dialogVisibleSupples: false
      }
    },
    created() {
    },
    async mounted() {
      await this.getSupplierList().then(res => {
      })
      if(this.$route.query.type !== 'add') {
        PurchaseContractId(this.$route.query.id).then(res => {
          this.formData = res.data;
          this.tableData = res.data.contractDetailList
          this.formData.supplierName = this.formData.supplierId

          res.data.fileDTOS.forEach(re => {

            this.uploadFileList.push({
              id: re.id,
              path: re.path,
              name: re.fileName,
              url: re.url
            })
          })

        })

        delete this.formConfig.cert
      }
    },
    methods: {
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
        commitPlanning(
          {
            'checkState': 1,
            'id': parseInt(this.$route.query.id),
            'remarks': this.formData.remarks
          }
        ).then(res => {
          this.$message('申报成功');
          this.cancel();
        })
      },
      async save() {

        if (this.$route.query.type === 'edit') {
          var list = []
          this.tableData.forEach(r => {
            list.push({
              detail_id: r.id,
              price: r.price
            })
          })
          var PostData = {
            id: parseInt(this.$route.query.id),
            jsonArray: list
          }
          updatePurchaseContract(PostData).then(res => {
            this.$message('保存成功');
            this.cancel();
          })
        }else {

          var file = [];
          this.uploadFileList.forEach(re => {
            file.push(re.id)
          })

          var list = []
          this.tableData.forEach(r => {
            list.push({
              price: r.price,
              purchase_number: r.purchaseNumber,
              purchase_plan_detail_id: r.id
            })
          })
          var PostData = {
            accessory:JSON.stringify(file),
            arrival_date: this.formData.arrivalDate,
            bid_date: this.formData.bidDate,
            bid_no: this.formData.bidDate,
            contract_bill_code: this.formData.contractBillCode,
            contract_code: this.formData.contractCode,
            contract_date: this.formData.contractDate,
            contract_name: this.formData.contractName,
            contract_price: this.formData.contractPrice,
            purchase_play_code: this.djbm,
            purchase_play_id: this.djbmid,
            supplier_id: this.formData.supplierName,
            jsonArray: list
          }

          this.mxSupplier.forEach(r => {
            if(this.formData.supplierName === r.value) {
              PostData.supplier_name = r.label
            }
          })

          addPurchaseContract(PostData).then(res => {
            if(res.status) {
              this.$message('新增成功');
              this.cancel();
            }
          })
        }
      },
      cancel() {
        this.$router.push({ path: '/teachasset/purchase-contract/purchase-contract' });
      },
      tableAdd() {
        if(this.djbm === '') {
          this.$message.info('采购计划单据编码为空')
          return;
        }
        searchCode(this.djbm).then(res => {
          console.log(res.data[0].lines);
          this.djbmid = res.data[0].id;
          res.data[0].lines.forEach((r, i) => {
            res.data[0].lines[i].purchasePlanAssetName = r.assetsName
            res.data[0].lines[i].purchaseNumber = r.quantity
            res.data[0].lines[i].price = r.unitPrice
            res.data[0].lines[i].totalPrice = r.amount
            res.data[0].lines[i].specification = r.specification
            res.data[0].lines[i].unit = r.assetsUnit
            res.data[0].lines[i].type = r.assetsType
            res.data[0].lines[i].petitionNo = r.batchNumber
          })
          this.tableData = res.data[0].lines;
        })

        // this.tableData.push({});
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
                    prop: 'contractBillCode',
                    disabled: true,
                    placeholder: '系统自动生成'
                  },
                  {
                    label: '合同编号',
                    prop: 'contractCode',
                    placeholder: '请输入',
                    disabled: this.$route.query.type === 'edit',
                    type: 'text'
                  },
                  {
                    label: '合同名称',
                    prop: 'contractName',
                    placeholder: '请输入',
                    disabled: this.$route.query.type === 'edit',
                    type: 'text'
                  },
                  {
                    label: '合同签订日期',
                    prop: 'contractDate',
                    placeholder: '请输入',
                    disabled: this.$route.query.type === 'edit',
                    type: 'dateTime'
                  },
                  {
                    label: '招标编号',
                    prop: 'bidNo',
                    placeholder: '请输入',
                    disabled: this.$route.query.type === 'edit',
                    type: 'text'
                  },
                  {
                    label: '招标日期',
                    prop: 'bidDate',
                    placeholder: '请输入',
                    disabled: this.$route.query.type === 'edit',
                    type: 'dateTime'
                  },
                  {
                    label: '到货日期',
                    prop: 'arrivalDate',
                    placeholder: '请输入',
                    disabled: this.$route.query.type === 'edit',
                    type: 'dateTime'
                  },
                  {
                    label: '合同金额',
                    prop: 'contractPrice',
                    placeholder: '系统自动计算',
                    disabled: true,
                    type: 'text'
                  },
                  {
                    label: '供应商',
                    prop: 'supplierName',
                    placeholder: '请输入',
                    disabled: this.$route.query.type === 'edit',
                    type: 'select',
                    options: this.mxSupplier
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
            label: '资产名称'
          },
          {
            prop: 'quantity',
            label: '采购数量',
            editable: true
          },
          {
            prop: 'specification',
            label: '单价'
          },
          {
            prop: 'assetsUnit',
            label: '金额'
          },
          {
            prop: 'assetsType',
            label: '规格型号'
          },
          {
            prop: 'assetsType',
            label: '单位'
          },
          {
            prop: 'assetsType',
            label: '资产类型'
          },
          {
            prop: 'assetsType',
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
  #PurchaseContractDetail {
    flex: 1;
  }
</style>
