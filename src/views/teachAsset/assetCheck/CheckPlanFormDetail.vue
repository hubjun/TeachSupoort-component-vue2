<template>
  <div id="CheckPlanFormDetail" ref="CheckPlanFormDetail" class="com-detail-wrap">
    <div class="detail-item">
      <div class="detail-head">
        <div class="tit">基本信息</div>
        <div class="btns">
          <el-button class="com-btn" type="info" @click="cancel" plain>返回</el-button>
          <el-button class="com-btn" type="success" @click="exportExcel()" plain>导出</el-button>
          <el-button v-if="type === 'add' || type === 'edit' || type === 'detail'" class="com-btn" type="primary" @click="save" plain>保存</el-button>
          <el-button v-if="type === 'detail'" class="com-btn" type="primary" @click="confirm" plain>确认</el-button>
        </div>
      </div>
      <div class="detail-content">
        <form-list ref="formList" :disabled="disabled" :datas="formData" :form-config="formConfig"></form-list>
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
              :width="item.width" :key="index" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div v-if="item.editable">
                <!-- 下拉框 -->
                <el-select v-model="scope.row[item.prop]" v-if="item.type === 'select'">
                  <el-option :label="option.label" :value="option.value" :key="option.value" v-for="option in item.options"></el-option>
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
        </edit-table>
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
  import { createCheckPlan, getCheckPlanListDetails, confirmPlanListInfo } from './api';
  import { BASE_URL } from '@/axios/Global';

  export default {
    name: 'CheckPlanFormDetail',
    components: {
      FormList,
      EditTable,
      AssetSelectTable
    },
    mixins: [dictMixin],
    data() {
      return {
        listPath: '/teachasset/asset-check/check-plan-form',
        id: '', //列表-详情id
        // 页面类型
        type: '',
        // 基础表单是否禁用
        disabled: false,
        // 基础表单数据
        formData: {
          assetsCheckDetails: [],
          assetsNames: '',
          checkCode: '',
          checkDate: '',
          checkUserId: 0,
          checkUserName: '',
          createBy: '',
          createTime: '',
          remark: '',
          updateBy: '',
          updateTime: '',
          useDepartmentId: 0,
          useDepartmentName: ''
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
        this.id = this.$route.query.id
        this.getCheckFormInfo(this.id)
        // this.formData = JSON.parse(localStorage.getItem('CheckPlanForm'))
      }
    },
    mounted() {
      if(this.type === 'add') {
        let now = new Date()
        let yyyy = now.getFullYear()
        let mm = now.getMonth() < 9 ? ('0' + (now.getMonth() + 1)) : (now.getMonth() + 1)
        let dd = now.getDate() < 10 ? ('0' + now.getDate()) : now.getDate()
        this.formData.checkDate = `${yyyy}-${mm}-${dd}`
      }
    },
    methods: {
      // 保存
      save() {
        this.$refs.formList.validFormList((res) => {
          if(res) {
            let params = {
              assetsCheckDetails: this.tableData,
              checkDate: this.formData.checkDate,
              useDepartmentName: this.formData.useDepartmentName,
              remark: this.formData.remark
            }
            console.log(params);
            // 新增
            createCheckPlan(params).then(res => {
              this.$message({message: '保存成功', type: 'success'})
              this.$router.push(this.listPath)
            })
          }
        })
      },
      confirm() {
        let id = this.id
        confirmPlanListInfo(id).then(res => {
          if (res.status) {
            this.$message({message: '确认成功', type: 'success'})
            this.$router.push(this.listPath)
          }
        }).catch()
      },
      getCheckFormInfo(id) {
        getCheckPlanListDetails(id).then(res => {
          if (res.status) {
            this.formData = res.data
            this.tableData = res.data.assetsCheckDetails
          } else {
            this.$message.error(res.msg)
          }
        }).catch()
      },
      // 取消，返回列表
      cancel() {
        this.$router.push(this.listPath)
      },
      // 表格新增
      tableAdd() {
        this.dialogVisibleSupples = true
      },
      // 表格删除
      tableDel(index) {
        this.tableData.splice(index, 1)
      },
      handlePopSelect(res) {
        this.dialogVisibleSupples = false
        this.tableData.push({
          assetCode: res.assetCode,
          assetId: res.assetsId,
          assetName: res.assetName,
          assetType: res.assetType,
          assetsScrapsId: res.assetsScrapsId,
          createTime: res.createTime,
          id: res.assetsId,
          price: res.price,
          storeAdd: res.storeAdd,
          type: res.type,
          updateTime: res.updateTime,
          userDepartment: res.userDepartment,
          userDepartmentId: res.userDepartmentId,
          userName: res.userName,
          userNameId: res.userNameId,
          unit: res.unit,
          specification: res.specification,
          assetsCheckId: res.assetsCheckId,
          assetsRecordId: res.assetsRecordId,
          createBy: res.createBy,
          status: res.status,
          updateBy: res.updateBy
        })
        // console.log(this.tableData)
      },
      exportExcel() {
        let tdata = this.tableData;
        let token = sessionStorage.getItem('TOKEN');
        if (tdata.length) {
          let _ids = [];
          for (let i = 0, len = tdata.length; i < len; i++) {
            _ids.push(tdata[i].id)
          }
          let ids = _ids.join();
          const url = BASE_URL + '/assets/assets-check/v1/export';
          window.open(`${url}?ids=${ids}&TOKEN=${token}`);
        }else {
          this.$message('表单信息为空，不能导出');
        }
      }
    },
    computed: {
      // 基础表单配置
      formConfig() {
        return {
          labelWidth: '100px',
          cert: {
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
          config: [
            {
              label: ' 基本信息',
              props: [
                [
                  {
                    label: '单据编码',
                    type: 'text',
                    prop: 'checkCode',
                    placeholder: '根据编码规则自动生成',
                    disabled: true
                  },
                  {
                    label: '盘点人',
                    type: 'text',
                    prop: 'checkUserName',
                    placeholder: '',
                    disabled: true
                  },
                  {
                    label: '盘点日期',
                    type: 'date',
                    prop: 'checkDate',
                    placeholder: '日期选择'
                  },
                  {
                    label: '使用部门',
                    type: 'text',
                    prop: 'useDepartmentName',
                    placeholder: '默认当前用户'
                  }
                ],
                [
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
      // 表格配置
      tableConfig() {
        return [
          {
            prop: 'assetCode',
            label: '资产编号'
          },
          {
            prop: 'assetName',
            label: '资产名称'
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
            prop: 'assetType',
            label: '资产类型'
          },
          {
            label: '资产状态',
            type: 'select',
            prop: 'status',
            editable: true,
            options: [
              {
                label: '正常',
                value: 1
              },
              {
                label: '缺失',
                value: 2
              }
            ]
          }
        ]
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
