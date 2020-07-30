<template>
  <div id="AssetScrapRegisterDetail" ref="AssetScrapRegisterDetail" class="com-detail-wrap">
    <div class="detail-item">
      <div class="detail-head">
        <div class="tit">基本信息</div>
        <div class="btns">
          <el-button class="com-btn" type="info" @click="cancel" plain>返回</el-button>
          <el-button
            v-if="type === 'add' || type === 'edit' || this.status !== 2"
            class="com-btn"
            type="primary"
            @click="save"
            plain
          >保存</el-button>
          <!-- <el-button
            class="com-btn"
            v-if="type === 'add' || type === 'edit'"
            type="success"
            plain
          >导入</el-button> -->
          <el-button v-if="this.type === 'add'" class="com-btn" type="primary" @click="confirm" plain>确认</el-button>
          <el-button 
            class="com-btn" v-if="this.status === 1 || this.status === 2" @click="exportExcel" type="success" plain>导出</el-button>
        </div>
      </div>
      <div class="detail-content">
        <form-list
          ref="formList"
          :disabled="disabled"
          :datas="formData"
          @handle-cert-error="handleCertError"
          @handle-cert-remove="handleCertRemove"
          @handle-cert-change="handleCertChange"
          @handle-cert-success="handleCertSuccess"
          @handle-cert-preview="handleCertPreview"
          :form-config="formConfig"
        ></form-list>
      </div>
    </div>

    <div class="detail-item">
      <div class="detail-head">
        <div class="tit">表单信息</div>
        <div class="btns">
          <el-button v-if="!disabled" class="com-btn" type="primary" @click="tableAdd" plain>新增</el-button>
        </div>
      </div>
      <div class="detail-content">
        <edit-table :table-data="tableData" :table-height="tableHeight">
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
              <div v-if="!disabled && item.editable">
                <!-- 下拉框 -->
                <el-select v-model="scope.row[item.prop]" v-if="item.type === 'select'">
                  <el-option
                    :label="option.label"
                    :value="option.value"
                    :key="option.value"
                    v-for="option in item.options"
                  ></el-option>
                </el-select>
                <!-- 文本框 -->
                <el-input v-model="scope.row[item.prop]" v-else></el-input>
              </div>
              <div v-else>
                <div v-if="item.prop === 'status'">{{scope.row[item.prop] == '0' ? '启用' : '禁用'}}</div>
                <div v-else>{{scope.row[item.prop]}}</div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="150" align="center" fixed="right">
            <template slot-scope="scope">
              <div>
                <el-button type="text" @click="tableDel(scope.$index)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </edit-table>
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
      <asset-select-table v-if="dialogVisibleSupples" @handle-select="handlePopSelect"></asset-select-table>
    </el-dialog>
  </div>
</template>

<script>
import { uploadCert } from '../../../axios/common'
import FormList from '@/components/form/FormList'
import { dictMixin } from '../../../mixins/dictMixin'
import EditTable from '@/components/table/EditTable.vue'
import AssetSelectTable from '@/components/pop/AssetSelectTable.vue'
import { createUnusual, updateUnusual, confirmAddList } from './api'

