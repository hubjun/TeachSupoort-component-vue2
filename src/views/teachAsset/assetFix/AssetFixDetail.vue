<template>
  <div id="AssetFixDetail" ref="AssetFixDetail" class="com-detail-wrap">
    <div class="detail-item">
      <div class="detail-head">
        <div class="tit">基本信息</div>
        <div class="btns">
          <el-button class="com-btn" type="info" @click="cancel" plain>返回</el-button>
          <el-button v-if="type === 'add' || type === 'edit'" class="com-btn" type="primary" @click="save" plain>保存</el-button>
          <el-button v-if="type !== 'add'" class="com-btn" type="success" plain>导出</el-button>
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
            :form-config="formConfig"></form-list>
      </div>
    </div>

    <div class="detail-item">
      <div class="detail-head">
        <div class="tit">资产信息</div>
        <div class="btns">
          <el-button class="com-btn" type="primary" @click="assetSelect" plain>选择资产</el-button>
        </div>
      </div>
      <div class="detail-content">
        <form-list :disabled="disabled" :datas="formData" :form-config="assetForm"></form-list>
      </div>
    </div>

    <el-dialog
        :visible.sync="dialogVisibleSupples"
        :close-on-click-modal="false"
        width="1200px"
        :center="true">
      <div slot="title" class="dialog-title">
        <span>资产列表</span>
      </div>
      <asset-select-table v-if="dialogVisibleSupples" @handle-select="handlePopSelect"></asset-select-table>
    </el-dialog>
  </div>
</template>

