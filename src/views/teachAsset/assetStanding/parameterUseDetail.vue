<template>
  <div id="parameterUseDetail" ref="parameterUseDetail" class="com-detail-wrap">
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
        >
          <template slot="qrcodes" v-if="operate !== 'add'">
            <div class="form-content">
              <div class="form-lable" :style="{width:formConfig.labelWidth}">二维码：</div>
              <div class="form-img">
                <img :src="assetQrcodes.url" alt />
              </div>
            </div>
          </template>
        </form-list>
      </div>
    </div>
    <div class="detail-item" v-if="operate !=='add'">
      <div class="detail-head">
        <div class="tit">资产履历</div>
      </div>
      <div class="detail-content">
        <ul class="tab-list">
          <li
            @click="active = index + 1"
            :class="{'active':active === index+1}"
            v-for="(item,index) in tabList"
            :key="index"
          >{{item}}</li>
        </ul>
        <table-component :tableHeight="assets.tableHeight" :tableData="assets.tableData">
          <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
          <el-table-column
            v-for="(item,index) in assets.tableColumn"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            align="center"
            :sortable="item.sortable"
            :show-overflow-tooltip="true"
          ></el-table-column>
        </table-component>
      </div>
    </div>
  </div>
</template>

<script>
import {
  addAssetsRecord,
  updateAssetsRecord,
  wxbyList,
  zcclycList,
  zcclbfList,
  zcdbList,
  zclyList,
  zcyjList
} from './api'
import FormList from '@/components/form/FormList'
import { uploadUrl, uploadCert } from '@/axios/common'
import { BASE_URL, urlName1 } from '@/axios/Global'
import { dictMixin } from '../../../mixins/dictMixin'
import tableComponent from '@/components/table/table_2'
import searchBtn from '@/components/button/searchBtn'
import resetBtn from '@/components/button/resetBtn'
import tablePagination from '@/components/tableGroup/TablePagination'
export default {
  components: {
    FormList,
    tableComponent,
    searchBtn,
    resetBtn,
    tablePagination
  },
  mixins: [dictMixin],
  watch: {
    type() {
      this.type === 'detail' &&
        this.formConfig.config[0].props.map(e => {
          e['disabled'] = true
        })
    },
    active() {
      this.active === 1 && this.getzclyList(this.formData.id)
      this.active === 2 && this.getzcyjList(this.formData.id)
      this.active === 3 && this.getzcdbList(this.formData.id)
      this.active === 4 && this.getwxbyList(this.formData.id)
      this.active === 5 && this.getzcclbfList(this.formData.id)
      this.active === 5 && this.getzcclycList(this.formData.id)
    }
  },
  computed: {
    formConfig() {
      return {
        labelWidth: '110px',
        deleteList: [], // 用于删除图片
        picture: {
          show: true,
          pictureLabel: '资产图片',
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
        config: [
          {
            label: ' 基本信息',
            props: [
              [
                {
                  label: '资产编码',
                  type: 'text',
                  prop: 'assetCode',
                  disabled: true,
                  placeholder: '自动生成'
                },
                {
                  label: '资产名称',
                  type: 'text',
                  prop: 'assetName',
                  placeholder: '请输入资产名称'
                },
                {
                  label: '规格型号',
                  type: 'text',
                  prop: 'specification',
                  placeholder: '请输入规格型号'
                },
                {
                  label: '资产类型',
                  type: 'select',
                  prop: 'assetTypeId',
                  placeholder: '请输入资产类型',
                  options: this.mxAssetType
                },
                {
                  label: '计量单位',
                  type: 'text',
                  prop: 'unit',
                  placeholder: '请输入计量单位'
                },
                {
                  label: '批件号',
                  type: 'text',
                  prop: 'petitionNo',
                  placeholder: '请输入批件号'
                },
                {
                  label: '采购日期',
                  type: 'dateTime',
                  prop: 'purchaseDate',
                  placeholder: '日期选择'
                },
                {
                  label: '验收建账人员',
                  type: 'text',
                  prop: 'receiptName',
                  placeholder: '请输入验收建账人员'
                },
                {
                  label: '验收建账日期',
                  type: 'dateTime',
                  prop: 'receiptDate',
                  disabled: this.operate === 'edit',
                  placeholder: '日期选择'
                },
                {
                  label: '管理部门',
                  type: 'text',
                  prop: 'department',
                  disabled: true,
                  placeholder: '请输入管理部门'
                },
                {
                  label: '使用人员',
                  type: 'text',
                  prop: 'userName',
                  disabled: true,
                  placeholder: '自动生成'
                },
                {
                  label: '使用部门',
                  type: 'select',
                  prop: 'userDepartmentId',
                  placeholder: '请选择使用部门',
                  options: this.mxDepartlist
                },
                {
                  label: '采购合同编码',
                  type: 'text',
                  prop: 'contractBillCode',
                  placeholder: '请输入采购合同编码'
                },
                {
                  label: '合同名称',
                  type: 'text',
                  prop: 'contractName',
                  placeholder: '请输入合同名称'
                },
                {
                  label: '合同签订日期',
                  type: 'dateTime',
                  prop: 'contractDate',
                  placeholder: '日期选择'
                },
                {
                  label: '供应商',
                  type: 'text',
                  prop: 'supplierName',
                  placeholder: '请输入供应商'
                },
                {
                  label: '到货日期',
                  type: 'dateTime',
                  prop: 'arrivalDate',
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
                  label: '存放地点',
                  type: 'text',
                  prop: 'storeAdd',
                  placeholder: '请输入存放地点'
                },
                {
                  label: '使用年限(年)',
                  type: 'number',
                  prop: 'serviceLife',
                  disabled: this.operate === 'edit',
                  placeholder: '请输入使用年限'
                },
                {
                  label: '资产状态',
                  type: 'select',
                  prop: 'status',
                  disabled: true,
                  placeholder: '请选择',
                  options: this.mxAssetStatus
                },
                {
                  label: '资产原值(元)',
                  type: 'number',
                  prop: 'price',
                  disabled: this.operate === 'edit',
                  placeholder: '请输入资产原值'
                },
                {
                  label: '资产净值(元)',
                  type: 'text',
                  prop: 'currentPrice',
                  placeholder: '请输入资产净值'
                },
                {
                  label: '折旧方法',
                  type: 'select',
                  prop: 'depreciation',
                  options: this.mxDepreciationFuc
                },
                {
                  label: '信息化办公设备',
                  type: 'select',
                  prop: 'typeDevice',
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
        assetCode: '',
        assetName: '',
        specification: '',
        assetTypeId: '',
        unit: '',
        petitionNo: '',
        purchaseDate: '',
        receiptName: '',
        receiptDate: '',
        department: '教保处',
        userName: '',
        userDepartmentId: '',
        contractBillCode: '',
        contractName: '',
        contractDate: '',
        supplierName: '',
        arrivalDate: '',
        factoryName: '',
        invoice: '',
        storeAdd: '',
        serviceLife: '',
        status: 3,
        price: '',
        currentPrice: '',
        depreciation: '',
        id: null,
        typeDevice: ''
      },
      active: 1,
      assets: {
        tableData: [],
        tableHeight: 400,
        tableColumn: [
          {
            prop: 'receiptCode',
            label: '资产编号',
            sortable: false
          },
          {
            prop: 'contractName',
            label: '资产名称',
            sortable: true
          },
          {
            prop: 'supplierName',
            label: '管理部门',
            sortable: false
          },
          {
            prop: 'receiptDate',
            label: '使用部门',
            sortable: false
          },
          {
            prop: 'purchasePlanAssetName',
            label: '业务操作',
            sortable: false
          },
          {
            prop: 'receiptNumber',
            label: '业务操作人',
            sortable: false
          },
          {
            prop: 'price',
            label: '操作时间',
            sortable: false
          },
          {
            prop: 'price',
            label: '操作单据号',
            sortable: false
          }
        ]
      },
      listRules: {
        serviceLife: [{ required: true, message: '使用年限不能为空' }],
        price: [{ required: true, message: '资产原值不能为空' }]
        // : [
        //   {
        //     required: true,
        //     message: '请输入单据编码',
        //     trigger: 'blur'
        //   }
        // ]
      },
      tabList: [
        '所有',
        '资产领用',
        '资产移交',
        '资产调拨',
        '维修保养',
        '资产处置'
      ],
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
      deleteIdList: [],
      assetQrcodes: {
        url: ''
      }
    }
  },
  async created() {
    await this.getAssetTypeList().then(res => {
      this.getDepartList().then(res => {
        this.formData.receiptDate = this.$formatDate(new Date())
        this.operate = this.$route.query.type
        this.formData.userName = sessionStorage.getItem('user') || ''
        // this.formData.status = 1
        this.operate !== 'add' && this.getDetail()
      })
    })
  },
  mounted() {},
  methods: {
    getFormData() {
      // console.log(this.formData.data)
    },
    handleBtnClick(res) {
      this[res] && this[res]()
    },
    getDetail() {
      let obj = this.$store.state.parameter.parameter
      obj =
        JSON.stringify(obj) !== '{}'
          ? obj
          : JSON.parse(sessionStorage.getItem('parameter'))
      Object.keys(this.formData).forEach(e => {
        if (e) {
          if (obj.hasOwnProperty(e)) {
            this.formData[e] = obj[e]
          }
        }
      })
      // this.formData.assetTypeId = this.formData.assetTypeId ? this.mxAssetStatus.filter(e => e.value === obj.type)[0].label:''
      this.formData.userDepartmentId = parseFloat(this.formData.userDepartmentId)
      // this.formData.assetTypeId = obj.type ? this.mxAssetType.filter(e => e.label === obj.type)[0].value : ''
      this.assetQrcodes.url = obj.assetQrcodes.url
      this.getzclyList(this.formData.id)
      if (this.operate === 'edit') {
        this.formConfig.picture.imgFileList = []
        this.formConfig.cert.certFileList = []
        this.formConfig.picture.addImgList = []
        this.formConfig.cert.addCertList = []
        if (obj.accessorys && obj.accessorys.length > 0) {
          obj.accessorys.forEach(e => {
            this.formConfig.cert.certFileList.push({
              name: e.fileName,
              url: e.url,
              id: e.id
            })
            this.formConfig.cert.addCertList.push(e.id)
          })
        }
        if (obj.assetImgs && obj.assetImgs.length > 0) {
          obj.assetImgs.forEach(e => {
            this.formConfig.picture.imgFileList.push({
              name: e.fileName,
              url: e.url,
              id: e.id
            })
            this.formConfig.picture.addImgList.push(e.id)
          })
        }
        this.formConfig.picture.uploadedImgNum = obj.assetImgs.length
        this.formConfig.cert.uploadedCertNum = obj.accessorys.length
        this.formConfig.picture.submitImg = obj.assetImgs.length > 0
        this.formConfig.cert.submitCert = obj.accessorys.length > 0
      } else {
        this.formConfig.picture.detailImgList = obj.assetImgs
        this.formConfig.cert.detailCertList = obj.accessorys
      }
    },
    // 维修保养
    getwxbyList(id) {
      this.assets.tableColumn = [
        {
          prop: 'assetCode',
          label: '资产编号',
          sortable: false
        },
        {
          prop: 'assetName',
          label: '资产名称',
          sortable: false
        },
        {
          prop: 'department',
          label: '管理部门',
          sortable: false
        },
        {
          prop: 'userDepartment',
          label: '使用部门',
          sortable: false
        },
        {
          prop: 'userName',
          label: '使用人',
          sortable: false
        },
        {
          prop: 'maintenanceDepartmentName',
          label: '维修部门',
          sortable: false
        },
        {
          prop: 'operate',
          label: '业务操作',
          sortable: false
        },
        {
          prop: 'maintenanceUser',
          label: '维修人',
          sortable: false
        },
        {
          prop: 'maintenanceDate',
          label: '维修日期',
          sortable: false
        },
        {
          prop: 'maintenanceCode',
          label: '操作单据号',
          sortable: false
        }
      ]
      wxbyList(id).then(res => {
        if (res.status) {
          if (res.data.length > 0) {
            res.data.map(e => {
              e['operate'] = '维修'
              return e
            })
          }
          this.assets.tableData = res.data
        }
      })
    },
    // 资产处理报废
    getzcclbfList(id) {
      this.assets.tableColumn = [
        {
          prop: 'assetCode',
          label: '资产编号',
          sortable: false
        },
        {
          prop: 'assetName',
          label: '资产名称',
          sortable: false
        },
        {
          prop: 'department',
          label: '管理部门',
          sortable: false
        },
        {
          prop: 'userDepartment',
          label: '使用部门',
          sortable: false
        },
        {
          prop: 'userName',
          label: '使用人',
          sortable: false
        },
        {
          prop: 'operate',
          label: '业务操作',
          sortable: false
        },
        {
          prop: 'registerName',
          label: '业务操作人',
          sortable: false
        },
        {
          prop: 'registerDate',
          label: '处置日期',
          sortable: false
        },
        {
          prop: 'scrapCode',
          label: '操作单据号',
          sortable: false
        }
      ]
      zcclbfList(id).then(res => {
        if (res.status) {
          if (res.data.length > 0) {
            res.data.map(e => {
              e['operate'] = '报废'
              return e
            })
          }
          this.assets.tableData = res.data
        }
      })
    },
    // 资产处理异常
    getzcclycList(id) {
      this.assets.tableColumn = [
        {
          prop: 'assetCode',
          label: '资产编号',
          sortable: false
        },
        {
          prop: 'assetName',
          label: '资产名称',
          sortable: false
        },
        {
          prop: 'department',
          label: '管理部门',
          sortable: false
        },
        {
          prop: 'userDepartment',
          label: '使用部门',
          sortable: false
        },
        {
          prop: 'userName',
          label: '使用人',
          sortable: false
        },
        {
          prop: 'operate',
          label: '业务操作',
          sortable: false
        },
        {
          prop: 'receiptName',
          label: '业务操作人',
          sortable: false
        },
        {
          prop: 'receiptDate',
          label: '处置日期',
          sortable: false
        },
        {
          prop: 'unusualCode',
          label: '操作单据号',
          sortable: false
        }
      ]
      zcclycList(id).then(res => {
        if (res.status) {
          if (res.data.length > 0) {
            res.data.map(e => {
              e['operate'] = '异常'
              return e
            })
          }
          this.assets.tableData = res.data
        }
      })
    },
    // 资产调拨
    getzcdbList(id) {
      this.assets.tableColumn = [
        {
          prop: 'assetCode',
          label: '资产编号',
          sortable: false
        },
        {
          prop: 'assetName',
          label: '资产名称',
          sortable: false
        },
        {
          prop: 'department',
          label: '管理部门',
          sortable: false
        },
        {
          prop: 'outDep',
          label: '调出部门',
          sortable: false
        },
        {
          prop: 'inDep',
          label: '调入部门',
          sortable: false
        },
        {
          prop: 'operate',
          label: '业务操作',
          sortable: false
        },
        {
          prop: 'applyMan',
          label: '申请人',
          sortable: false
        },
        {
          prop: 'confirmMan',
          label: '确认人',
          sortable: false
        },
        {
          prop: 'approvalMan',
          label: '审批人',
          sortable: false
        },
        {
          prop: 'applyDate',
          label: '调拨日期',
          sortable: false
        },
        {
          prop: 'allocateCode',
          label: '操作单据号',
          sortable: false
        }
      ]
      zcdbList(id).then(res => {
        if (res.status) {
          if (res.data.length > 0) {
            res.data.map(e => {
              e['operate'] = '调拨'
              return e
            })
          }
          this.assets.tableData = res.data
        }
      })
    },
    // 资产领用
    getzclyList(id) {
      this.assets.tableColumn = [
        {
          prop: 'assetCode',
          label: '资产编号',
          sortable: false
        },
        {
          prop: 'assetName',
          label: '资产名称',
          sortable: false
        },
        {
          prop: 'department',
          label: '管理部门',
          sortable: false
        },
        {
          prop: 'reqDep',
          label: '使用部门',
          sortable: false
        },
        {
          prop: 'operate',
          label: '业务操作',
          sortable: false
        },
        {
          prop: 'reqMan',
          label: '领用人',
          sortable: false
        },
        {
          prop: 'reqDate',
          label: '领用日期',
          sortable: false
        },
        {
          prop: 'reqCode',
          label: '操作单据号',
          sortable: false
        }
      ]
      zclyList(id).then(res => {
        if (res.status) {
          if (res.data.length > 0) {
            res.data.map(e => {
              e['operate'] = '领用'
              return e
            })
          }
          this.assets.tableData = res.data
        }
      })
    },
    // 资产移交
    getzcyjList(id) {
      this.assets.tableColumn = [
        {
          prop: 'price',
          label: '资产编号',
          sortable: false
        },
        {
          prop: 'assetName',
          label: '资产名称',
          sortable: false
        },
        {
          prop: 'department',
          label: '管理部门',
          sortable: false
        },
        {
          prop: 'handoverDep',
          label: '使用部门',
          sortable: false
        },
        {
          prop: 'operate',
          label: '业务操作',
          sortable: false
        },
        {
          prop: 'handoverMan',
          label: '移交人',
          sortable: false
        },
        {
          prop: 'receiveMan',
          label: '接收人',
          sortable: false
        },
        {
          prop: 'handoverDate',
          label: '移交日期',
          sortable: false
        },
        {
          prop: 'handoverCode',
          label: '操作单据号',
          sortable: false
        }
      ]
      zcyjList(id).then(res => {
        if (res.status) {
          if (res.data.length > 0) {
            res.data.map(e => {
              e['operate'] = '移交'
              return e
            })
          }
          this.assets.tableData = res.data
        }
      })
    },
    save() {
      this.$refs.formList.validFormList(valid => {
        if (valid) {
          this.formConfig.picture.uploadImgNum !== 0 ||
          this.formConfig.cert.uploadCertNum !== 0
            ? this.submit()
            : this.saveForm()
        } else {
          return false
        }
      })
    },
    submit() {
      this.formConfig.picture.submitImg =
        this.formConfig.picture.uploadImgNum === 0
      this.formConfig.cert.submitCert = this.formConfig.cert.uploadCertNum === 0
      this.$refs.formList.submit()
    },
    saveForm() {
      debugger
      let assetImg = JSON.stringify(this.formConfig.picture.addImgList)
      let accessory = JSON.stringify(this.formConfig.cert.addCertList)
      this.formData.userDepartmentId = parseFloat(this.formData.userDepartmentId)
      this.formData.assetTypeId = parseFloat(this.formData.assetTypeId)
      if (this.formData.userDepartmentId) {
        this.formData['userDepartment'] = this.mxDepartlist.filter(e => {
          return e.value === this.formData.userDepartmentId
        })[0].label
      }
      if (this.formData.assetTypeId) {
        this.formData['type'] = this.mxAssetType.filter(e => {
          return e.value === this.formData.assetTypeId
        })[0].label
      }
      let params = {
        ...this.formData,
        assetImg,
        accessory
      }
      if (this.operate === 'add') {
        addAssetsRecord(params).then(res => {
          if (res.status) {
            this.$success('新增台账')
            this.$router.go(-1)
          }
        })
      } else {
        updateAssetsRecord(params).then(res => {
          if (res.status) {
            this.$success('修改台账')
            this.$router.go(-1)
          }
        })
      }
    },
    cancel() {
      this.$router.go(-1)
    },
    // 文件上传成功
    handleSuccess(response, file, fileList) {
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
        // this.deleteIdList.push(file.id)
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
        // this.deleteIdList.push(file.id)
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
    handleCertPreview(file) {
    },
    // 文件上传之前做文件大小校验
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 10MB!')
      }
      return isLt2M
    },
    checkboxChange(event, item) {}
  },
  beforeDestroy() {
    sessionStorage.removeItem('parameter')
  }
}
</script>

<style  lang='less'>
#parameterUseDetail {
  height: calc(100% - 60px);
  overflow-y: auto;
}
</style>
