<template>
  <div id="assetHandOverDetail" ref="assetHandOverDetail" class="com-detail-wrap">
    <div class="detail-item">
      <div class="detail-head">
        <div class="tit">基本信息</div>
        <div class="btns">
          <el-button class="com-btn" type="info" @click="cancel" plain>返回</el-button>
          <el-button
            v-show="formData.handoverStatus === 1"
            class="com-btn"
            type="primary"
            @click="save"
            plain
          >保存</el-button>
          <el-button
            v-show="formData.handoverStatus !== 2"
            class="com-btn"
            type="primary"
            @click="confirm"
            plain
          >确认</el-button>
          <el-button
            v-show="formData.handoverStatus === 2"
            class="com-btn"
            type="primary"
            @click="derive"
            plain
          >导出</el-button>
        </div>
      </div>
      <div class="detail-content">
        <form-list
          ref="formList"
          :disabled="disabled"
          :datas="formData"
          :rules="listRules"
          :form-config="formConfig"
          @handle-btn-click="handleBtnClick"
        ></form-list>
      </div>
    </div>
    <div class="detail-item">
      <div class="detail-head">
        <div class="tit">表单信息</div>
        <div class="btns">
          <el-button
            v-if="this.formData.handoverStatus !== 2"
            class="com-btn"
            type="primary"
            @click="tableAdd"
            plain
          >新增</el-button>
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

              <el-table-column
                label="操作"
                v-if="this.formData.handoverStatus !== 2"
                width="150"
                align="center"
                fixed="right"
              >
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
      <asset-select-table :departDisabled="departDisabled" :department='mxUserOfRolelist[0].value' v-if="dialogVisibleSupples" @handle-select="handlePopSelect"></asset-select-table>
    </el-dialog>
  </div>
</template>