<script>
  import { uploadCert } from '../../../axios/common';
  import FormList from '@/components/form/FormList'
  import { dictMixin } from '../../../mixins/dictMixin';
  import EditTable from '@/components/table/EditTable.vue';
  import AssetSelectTable from '@/components/pop/AssetSelectTable.vue';
  import { createFix, updateFix, getFixDetail } from './api';

  export default {
    name: 'AssetFixDetail',
    components: {
      FormList,
      EditTable,
      AssetSelectTable
    },
    mixins: [dictMixin],
    data() {
      return {
        listPath: '/teachasset/asset-fix/asset-fix',
        // 页面类型
        type: '',
        // 基础表单是否禁用
        disabled: false,
        // 基础表单数据
        formData: {
          maintenanceCode: '', // 单据编码
          maintenanceDate: '', // 维修日期
          updateBy: '', // 制单人
          updateTime: '',  // 制单日期
          maintenanceDepartmentName: '', // 维修部门
          maintenanceUser: '', // 维修人
          maintenancePrice: 0, // 维修金额
          maintenanceContent: '', // 维修内容
          remark: '', // 备注

          assetsRecordId: '', // 资产id
          assetCode: '',
          assetName: '',
          type: '',
          specification: '',
          unit: '',
          userName: '',
          userDepartment: ''
        },
        // 表格数据
        tableData: [],
        // 表格高度
        tableHeight: 400,
        dialogVisibleSupples: false
      }
    },
    created() {
      // 初始化判断当前页面类型
      this.type = this.$route.query.type || 'add'
      if(this.type !== 'add') {
        this.ids = this.$route.query.id
        this.getData()
      }
    },
    mounted() {
      if(this.type === 'add') {
        let now = new Date()
        let yyyy = now.getFullYear()
        let mm = now.getMonth() < 9 ? ('0' + (now.getMonth() + 1)) : (now.getMonth() + 1)
        let dd = now.getDate() < 10 ? ('0' + now.getDate()) : now.getDate()
        this.formData.maintenanceDate = `${yyyy}-${mm}-${dd}`
      }
    },
    methods: {
      // 查询详情
      getData() {
        getFixDetail(this.ids).then(res => {
          this.formData = res.data
          this.formConfig.cert.certFileList = []
          res.data.fileInfo.forEach((item) => {
            this.formConfig.cert.certFileList.push({
              name: item.fileName,
              url: item.url,
              id: item.id
            })
            this.formConfig.cert.addCertList.push(item.id)
          })
          this.formConfig.cert.uploadedCertNum = res.data.fileInfo.length
          this.formConfig.cert.submitCert = res.data.fileInfo.length > 0
        })
      },
      // 保存
      save() {
        if(this.formData.assetsRecordId === '') {
          this.$message({
            type: 'error',
            message: '请添加资产信息'
          })
          return;
        }

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
      submit() {
        this.formConfig.cert.submitCert = this.formConfig.cert.uploadCertNum === 0
        this.$refs.formList.submit()
      },
      saveForm() {
        let fileId = this.formConfig.cert.addCertList
        let params = {
          assetsRecordId: this.formData.assetsRecordId, // 资产名称
          maintenanceDate: this.formData.maintenanceDate, // 维修日期
          maintenanceDepartmentName: this.formData.maintenanceDepartmentName, // 维修部门
          maintenancePrice: this.formData.maintenancePrice, // 维修金额
          maintenanceUser: this.formData.maintenanceUser, // 维修人
          maintenanceContent: this.formData.maintenanceContent, // 维修内容
          remark: this.formData.remark, // 备注
          fileId
        }
        console.log(params)
        // 编辑
        if (this.type === 'edit') {
          // })
          params.id = this.ids
          updateFix(params).then(res => {
            this.$message(res.msg)
            this.$router.push(this.listPath)
          })
        } else {
          // 新增
          createFix(params).then(res => {
            // this.$message(res.msg)
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
      handlePopSelect(res) {
        let flag = false
        if (this.tableData.length > 0) {
          flag = this.tableData.some(e => e.assetCode === res.assetCode)
        }
        if (flag) {
          this.$info('重复选中，请重新勾选')
          return false
        }

        this.dialogVisibleSupples = false

        // 将资产信息合并到当前表单上.
        Object.keys(this.formData).forEach((i) => {
          if(i !== 'id') {
            if(res.hasOwnProperty(i)) {
              this.formData[i] = res[i]
            }
          }
        })
        // 设置资产id
        this.formData.assetsRecordId = res.assetsId
      },
      assetSelect() {
        this.dialogVisibleSupples = true
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
        if (fileList.length > 0) {
          this.formConfig.cert.uploadCert = true
        }
        this.formConfig.cert.uploadCertNum =
          fileList.length - this.formConfig.cert.uploadedCertNum
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
      handleCertError(err, file, fileList) {
        if (err.status === 401) {
          this.$router.push({ path: '/login' })
        }
        this.$message({
          message: err.msg,
          type: 'error'
        })
      },
      handleCertPreview(file) {}
    },
    computed: {
      // 基础表单配置
      formConfig() {
        return {
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
                    prop: 'maintenanceCode',
                    placeholder: '根据编码规则自动生成',
                    disabled: true
                  },
                  {
                    label: '维修日期',
                    type: 'date',
                    prop: 'maintenanceDate',
                    placeholder: ''
                  },
                  {
                    label: '制单人',
                    type: 'text',
                    prop: 'createBy',
                    placeholder: '默认当前用户',
                    disabled: true
                  },
                  {
                    label: '维修部门',
                    type: 'text',
                    prop: 'maintenanceDepartmentName',
                    placeholder: ''
                  },
                  {
                    label: '维修人',
                    type: 'text',
                    prop: 'maintenanceUser',
                    placeholder: ''
                  },
                  {
                    label: '维修金额',
                    type: 'unit',
                    inputType: 'number',
                    unit: '元',
                    prop: 'maintenancePrice',
                    placeholder: ''
                  }
                ],
                [
                  {
                    label: '维修内容',
                    type: 'textarea',
                    prop: 'maintenanceContent',
                    span: 12,
                    placeholder: '备注信息'
                  },
                  {
                    label: '备注',
                    type: 'textarea',
                    prop: 'remark',
                    span: 12,
                    placeholder: '备注信息'
                  }
                ]
              ]
            }
          ]
        }
      },
      assetForm() {
        return {
          labelWidth: '100px',
          config: [
            {
              label: ' 资产信息',
              props: [
                [
                  {
                    label: '资产编号',
                    type: 'text',
                    prop: 'assetCode',
                    placeholder: '',
                    disabled: true
                  },
                  {
                    label: '资产名称',
                    type: 'text',
                    prop: 'assetName',
                    placeholder: '',
                    disabled: true
                  },
                  {
                    label: '资产类型',
                    type: 'text',
                    prop: 'type',
                    placeholder: '',
                    disabled: true
                  },
                  {
                    label: '规格型号',
                    type: 'text',
                    prop: 'specification',
                    placeholder: '',
                    disabled: true
                  },
                  {
                    label: '计量单位',
                    type: 'text',
                    prop: 'unit',
                    placeholder: '',
                    disabled: true
                  },
                  {
                    label: '使用人',
                    type: 'text',
                    prop: 'userName',
                    placeholder: '',
                    disabled: true
                  },
                  {
                    label: '使用部门',
                    type: 'text',
                    prop: 'userDepartment',
                    placeholder: '',
                    disabled: true
                  }
                ]
              ]
            }
          ]
        }
      }
    },
    watch: {
      type() {
        this.disabled = this.type === 'detail'
      }
    }
  }
</script>

<style scoped lang="less">

</style>
