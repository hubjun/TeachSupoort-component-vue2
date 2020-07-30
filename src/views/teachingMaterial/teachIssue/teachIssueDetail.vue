<template>
  <div id="teachIssueDetail" ref="teachIssueDetail" class="com-detail-wrap">
    <div class="detail-item">
      <div class="detail-head">
        <div class="tit">基本信息</div>
        <div class="btns">
          <el-button class="com-btn" type="info" @click="cancel" plain>返回</el-button>
          <el-button class="com-btn" v-if="$route.query.status != 2 || $route.query.type === 'add'" type="primary" @click="save" plain>保存</el-button>
          <el-button class="com-btn" v-if="$route.query.status != 2 || $route.query.type === 'add'" type="primary" @click="save" plain>发放</el-button>
          <el-button class="com-btn" type="primary" @click="derive" plain>导出</el-button>
        </div>
      </div>
      <div class="detail-content">
        <form-list
          :disabled="disabled"
          ref="formList"
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

              <!-- <el-table-column
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
              </el-table-column>-->
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
        <span>教材列表</span>
      </div>
      <teach-select-table :status="1" v-if="dialogVisibleSupples" @handle-select="handlePopSelect"></teach-select-table>
    </el-dialog>
  </div>
</template>

<script>
import FormList from '@/components/form/FormList'
import EditTable from '@/components/table/EditTable.vue'
import TeachSelectTable from '@/components/pop/TeachSelectTable.vue'
import { dictMixin } from '../../../mixins/dictMixin'
import { getByCode, addBookGrantRecord, getBookGrantRecord } from './api'
export default {
  components: {
    FormList,
    EditTable,
    TeachSelectTable
  },
  mixins: [dictMixin],
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
                  label: '发放单据编码',
                  type: 'text',
                  prop: 'grantRecordCode',
                  placeholder: '自动生成',
                  disabled: true
                },
                {
                  label: '申报单据编码',
                  type: 'text',
                  prop: 'grantDeclareCode',
                  placeholder: '请输入申报单据编码',
                  disabled: false
                },
                {
                  label: '申报人',
                  type: 'text',
                  prop: 'declareUser',
                  placeholder: '默认当前用户',
                  disabled: true
                },
                {
                  label: '申报人部门',
                  type: 'text',
                  prop: 'declareDepartmentName',
                  placeholder: '默认当前用户单位',
                  disabled: true
                },
                {
                  label: '发放日期',
                  type: 'date',
                  prop: 'grantDate',
                  placeholder: '默认当前日期',
                  disabled: false
                },
                {
                  label: '联系方式',
                  type: 'text',
                  prop: 'phone',
                  placeholder: '',
                  disabled: true
                },
                {
                  label: '用途',
                  type: 'text',
                  prop: 'purpose',
                  placeholder: '',
                  disabled: true
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
          prop: 'categoryCode',
          label: '教材编码',
          editable: false // 是否可编辑
        },
        {
          prop: 'categoryName',
          label: '教材名称',
          editable: false
        },
        {
          prop: 'materialTypeName',
          label: '教材类型',
          editable: false
        },
        {
          prop: 'quantity',
          label: '数量',
          editable: false
        },
        {
          prop: 'trainLevelName',
          label: '培养层次',
          editable: false
        },
        {
          prop: 'bookNum',
          label: '书号',
          editable: false
        },
        {
          prop: 'author',
          label: '主编',
          editable: false
        },
        {
          prop: 'publisher',
          label: '出版社',
          editable: false
        },
        {
          prop: 'publishDate',
          label: '出版时间',
          editable: false
        }
      ]
    }
  },
  data() {
    return {
      disabled: false,
      operate: '',
      formData: {
        grantRecordCode: '',
        grantDeclareCode: '',
        declareUser: '',
        declareDepartmentName: '',
        grantDate: '',
        phone: '',
        purpose: '',
        grantDeclareId: '',
        id: ''
      },
      listRules: {
        grantDeclareCode: [
          {
            required: true,
            validator: this.codeValidator,
            trigger: 'blur'
          }
        ]
      },
      rules: {
        table: [
          //   {
          //     validator: ,
          //     trigger: 'blur'
          //   }
        ]
      },
      Form: {
        // 表格数据
        tableData: [],
        // 表格高度
        tableHeight: 0
      },
      dialogVisibleSupples: false,
      auditMan: '',
      auditTime: ''
    }
  },
  created() {
    this.operate = this.$route.query.type
    this.formData.grantDate = this.$formatDate(new Date(), true)
    this.operate === 'edit' && this.getDetail(this.$route.query.id)
  },
  mounted() {
    setTimeout(() => {
      this.getTableHeight()
    }, 50)
  },
  methods: {
    codeValidator(rule, value, callback) {
      if (value) {
        getByCode(value).then(res => {
          this.formData = {
            grantRecordCode: '',
            declareUser: '',
            declareDepartmentName: '',
            phone: '',
            purpose: '',
            grantDeclareId: '',
            grantDate: this.formData.grantDate,
            grantDeclareCode: this.formData.grantDeclareCode,
            id: this.formData.id
          }
          if (res.status) {
            if (res.data) {
              this.formData.grantDeclareId = JSON.parse(
                JSON.stringify(res.data.id)
              )
              res.data.id = null
              let obj = {
                categoryCode: '',
                categoryName: '',
                materialTypeName: '',
                quantity: 1,
                trainLevelName: '',
                bookNum: '',
                author: '',
                publisher: '',
                publishDate: ''
              }
              Object.keys(this.formData).forEach(e => {
                if (res.data.hasOwnProperty(e)) {
                  if (e !== 'id') {
                    this.formData[e] = res.data[e]
                  }
                }
              })
              Object.keys(obj).forEach(e => {
                if (res.data.hasOwnProperty(e)) {
                  obj[e] = res.data[e]
                }
              })
              this.Form.tableData = []
              this.Form.tableData.push(obj)
              callback()
            } else {
              callback(new Error('请输入精确的申报单据编码'))
            }
          } else {
            callback(new Error('请输入精确的申报单据编码'))
          }
        })
      } else if (!value) {
        callback(new Error('请输入申报单据编码'))
      }
    },
    getTableHeight() {
      const teachIssueDetail = document.getElementById('teachIssueDetail')
        .clientHeight
      let detailItem = document
        .getElementById('teachIssueDetail')
        .getElementsByClassName('detail-item')[0].clientHeight
      let detailHead = document
        .getElementById('teachIssueDetail')
        .getElementsByClassName('detail-head')[0].clientHeight
      this.Form.tableHeight =
        teachIssueDetail - detailItem - detailHead - 60 - 22 // 60为table-box的内边距，两个20位margin-bottom
    },
    handleBtnClick(res) {
      this[res] && this[res]()
    },
    getDetail(id) {
      getBookGrantRecord(id).then(res => {
        if (res.status) {
          let obj = {
            categoryCode: '',
            categoryName: '',
            materialTypeName: '',
            quantity: 1,
            trainLevelName: '',
            bookNum: '',
            author: '',
            publisher: '',
            publishDate: ''
          }
          Object.keys(this.formData).forEach(e => {
            if (res.data.hasOwnProperty(e)) {
              this.formData[e] = res.data[e]
            }
          })
          Object.keys(obj).forEach(e => {
            if (res.data.hasOwnProperty(e)) {
              obj[e] = res.data[e]
            }
          })
          this.Form.tableData = []
          this.Form.tableData.push(obj)
        }
      })
    },
    cancel() {
      this.$router.go(-1)
    },
    derive() {
      this.save('type')
    },
    save(type) {
      this.$refs.formList.validFormList(valid => {
        if (valid) {
          this.saveForm(type)
        } else {
          return false
        }
      })
    },
    saveForm(type) {
      let params = {
        grantDate: this.formData.grantDate,
        grantDeclareId: this.formData.grantDeclareId,
        state: 1
      }
      if (this.operate === 'edit') params.id = this.formData.id
      if (type) params.state = 2
      addBookGrantRecord(params).then(res => {
        if (res.status) {
          type
            ? this.$success('教材发放单发放')
            : this.operate === 'add'
            ? this.$success('新增教材发放单')
            : this.$success('修改教材发放单')
          this.$router.go(-1)
        }
      })
    },
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
    }
  }
}
</script>

<style>
#teachIssueDetail {
  flex: 1;
}
</style>