export default {
  name: 'AssetScrapRegisterDetail',
  components: {
    FormList,
    EditTable,
    AssetSelectTable
  },
  mixins: [dictMixin],
  data() {
    return {
      listPath: '/teachasset/asset-handle/asset-abort-handle',
      // 页面类型
      type: '',
      status: '',
      // 基础表单是否禁用
      disabled: false,
      // 基础表单数据
      formData: {
        accessory: [],
        assetsNames: '',
        // assetsUnusualDetails: [],
        createId: 0,
        createName: '',
        createTime: '',
        remark: '',
        status: 1,
        unusualCode: '',
        unusualDate: ''
      },
      // 表格数据
      tableData: [],
      // 确认-表单数据
      confirmTable: [],
      // 表格高度
      tableHeight: 400,
      dialogVisibleSupples: false,
      selectArrAssetName: '' //table-select组件资产名称
    }
  },
  created() {
    // 初始化判断当前页面类型
    this.type = this.$route.query.type || 'add'
    // this.formData.unusualDate = sessionStorage.getItem('user') || ''
    if (this.type !== 'add') {
      // this.ids = this.$route.query.id
      let jsonObj = JSON.parse(localStorage.getItem('AssetAbortHandle'))
      this.status = jsonObj.status
      this.tableData = jsonObj.assetsUnusualDetails;
    }
  },
  mounted() {},
  methods: {
    // 保存
    save() {
      this.$refs.formList.validFormList(res => {
        if (res) {
          this.formConfig.cert.uploadCertNum !== 0
            ? this.submit()
            : this.saveForm()
        } else {
          return false
        }
      })
    },
    confirm() {
      if (!this.tableData.length) {
        this.$message.info('请至少新增一条表单信息')
        return
      }
      console.log(this.tableData);
      let id = this.tableData.id
      confirmAddList(id).then(res => {

      }).catch()
    },
    submit() {
      this.formConfig.cert.submitCert = this.formConfig.cert.uploadCertNum === 0
      this.$refs.formList.submit()
    },
    saveForm() {
      if (!this.tableData.length) {
        this.$message.info('请至少新增一条表单信息')
        return
      }
      let assetsUnusualDetails = this.tableData
      let accessory = JSON.stringify(this.formConfig.cert.addCertList)
      let params = {
        unusualDate: this.formData.unusualDate,
        remark: this.formData.remark,
        status: this.formData.status,
        createName: localStorage.getItem('user'),
        assetsUnusualDetails,
        accessory
      }
      console.log(params)
      console.log('type', this.type);
      // 编辑
      if (this.type === 'edit') {
        console.log('edit')
        let params = {}
        // getUnusualDetail(params).then().catch()
      } else {
        // 新增
        console.log('add');
        params['assets_names'] = this.selectArrAssetName;
        createUnusual(params).then(res => {
          if(res.status) {
            this.$router.push(this.listPath)
          }
        })
      }
    },
    // 取消，返回列表
    cancel() {
      this.$router.push(this.listPath)
    },
    // 表格新增
    tableAdd() {
      this.dialogVisibleSupples = true
      // 延时滚动到底部。
      setTimeout(() => {
        document.querySelector(
          '.detail-content .el-table__body-wrapper'
        ).scrollTop = document.querySelector(
          '.detail-content .el-table__body-wrapper'
        ).scrollHeight
      }, 50)
    },
    // 表格删除
    tableDel(index) {
      this.tableData.splice(index, 1)
    },
    handlePopSelect(res) {
      this.dialogVisibleSupples = false
      res['record_id'] = res.assetsId;
      this.tableData.push(res)
      this.confirmTable.push(res.data.list)

      console.log(this.tableData)
      let tempArr = this.tableData;
      let arrAssetName = [];
      for (let i = 0, len = tempArr.length; i < len; i++) {
        arrAssetName.push(tempArr[i].assetName);
      }
      this.selectArrAssetName = arrAssetName.join();
      // console.log(this.selectArrAssetName)
    },
    // 文件上传成功
    handleCertSuccess(response, file, fileList) {
      // debugger
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
    handleCertChange(file, fileList) {
      debugger
      if (fileList.length > 0) {
        this.formConfig.cert.uploadCert = true
      }
      this.formConfig.cert.uploadCertNum =
        fileList.length - this.formConfig.cert.uploadedCertNum
    },
    // 文件上传移除
    handleCertRemove(file, fileList) {
      debugger
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
    handleCertError(err, file, fileList) {
      debugger
      if (err.status === 401) {
        this.$router.push({ path: '/login' })
      }
      this.$message({
        message: err.msg,
        type: 'error'
      })
    },
    handleCertPreview(file) {
      // debugger
    },
    exportExcel() {}
  },
  computed: {
    // 基础表单配置
    formConfig() {
      return {
        labelWidth: '100px',
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
                  label: '单据编码',
                  type: 'text',
                  prop: 'unusualCode',
                  placeholder: '根据编码规则自动生成',
                  disabled: true
                },
                {
                  label: '处置日期',
                  type: 'dateTime',
                  prop: 'unusualDate',
                  placeholder: ''
                },
                {
                  label: '制单人',
                  type: 'text',
                  prop: 'createName',
                  placeholder: '',
                  disabled: true
                },
                {
                  label: '计划状态',
                  type: 'select',
                  prop: 'status',
                  disabled: true,
                  options: [
                    {
                      label: '待确认',
                      value: 1
                    },
                    {
                      label: '已确认',
                      value: 2
                    }
                  ]
                }
              ],
              [
                {
                  label: '备注',
                  type: 'textarea',
                  prop: 'remark',
                  span: 12,
                  placeholder: ''
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
          prop: 'assetCode',
          label: '资产编号',
          editable: false // 是否可编辑
        },
        {
          prop: 'assetName',
          label: '资产名称'
        },
        {
          prop: 'price',
          label: '资产原值'
        },
        {
          prop: 'currentPrice',
          label: '资产净值'
        },
        {
          prop: 'specification',
          label: '规格型号'
        },
        {
          prop: 'unit',
          label: '计量单位'
        },
        {
          prop: 'userDepartment',
          label: '使用部门'
        },
        {
          prop: 'userName',
          label: '使用人'
        },
        {
          prop: 'type',
          label: '资产类型'
        }
      ]
    }
  },
  watch: {
    status() {
      this.disabled = this.status === 2
    }
  }
}
</script>

<style scoped lang="less">
</style>