<script>
import FormList from '@/components/form/FormList'
import { dictMixin } from '@/mixins/dictMixin'
import tableComponent from '@/components/table/table_2'
import EditTable from '@/components/table/EditTable.vue'
import searchBtn from '@/components/button/searchBtn'
import resetBtn from '@/components/button/resetBtn'
import tablePagination from '@/components/tableGroup/TablePagination'
import AssetSelectTable from '@/components/pop/AssetSelectTable.vue'
import {
  createOrUpdateHandover,
  getHandoverDetail,
  updateHandover
} from './api'
export default {
  components: {
    FormList,
    EditTable,
    tableComponent,
    searchBtn,
    resetBtn,
    tablePagination,
    AssetSelectTable
  },
  mixins: [dictMixin],
  watch: {
    type() {
      this.disabled = this.type === 'detail'
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
                  disabled: true,
                  prop: 'handoverCode',
                  placeholder: '自动生成'
                },
                {
                  label: '移交日期',
                  type: 'dateTime',
                  prop: 'handoverDate',
                  placeholder: '日期选择'
                },
                {
                  label: '移交人',
                  type: 'text',
                  prop: 'handoverMan',
                  placeholder: '请输入移交人'
                },
                {
                  label: '计划状态',
                  type: 'select',
                  prop: 'handoverStatus',
                  disabled: true,
                  options: this.mxConfirmStatus,
                  placeholder: '请选择计划状态'
                },
                {
                  label: '使用单位',
                  type: 'select',
                  prop: 'handoverDep',
                  disabled: true,
                  placeholder: '自动生成',
                  options: this.mxDepartlist
                },
                {
                  label: '接收人',
                  type: 'text',
                  prop: 'receiveMan',
                  placeholder: '请输入接收人'
                },
                {
                  label: '接收单位',
                  type: 'select',
                  prop: 'handoverDep',
                  disabled: true,
                  placeholder: '自动生成',
                  options: this.mxDepartlist
                },
                {
                  label: '操作员',
                  type: 'text',
                  prop: 'operator',
                  options: '',
                  disabled: true,
                  placeholder: '默认当前用户'
                }
              ],
              [
                {
                  label: '备注',
                  type: 'textarea',
                  prop: 'note',
                  span: 12,
                  maxlength: 256,
                  placeholder: '请输入备注信息'
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
          label: '资产名称',
          editable: false
        },
        {
          prop: 'specification',
          label: '规格型号',
          editable: false
        },
        {
          prop: 'unit',
          label: '计量单位',
          editable: false
        },
        {
          prop: 'type',
          label: '资产类型',
          editable: false
        }
      ]
    }
  },
  data() {
    let tableValidator = (rule, value, callback) => {
      if (!this.Form.tableData.length) {
        callback(new Error('请选择资产'))
      } else {
        callback()
      }
    }
    return {
      operate: '',
      disabled: false,
      formData: {
        handoverCode: '',
        handoverDate: '',
        handoverMan: '',
        handoverDep: '',
        handoverStatus: '',
        receiveDep: '',
        note: '',
        operator: '',
        receiveMan: '',
        id: ''
      },
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
      listRules: {
        // handoverCode: [
        //   {
        //     required: true,
        //     message: '请输入单据编码',
        //     trigger: 'blur'
        //   }
        // ]
      },
      dialogVisibleSupples: false,
      departDisabled: true
    }
  },
  async created() {
    await this.userOfRoleList().then(res => {
      this.formData.operator = sessionStorage.getItem('user')
        ? sessionStorage.getItem('user')
        : ''
      this.formData.handoverDate = this.$formatDate(new Date())
      this.operate = this.$route.query.type
      this.Form.id = this.$route.query.id ? this.$route.query.id : ''

      this.formData.handoverStatus = this.operate !== 'edit' ? 1 : ''
      this.operate !== 'add' && this.getDetail(this.$route.query.id)
    })
    this.formData.handoverDep = this.mxUserOfRolelist[0].label
  },
  mounted() {},
  methods: {
    getFormData() {
      // console.log(this.formData.data)
    },
    handleBtnClick(res) {
      this[res] && this[res]()
    },
    derive() {},
    save() {
      this.$refs.formList.validFormList(valid => {
        this.$refs['Form'].validate(valid => {
          if (valid) {
            this.saveForm()
          } else {
            return false
          }
        })
      })
    },
    getDetail(id) {
      getHandoverDetail(id).then(res => {
        if (res.status) {
          let { details, ...obj } = res.data
          this.Form.tableData = details
          this.formData = obj
          if (this.formData.handoverStatus === 2) {
            this.formConfig.config[0].props.forEach(item => {
              item.forEach(i => {
                i.disabled = true
              })
            })
          }
        } else {
          this.$error(res.msg)
        }
      })
    },
    saveForm() {
      // this.formData.receiveDep = this.formData.handoverDep
      let details = this.Form.tableData
      let params = {
        details,
        ...this.formData
      }
      createOrUpdateHandover(params).then(res => {
        if (res.status) {
          if (this.operate === 'add') {
            this.$success('新增移交信息')
          } else {
            this.$success('修改移交信息')
          }
          this.$router.go(-1)
        } else {
          this.$error(res.msg)
        }
      })
    },
    cancel() {
      this.$router.go(-1)
    },
    tableAdd() {
      this.dialogVisibleSupples = true
    },
    confirm() {
      this.$refs.formList.validFormList(valid => {
        this.$refs['Form'].validate(valid => {
          if (valid) {
            this.formData.receiveDep = this.formData.handoverDep
            let details = this.Form.tableData
            this.formData.handoverStatus = 2
            let params = {
              details,
              ...this.formData
            }
            createOrUpdateHandover(params).then(res => {
              if (res.status) {
                this.$success('移交确认')
                this.$router.go(-1)
              } else {
                this.$error(res.msg)
              }
            })
          } else {
            return false
          }
        })
      })
      // updateHandover(this.formData.id).then(res => {
      //   if(res.status) {
      //       this.$success('移交确认')
      //     this.$router.go(-1)
      //   }else{
      //     this.$error(res.msg)
      //   }
      // })
    },
    handlePopSelect(res) {
      if (res.status === 2) {
        this.$info('该资产已报废，请重新勾选')
        return false
      }
      let flag = false
      if (this.Form.tableData.length > 0) {
        flag = this.Form.tableData.some(e => e.assetCode === res.assetCode)
      }
      if (flag) {
        this.$info('重复选中，请重新勾选')
        return false
      }
      this.dialogVisibleSupples = false
      this.Form.tableData.push(res)
    },
    tableDel(index) {
      this.Form.tableData.splice(index, 1)
    }
  }
}
</script>

<style  lang='less'>
#assetHandOverDetail {
  flex: 1;
}
</style>
