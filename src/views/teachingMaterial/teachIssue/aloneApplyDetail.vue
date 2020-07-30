<template>
  <div id="aloneApplyDetail" ref="aloneApplyDetail" class="com-detail-wrap">
    <div class="detail-item">
      <div class="detail-head">
        <div class="tit">基本信息</div>
        <div class="btns">
          <el-button class="com-btn" type="info" @click="cancel" plain>返回</el-button>
          <el-button
            class="com-btn"
            type="danger"
            v-if="$route.query.status == 6 || $route.query.status == 5"
            @click="del"
            plain
          >删除</el-button>
          <el-button
            class="com-btn"
            type="primary"
            v-if="$route.query.status == 6 || $route.query.status == 5 || $route.query.type ==='add'"
            @click="save($event)"
            plain
          >保存</el-button>
          <el-button
            class="com-btn"
            type="primary"
            v-if="$route.query.status == 6|| $route.query.status == 5|| $route.query.type ==='add'"
            @click="apply($event)"
            plain
          >申报</el-button>
          <el-button class="com-btn" type="primary" @click="channel" plain>导入</el-button>
        </div>
      </div>
      <div class="detail-content">
        <form-list
          :disabled="disabled"
          :datas="formData"
          ref="formList"
          :rules="listRules"
          :form-config="formConfig"
          @handle-btn-click="handleBtnClick"
        ></form-list>
      </div>
    </div>
    <div class="detail-item">
      <div class="detail-head">
        <div class="tit">表单信息</div>
        <div class="btns" v-if="$route.query.status !== 2 && Form.tableData.length < 1">
          <el-button class="com-btn" type="primary" @click="tableAdd" plain>新增</el-button>
        </div>
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
                  <div v-else>{{scope.row[item.prop]}}</div>
                </template>
              </el-table-column>

              <el-table-column
                label="操作"
                width="150"
                align="center"
                fixed="right"
                v-if="!disabled"
              >
                <template slot-scope="scope">
                  <div>
                    <el-button type="text" @click="tableDel(scope.row,scope.$index)">删除</el-button>
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
        <span>教材列表</span>
      </div>
      <teach-select-table v-if="dialogVisibleSupples" @handle-select="handlePopSelect"></teach-select-table>
    </el-dialog>
  </div>
</template>

<script>
import FormList from '@/components/form/FormList'
import EditTable from '@/components/table/EditTable.vue'
import TeachSelectTable from '@/components/pop/TeachSelectTable.vue'
import { dictMixin } from '../../../mixins/dictMixin'
import {
  addBookGrantDeclare,
  getBookGrantDeclare,
  updateBookGrantDeclare,
  deleteBookGrantDeclare
} from './api'
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
                  label: '单独申报编码',
                  type: 'text',
                  prop: 'grantDeclareCode',
                  placeholder: '自动生成',
                  disabled: true
                },
                {
                  label: '申报人',
                  type: 'text',
                  prop: 'declareUser',
                  placeholder: '默认当前用户',
                  disabled: true
                },
                {
                  label: '申报日期',
                  type: 'date',
                  prop: 'declareDate',
                  placeholder: '请选择申报日期',
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
                  placeholder: '请输入联系方式',
                  disabled: false
                },
                {
                  label: '用途',
                  type: 'text',
                  prop: 'purpose',
                  placeholder: '请输入用途',
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
          editable: false
        },
        {
          prop: 'author',
          label: '主编',
          editable: false
        },
        {
          prop: 'press',
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
    let tableValidator = (rule, value, callback) => {
      if (!this.Form.tableData.length) {
        callback(new Error('请选择教材'))
      } else {
        callback()
      }
    }
    let validPhone = (rule, value, callback) => {
      let PhoneReg = /^1(3|4|5|7|8)\d{9}$/
      let IFlag = PhoneReg.test(value)
      if (!value) {
        callback(new Error('请输入手机号码！'))
      } else if (!IFlag) {
        callback(new Error('请输入有效合法的手机号码！'))
      } else {
        callback()
      }
    }
    return {
      disabled: false,
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
      id: null,
      listRules: {
        phone: [
          {
            required: true,
            validator: validPhone,
            trigger: 'blur'
          }
        ]
      },
      rules: {
        table: [
          {
            required: true,
            validator: tableValidator,
            trigger: 'blur'
          }
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
    this.formData.declareDate = this.$formatDate(new Date(), true)
    this.operate = this.$route.query.type
    this.disabled = this.operate === 'edit' && (this.$route.query.status < 5)
    await this.userOfRoleList()
    this.formData.declareUser = sessionStorage.getItem('user') || ''
    this.formData.declareDepartmentId = this.mxUserOfRolelist[0].value
    this.formData.declareDepartmentName = this.mxUserOfRolelist[0].label
    this.operate === 'edit' && this.getDetail(this.$route.query.id)
  },
  mounted() {
    setTimeout(() => {
      this.getTableHeight()
    }, 50)
  },
  methods: {
    getTableHeight() {
      const aloneApplyDetail = document.getElementById('aloneApplyDetail')
        .clientHeight
      let detailItem = document
        .getElementById('aloneApplyDetail')
        .getElementsByClassName('detail-item')[0].clientHeight
      let detailHead = document
        .getElementById('aloneApplyDetail')
        .getElementsByClassName('detail-head')[0].clientHeight
      this.Form.tableHeight =
        aloneApplyDetail - detailItem - detailHead  - 60 - 22 // 60为table-box的内边距，两个20位margin-bottom
    },
    handleBtnClick(res) {
      this[res] && this[res]()
    },
    cancel() {
      this.$router.go(-1)
    },
    save(type) {
      this.$refs.formList.validFormList(valid => {
        if (valid) {
          this.$refs.Form.validate(Valid => {
            if (Valid) {
              this.saveForm(type)
            }
          })
        }
      })
    },
    saveForm(type) {
      let params = {
        repertoryId: this.Form.tableData[0].purchasePlanId,
        ...this.formData
      }
      if(type) params.state = 1
      if (this.operate === 'add') {
        addBookGrantDeclare(params).then(res => {
          if (res.status) {
           type ? this.$success('教材申报') : this.$success('新增教材申报')
            this.$router.go(-1)
          }
        })
      } else if (this.operate === 'edit') {
        updateBookGrantDeclare(params).then(res => {
          if (res.status) {
           type ? this.$success('教材申报') : this.$success('修改教材申报')
            this.$router.go(-1)
          }
        })
      }
    },
    getDetail(id) {
      getBookGrantDeclare(id).then(res => {
        if (res.status) {
          console.log(this.formData)
          console.log(this.Form.tableData)
          console.log(res.data)
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
    },
    apply() {
      this.save('apply')
    },
    channel() {},
    del() {
      deleteBookGrantDeclare(this.$route.query.id).then(res => {
        if (res.status) {
          this.$success('删除申报单')
          this.$router.go(-1)
        }
      })
    },
    tableAdd() {
      this.dialogVisibleSupples = true
    },
    tableDel(row, index) {
      if (row.id) {
        // delDetailStorage(row.id).then(res => {
        //   if (res.status) {
        //     this.$success('删除入库单信息')
        //   }
        // })
      }
      this.Form.tableData.splice(index, 1)
    },
    handlePopSelect(res) {
      res.num = 1
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
#aloneApplyDetail {
  flex: 1;
}
</style>
