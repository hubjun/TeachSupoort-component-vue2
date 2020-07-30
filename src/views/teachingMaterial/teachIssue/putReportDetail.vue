<template>
  <div id="putReportDetail" ref="putReportDetail" class="com-detail-wrap">
    <div class="detail-item">
      <div class="detail-head">
        <div class="tit">基本信息</div>
        <div class="btns">
          <el-button class="com-btn" type="info" @click="cancel" plain>返回</el-button>
          <el-button class="com-btn" type="primary" @click="derive" plain>导出</el-button>
        </div>
      </div>
      <div class="detail-content">
        <form-list
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
      </div>
      <div class="detail-content">
        <el-form :rules="rules" :model="Form" ref="Form">
          <el-form-item prop="table">
            <edit-table :table-data="Form.tableData" :tableHeight="Form.tableHeight">
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
              </el-table-column> -->
            </edit-table>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import FormList from '@/components/form/FormList'
import EditTable from '@/components/table/EditTable.vue'
import TeachSelectTable from '@/components/pop/TeachSelectTable.vue'
import { dictMixin } from '../../../mixins/dictMixin'
import { getBookGrantDeclare } from './api'
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
        labelWidth: '100px',
        config: [
          {
            label: ' 基本信息',
            props: [
              [
                {
                  label: '单据编码',
                  type: 'text',
                  prop: 'grantDeclareCode',
                  placeholder: '',
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
                  label: '申报日期：',
                  type: 'date',
                  prop: 'declareDate',
                  placeholder: '',
                  disabled: false
                },
                {
                  label: '申报人部门',
                  type: 'select',
                  prop: 'declareDepartmentId',
                  placeholder: '默认当前用户单位',
                  disabled: true,
                  options: this.mxUserOfRolelist
                },
                {
                  label: '联系方式',
                  type: 'text',
                  prop: 'phone',
                  placeholder: '',
                  disabled: false
                },
                {
                  label: '用途',
                  type: 'text',
                  prop: 'purpose',
                  placeholder: '',
                  disabled: false
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
          prop: 'num',
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
          editable: true
        },
        {
          prop: 'author',
          label: '主编',
          editable: true
        },
        {
          prop: 'press',
          label: '出版社',
          editable: true
        },
        {
          prop: 'publishDate',
          label: '出版时间',
          editable: true
        }
      ]
    }
  },
  data() {
    return {
      disabled: true,
      operate: '',
      formData: {
        grantDeclareCode: '',
        declareDate: '',
        declareDepartmentId: '',
        declareDepartmentName: '',
        declareUser: '',
        phone: '',
        purpose: '',
        id: '',
        state: 6
      },
      listRules: {},
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
   async created() {
    await this.userOfRoleList()
     this.getDetail(this.$route.query.id)
  },
  mounted() {
     setTimeout(() => {
      this.getTableHeight()
    }, 50)
  },
  methods: {
    handleBtnClick(res) {
      this[res] && this[res]()
    },
    getTableHeight() {
      const putReportDetail = document.getElementById('putReportDetail')
        .clientHeight
      let detailItem = document
        .getElementById('putReportDetail')
        .getElementsByClassName('detail-item')[0].clientHeight
      let detailHead = document
        .getElementById('putReportDetail')
        .getElementsByClassName('detail-head')[0].clientHeight
      this.Form.tableHeight =
        putReportDetail - detailItem - detailHead  - 60 - 22 // 60为table-box的内边距，两个20位margin-bottom
    },
    cancel() {
      this.$router.go(-1)
    },
    derive() {},
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
    getDetail(id) {
      getBookGrantDeclare(id).then(res => {
        if (res.status) {
          Object.keys(this.formData).forEach(e => {
            if (res.data.hasOwnProperty(e)) {
              this.formData[e] = res.data[e]
            }
          })
          this.formData.declareDepartmentId = res.data.declareDepartmentId
          this.formData.declareDepartmentName = this.mxUserOfRolelist.filter(
            e => e.value === this.formData.declareDepartmentId
          )[0].label
          let obj = {
            categoryCode: '',
            categoryName: '',
            num: 1,
            materialTypeName: '',
            trainLevelName: '',
            bookNum: '',
            author: '',
            press: '',
            publishDate: ''
          }
          obj.press = res.data.publisher
          Object.keys(obj).forEach(e => {
            if (res.data.hasOwnProperty(e)) {
              obj[e] = res.data[e]
            }
          })
          this.Form.tableData = []
          this.Form.tableData.push(obj)
        }
      })
    }
  }
}
</script>

<style>
#putReportDetail{
  flex: 1;
}
</style>
