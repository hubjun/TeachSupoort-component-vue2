<template>
  <div id="assetacceptdetail" ref="assetacceptdetail" class="com-detail-wrap">
    <div class="detail-item">
      <div class="detail-head">
        <div class="tit">基本信息</div>
        <div class="btns">
          <el-button class="com-btn"  type="info" @click="cancel" plain>返回</el-button>
          <el-button
            class="com-btn"
            v-show="operate === 'add'"
            type="primary"
            @click="save"
            plain
          >验收建账</el-button>
        </div>
      </div>
      <div class="detail-content">
        <form-list
          ref="formList"
          @Handle-change="change"
          :disabled="disabled"
          :datas="formData"
          :rules="listRules"
          :form-config="formConfig"
          @handle-btn-click="handleBtnClick"
        ></form-list>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getReceiptDetail,
  getContractList,
  getAssetList,
  addAsset
} from './api'
import FormList from '@/components/form/FormList'
import { dictMixin } from '../../../mixins/dictMixin'
export default {
  components: {
    FormList
  },
  computed: {
    formConfig() {
      return {
        labelWidth: '110px',
        config: [
          {
            label: ' 基本信息',
            props: [
              [
                {
                  label: '验收单据编码',
                  type: 'text',
                  prop: 'receiptCode',
                  disabled: true,
                  placeholder: '自动生成'
                },
                {
                  label: '建账人',
                  type: 'text',
                  prop: 'receiptName',
                  disabled: true,
                  placeholder: '默认当前用户'
                },
                {
                  label: '建账日期',
                  type: 'dateTime',
                  prop: 'receiptDate',
                  disabled: false,
                  placeholder: ''
                },
                {
                  label: '合同单据编码',
                  prop: 'contractBillCode',
                  placeholder: '请选择合同单据编码',
                  type: 'select',
                  options: this.cgbmList,
                  callback: 'changeBillCode'
                },
                {
                  label: '合同名称',
                  type: 'text',
                  prop: 'contractName',
                  disabled: true,
                  placeholder: ''
                },
                {
                  label: '合同签订日期',
                  type: 'date',
                  prop: 'contractDate',
                  disabled: true,
                  placeholder: ''
                },
                {
                  label: '资产名称',
                  type: 'select',
                  show: this.operate === 'detail',
                  prop: 'contractDetailId',
                  placeholder: '',
                  options: this.contractList,
                  callback: 'changecontract'
                },
                {
                  label: '规格型号',
                  type: 'text',
                  prop: 'specification',
                  disabled: true,
                  placeholder: ''
                },
                {
                  label: '资产类型',
                  type: 'text',
                  prop: 'assetsType',
                  disabled: true,
                  placeholder: ''
                },
                {
                  label: '单价（元）',
                  type: 'text',
                  prop: 'price',
                  disabled: true
                },
                {
                  label: '数量',
                  type: 'text',
                  prop: 'purchaseNumber',
                  disabled: true,
                  placeholder: ''
                },
                {
                  label: '金额（元）',
                  type: 'text',
                  prop: 'totalPrice',
                  disabled: true,
                  placeholder: ''
                },
                {
                  label: '计量单位',
                  type: 'text',
                  prop: 'unit',
                  disabled: true,
                  placeholder: ''
                },
                {
                  label: '供应商',
                  type: 'text',
                  prop: 'supplierName',
                  disabled: true,
                  placeholder: ''
                },
                {
                  label: '到货日期',
                  type: 'date',
                  prop: 'arrivalDate',
                  disabled: this.operate === 'detail',
                  placeholder: '日期选择'
                },
                {
                  label: '采购日期',
                  type: 'date',
                  disabled: this.operate === 'detail',
                  prop: 'purchasePlayDate',
                  placeholder: '日期选择'
                },
                {
                  label: '生产厂家',
                  type: 'text',
                  prop: 'factoryName',
                  placeholder: '请输入生产厂家'
                },
                {
                  label: '发票号',
                  type: 'text',
                  prop: 'invoice',
                  placeholder: '请输入发票号'
                },
                {
                  label: '品牌',
                  type: 'text',
                  prop: 'brand',
                  placeholder: '请输入品牌'
                },
                {
                  label: '批件号',
                  type: 'text',
                  prop: 'petitionNo',
                  disabled: true,
                  placeholder: ''
                },
                {
                  label: '使用年限',
                  type: 'number',
                  prop: 'serviceLife',
                  placeholder: '请输入使用年限'
                },
                {
                  label: '信息化办公设备',
                  type: 'select',
                  prop: 'type',
                  options: this.xihbgsbList,
                  placeholder: '请选择'
                }
              ]
            ]
          }
        ]
      }
    }
  },
  data() {
    return {
      operate: '',
      disabled: false,
      formData: {
        receiptCode: '',
        receiptName: '',
        receiptDate: '',
        contractBillCode: '',
        contractName: '',
        contractDate: '',
        contractDetailId: '',
        purchasePlanAssetName: '',
        specification: '',
        assetsType: '',
        price: '',
        purchaseNumber: '',
        totalPrice: '',
        unit: '',
        supplierName: '',
        arrivalDate: '',
        purchasePlayDate: '',
        factoryName: '',
        invoice: '',
        brand: '',
        petitionNo: '',
        serviceLife: '',
        type: '',
        contractId: ''
      },
      cgbmList: [],
      invoiceList: [],
      contractList: [],
      xihbgsbList: [
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 2
        }
      ],
      listRules: {
        serviceLife: [
          { required: true, message: '使用年限不能为空' }
          // { type: 'number', message: '使用年限必须为数字值' }
        ]
      }
    }
  },
  created() {
    this.operate = this.$route.query.type
    this.disabled = this.operate === 'detail'
    this.operate !== 'add' && this.getDetail(this.$route.query.id)
    this.formData.receiptDate = this.$formatDate(new Date())
    this.formData.receiptName = sessionStorage.getItem('user') || ''
    this.getContractList()
  },
  mounted() {},
  methods: {
    getContractList() {
      let parmas = {
        contract_bill_code: ''
      }
      getContractList(parmas).then(res => {
        if (res.status) {
          res.data.map(e => {
            e.label = e.contractBillCode
            e.value = e.id
            return e
          })
          this.cgbmList = res.data
        } else {
          this.$error(res.msg)
        }
      })
    },
    getFormData() {
      // console.log(this.formData.data)
    },
    handleBtnClick(res) {
      this[res] && this[res]()
    },
    save() {
      this.$refs.formList.validFormList(valid => {
        if (valid) {
          this.saveForm()
        } else {
          return false
        }
      })
    },
    saveForm() {
      let params = {
        brand: this.formData.brand,
        contractBillCode: this.formData.contractBillCode,
        contractDetailId: this.formData.contractDetailId,
        contractName: this.formData.contractName,
        factoryName: this.formData.factoryName,
        invoice: this.formData.invoice,
        contractId: this.formData.contractId,
        receiptDate: this.formData.receiptDate,
        receiptName: this.formData.receiptName,
        receiptNumber: this.formData.purchaseNumber,
        serviceLife: this.formData.serviceLife,
        type: this.formData.type
      }
      addAsset(params).then(res => {
        if (res.status) {
          this.$success('验收建账')
          this.$router.go(-1)
        }
      })
    },
    cancel() {
      this.$router.go(-1)
    },
    getDetail(id) {
      getReceiptDetail(id).then(res => {
        Object.keys(this.formData).forEach(e => {
          if (e !== 'id') {
            if (res.data.hasOwnProperty(e)) {
              this.formData[e] = res.data[e]
            }
          }
        })
      })
    },
    change(callback) {
      this[callback] && this[callback]()
    },
    changeBillCode() {
      debugger
      let params = {
        contract_id: this.formData.contractBillCode
      }
      let obj = this.cgbmList.filter(
        e => e.id === this.formData.contractBillCode
      )[0]
      this.formData.contractName = obj.contractName
      this.formData.contractDate = obj.contractDate
      this.formData.supplierName = obj.supplierName
      this.formData.arrivalDate = obj.arrivalDate
      this.formData.purchasePlayDate = obj.purchasePlayDate
      getAssetList(params).then(res => {
        if (res.data.length > 0) {
          res.data.map(e => {
            e.value = e.id
            e.label = e.purchasePlanAssetName
            return e
          })
        }
        this.contractList = res.data
      })
    },
    changecontract() {
      let obj = this.contractList.filter(
        e => e.id === this.formData.contractDetailId
      )[0]
      Object.keys(this.formData).forEach(e => {
        if (e !== 'id' && e !== 'type') {
          if (obj.hasOwnProperty(e)) {
            this.formData[e] = obj[e]
          }
        }
      })
      this.formData.assetsType = obj.type
      this.formData.contractId = obj.contractId
    }
  }
}
</script>

<style>
#assetacceptdetail {
  flex: 1;
  background-color: #fff;
  box-shadow: 0px 0px 21px 0px rgba(211, 219, 232, 0.5);
  border-radius: 4px;
}
</style>
