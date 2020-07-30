<template>
  <div id="assetCollectApplyDetail" ref="assetCollectApplyDetail" class="com-detail-wrap">
    <div class="detail-item">
      <div class="detail-head">
        <div class="tit">基本信息</div>
        <div class="btns">
          <el-button class="com-btn" type="info" @click="cancel" plain>返回</el-button>
          <el-button v-show="!disabled" class="com-btn" type="primary" @click="save" plain>保存</el-button>
          <el-button
            v-show="formData.reqStatus !== 4&&formData.reqStatus !== 2"
            class="com-btn"
            type="primary"
            @click="apply"
            plain
          >申报</el-button>
          <el-button
            v-show="$route.query.type === 'edit'"
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
          <el-button v-if="!disabled" class="com-btn" type="primary" @click="tableAdd" plain>新增</el-button>
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
                width="150"
                align="center"
                fixed="right"
                v-if="operate!=='detail'&& $route.query.status !== 2 && formData.reqStatus !== 4 "
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
      <asset-select-table :status="1" v-if="dialogVisibleSupples" @handle-select="handlePopSelect"></asset-select-table>
    </el-dialog>
  </div>
</template>

<script>
import FormList from '@/components/form/FormList'
import { dictMixin } from '../../../mixins/dictMixin'
import tableComponent from '@/components/table/table_2'
import EditTable from '@/components/table/EditTable.vue'
import tablePagination from '@/components/tableGroup/TablePagination'
import AssetSelectTable from '@/components/pop/AssetSelectTable.vue'
import { createOrUpdateApply, getApplyDetail, applyAssets } from './api'
export default {
  components: {
    FormList,
    EditTable,
    tableComponent,
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
        labelWidth: '130px',
        config: [
          {
            label: ' 基本信息',
            props: [
              [
                {
                  label: '单据编码',
                  type: 'text',
                  prop: 'reqCode',
                  placeholder: '自动生成',
                  disabled: true
                },
                {
                  label: '申报日期',
                  type: 'dateTime',
                  prop: 'reqDate',
                  placeholder: '日期选择'
                },
                {
                  label: '领用人',
                  type: 'text',
                  prop: 'reqMan',
                  disabled: true,
                  placeholder: '默认当前用户'
                },
                {
                  label: '使用单位',
                  type: 'select',
                  prop: 'reqDepId',
                  disabled: true,
                  placeholder: '默认当前用户的单位',
                  options: this.mxUserOfRolelist
                },
                {
                  label: '计划状态',
                  type: 'select',
                  prop: 'reqStatus',
                  disabled: true,
                  options: this.mxApplyStatus
                }
              ],
              [
                {
                  label: '备注',
                  type: 'textarea',
                  prop: 'note',
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
        reqCode: '',
        reqDate: '',
        reqMan: '',
        reqDep: '',
        reqDepId: '',
        reqStatus: '',
        note: ''
      },
      listRules: {
        // reqCode: [
        //   {
        //     required: true,
        //     message: '请输入单据编码',
        //     trigger: 'blur'
        //   }
        // ]
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
      dialogVisibleSupples: false
    }
  },
  async created() {
    await this.userOfRoleList()
    this.formData.reqDepId = this.mxUserOfRolelist[0].value
    this.formData.reqDep = this.mxUserOfRolelist[0].label
    this.operate = this.$route.query.type
    this.disabled =
      this.$route.query.status === 2 || this.$route.query.status === 4
    this.formData.reqStatus = !this.disabled ? 1 : ''
    this.formData.reqDate = this.$formatDate(new Date())
    this.formData.reqMan = sessionStorage.getItem('user') || ''
    this.operate !== 'add' && this.getDetail(this.$route.query.id)
  },
   mounted() {
    
  },
  methods: {
    getFormData() {
      // console.log(this.formData.data)
    },
    // 触发事件
    handleBtnClick(res) {
      this[res] && this[res]()
    },
    // 保存
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
    // 保存数据
    saveForm() {
      let details = this.Form.tableData
      let params = {
        details,
        ...this.formData
      }
      createOrUpdateApply(params).then(res => {
        if (res.status) {
          if (this.operate === 'add') {
            this.$success('新增领用申请')
          } else {
            this.$success('修改领用申请')
          }
          this.$router.go(-1)
        } else {
          this.$error(res.msg)
        }
      })
    },
    // 取消
    cancel() {
      this.$router.go(-1)
    },
    // 新增
    tableAdd() {
      this.dialogVisibleSupples = true
    },
    // 双击弹框表格
    handlePopSelect(res) {
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
    // 删除表格某一行
    tableDel(index) {
      this.Form.tableData.splice(index, 1)
    },
    // 查询详情
    getDetail(id) {
      getApplyDetail(id).then(res => {
        let { details, ...obj } = res.data
        this.Form.tableData = details
        this.formData = obj
        this.formData.reqDepId = this.mxUserOfRolelist.filter(e => e.label === obj.reqDep)[0].value
      })
    },
    // 申报
    apply() {
      this.$refs.formList.validFormList(valid => {
        this.$refs['Form'].validate(valid => {
          if (valid) {
            let details = this.Form.tableData
            this.formData.reqStatus = 2
            let params = {
              details,
              ...this.formData
            }
            createOrUpdateApply(params).then(res => {
              if (res.status) {
                this.$success('资产领用申报')
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
    },
    // 导出
    derive() {}
  }
}
</script>

<style  lang='less'>
#assetCollectApplyDetail {
  flex: 1;
}
</style>
