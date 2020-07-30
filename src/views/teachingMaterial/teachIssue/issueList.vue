<template>
  <div id="issueList" ref="issueList">
    <search-bar
      :datas="searchConfig"
      :config="btnConfig"
      @handle-click="handleBtnClick"
      @handle-search="handleSearch"
      @handle-reset="handleReset"
    ></search-bar>
    <div class="table-box">
      <table-list
        :tableHeight="tableConfig.tableHeight"
        :tableData="tableConfig.data"
        :currentPage="tableConfig.currentPage"
        :pageSize="tableConfig.pageSize"
        :total="tableConfig.total"
        @size-change="changeSize"
        @page-change="changePage"
        @select="handleSelection"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
        <el-table-column
          v-for="(item,index) in tableConfig.config"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          align="center"
          :sortable="item.sortable"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <div v-if="item.prop === 'state'">
              <div v-if="scope.row[item.prop] === 1" class="com-status-usual">未发放</div>
              <div v-else-if="scope.row[item.prop] === 2" class="com-status-usual">部分发放</div>
              <div v-else-if="scope.row[item.prop] === 3" class="com-status-usual">已发放</div>
            </div>
            <div v-else>{{scope.row[item.prop]}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template slot-scope="scope">
            <div>
              <el-button
                class="edit"
                type="text"
                v-if="scope.row.state !== 3 "
                @click="issue(scope.row)"
              >发放</el-button>
              <el-button class="edit" type="text" @click="detail(scope.row)">详情</el-button>
            </div>
          </template>
        </el-table-column>
      </table-list>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="1200px"
      @open="dialogOpen"
      @closed="dialogClosed"
      :center="true"
    >
      <div slot="title" class="dialog-title">
        <span>{{dialogTitle}}</span>
      </div>
      <form-list
        v-if="operateType === 'issue'"
        ref="formList"
        :datas="formData"
        :rules="listRules"
        :form-config="formConfig"
      ></form-list>
      <table-component
        v-if="operateType === 'detail'"
        :tableHeight="TableConfig.tableHeight"
        :tableData="TableConfig.data"
      >
        <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
        <el-table-column
          v-for="(item,index) in TableConfig.config"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          align="center"
          :sortable="item.sortable"
          :show-overflow-tooltip="true"
        ></el-table-column>
      </table-component>
      <span slot="footer" class="dialog-footer" v-if="operateType === 'issue'">
        <el-button class="com-btn" type="info" @click="dialogVisible = false" plain>返回</el-button>
        <el-button class="com-btn" type="primary" @click="save" plain>保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import searchBar from '@/components/searchBar/searchBar'
import tableList from '@/components/table'
import tableComponent from '@/components/table/table_2'
import FormList from '@/components/form/FormList'
import { dictMixin } from '../../../mixins/dictMixin'
import {
  bookGrantFocusList,
  addBookGrantFocus,
  getdBookGrantFocus,
  createlist
} from './api'
export default {
  components: { searchBar, tableList, FormList, tableComponent },
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
                  label: '发放日期',
                  type: 'date',
                  prop: 'grantDate',
                  disabled: false,
                  placeholder: '请选择发放日期'
                },
                {
                  label: '发放数量',
                  type: 'number',
                  prop: 'grantQuantity',
                  disabled: false,
                  placeholder: '请输入发放数量'
                },
                {
                  label: '领取人',
                  type: 'text',
                  prop: 'receiver',
                  disabled: false,
                  placeholder: '请输入领取人'
                },
                {
                  label: '联系方式',
                  type: 'text',
                  prop: 'phone',
                  placeholder: '请输入联系方式'
                },
                {
                  label: '备注',
                  type: 'textarea',
                  prop: 'remark',
                  span: 12,
                  placeholder: '请输入备注信息'
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
      grantQuantity: 0,
      formData: {
        grantDate: '',
        grantQuantity: '',
        receiver: '',
        phone: '',
        remark: '',
        grantFocusId: ''
      },
      searchConfig: {
        // 搜索栏配置
        data: {
          schoolYearId: '',
          className: ''
        },
        config: [
          {
            label: '学年',
            labelWidth: '80px',
            prop: 'schoolYearId',
            type: 'select',
            placeholder: '请选择学年',
            options: []
          },
          {
            label: '班级',
            prop: 'className',
            labelWidth: '80px',
            type: 'text',
            placeholder: '请输入班级'
          }
        ]
      },
      btnConfig: [
        {
          label: 'Excel导出',
          type: 'primary',
          plain: true,
          customClass: '',
          callback: 'derive'
        },
        {
          label: '生成发放清单',
          type: 'primary',
          plain: true,
          customClass: '',
          callback: 'create'
        }
      ],
      tableConfig: {
        data: [],
        config: [
          {
            prop: 'schoolYear',
            label: '学年',
            sortable: false
          },
          {
            prop: 'courseCode',
            label: '排课号',
            sortable: true
          },
          {
            prop: 'trainLevelName',
            label: '培养层次',
            sortable: false
          },
          {
            prop: 'className',
            label: '班级',
            sortable: false
          },
          {
            prop: 'classCount',
            label: '班级（人数)',
            sortable: false
          },
          {
            prop: 'courseName',
            label: '课程名称',
            sortable: false
          },
          {
            prop: 'categoryName',
            label: '教材（讲义）名称',
            sortable: false
          },
          {
            prop: 'bookNum',
            label: '书号',
            sortable: false
          },
          {
            prop: 'storagePlace',
            label: '存放地点',
            sortable: false
          },
          {
            prop: 'bookcase',
            label: '书架号',
            sortable: false
          },
          {
            prop: 'state',
            label: '发放状态',
            sortable: false,
            width: 150
          }
        ],
        tableHeight: 0,
        currentPage: 1,
        pageSize: 10,
        total: 1,
        selectData: []
      },
      listRules: {
        grantQuantity: [
          {
            required: true,
            validator: this.checkQuantity,
            trigger: 'blur'
          }
        ],
        receiver: [
          {
            required: true,
            message: '请输入领取人',
            trigger: 'blur'
          }
        ],
        grantDate: [
          {
            required: true,
            message: '请选择发放日期',
            trigger: 'change'
          }
        ],
        phone: [
          {
            required: true,
            validator: this.checkPhone,
            trigger: 'blur'
          }
        ]
      },
      dialogVisible: false,
      operateType: '',
      dialogTitle: '',
      TableConfig: {
        data: [],
        tableHeight: 400,
        config: [
          {
            prop: 'grantDate',
            label: '发放日期',
            sortable: false
          },
          {
            prop: 'grantQuantity',
            label: '发放数量',
            sortable: true
          },
          {
            prop: 'receiver',
            label: '领取人',
            sortable: false
          },
          {
            prop: 'phone',
            label: '联系方式',
            sortable: false
          },
          {
            prop: 'remark',
            label: '备注',
            sortable: false
          }
        ]
      }
    }
  },
  created() {
    this.searchConfig.config.forEach(item => {
      if (item.type === 'select') {
        if (item.prop === 'schoolYearId') {
          this.baseList('JB02XNXN').then(res => {
            this.mxYearList = res
            this.mxYearList.unshift({ label: '所有', value: '' })
            item.options = this.mxYearList
          })
        }
      }
    })
  },
  mounted() {
    setTimeout(() => {
      this.getTableHeight()
      this.getList()
    }, 1)
    window.onresize = () => {
      this.getTableHeight()
    }
  },
  methods: {
    checkPhone(rule, value, callback) {
      if (!value) callback(new Error('请输入联系方式！'))
      let PhoneReg = /^1(3|4|5|7|8)\d{9}$/
      let IFlag = PhoneReg.test(value)
      if (!IFlag) {
        callback(new Error('请输入有效合法的手机号码！'))
      } else {
        callback()
      }
    },
    checkQuantity(rule, value, callback) {
      if (!value) {
        return callback(new Error('请输入发放数量'))
      }
      if (value > this.grantQuantity) {
        callback(new Error(`请输入不大于${this.grantQuantity}的值`))
      } else {
        callback()
      }
    },
    getTableHeight() {
      const issueList = document.getElementById('issueList').clientHeight
      let searchBox = document
        .getElementById('issueList')
        .getElementsByClassName('search-box')[0].clientHeight
      let pagination = document
        .getElementById('issueList')
        .getElementsByClassName('pagination')[0].clientHeight
      this.tableConfig.tableHeight =
        issueList - searchBox - pagination - 40 - 10 // 40为table-box的内边距，两个20位margin-bottom
    },
    handleSearch() {
      this.tableConfig.currentPage = 1
      this.getList()
    },
    handleReset() {
      this.getList()
    },
    handleBtnClick(res) {
      this[res] && this[res]()
    },
    getList() {
      let params = {
        className: this.searchConfig.data.className,
        schoolYearId: this.searchConfig.data.schoolYearId,
        pageNum: this.tableConfig.currentPage,
        pageSize: this.tableConfig.pageSize
      }
      bookGrantFocusList(params).then(res => {
        if (res.status) {
          this.tableConfig.data = res.data.records
          this.tableConfig.total = res.data.total
        }
      })
    },
    create() {
      let params = {
        className: this.searchConfig.data.className,
        schoolYearId: this.searchConfig.data.schoolYearId,
        pageNum: this.tableConfig.currentPage,
        pageSize: this.tableConfig.pageSize
      }
      createlist(params).then(res => {
        if (res.status) {
          this.getList()
          // this.tableConfig.data = res.data.records
          // this.tableConfig.total = res.data.total
        }
      })
    },
    derive() {},
    changeSize(size) {
      this.tableConfig.pageSize = size
      this.tableConfig.currentPage = 1
      this.getList()
    },
    changePage(page) {
      this.tableConfig.currentPage = page
      this.getList()
    },
    handleSelection(data) {
      this.tableConfig.selectData = data
    },
    issue(row) {
      this.dialogVisible = true
      this.operateType = 'issue'
      this.dialogTitle = '教材发放'
      this.grantQuantity = row.classCount - row.grantNum
      this.formData.grantFocusId = JSON.parse(JSON.stringify(row.id))
    },
    detail(row) {
      this.dialogVisible = true
      this.operateType = 'detail'
      this.dialogTitle = '教材发放信息'
      this.getDetail(row.id)
    },
    getDetail(id) {
      this.TableConfig.data = []
      getdBookGrantFocus(id).then(res => {
        if (res.status) {
          this.TableConfig.data = res.data
        }
      })
    },
    save() {
      this.$refs.formList.validFormList(valid => {
        if (valid) {
          this.saveForm()
        }
      })
    },
    saveForm() {
      // console.log(this.formData)
      // let params  = {}
      addBookGrantFocus(this.formData).then(res => {
        if (res.status) {
          this.$success('教材发放')
          this.dialogVisible = false
          this.getList()
        }
      })
    },
    dialogOpen() {
      this.$nextTick(() => {
        this.operateType === 'issue' && this.$refs['formList'].clearValidate()
      })
    },
    dialogClosed() {
      for (let key in this.formData) {
        var type = this.$getDataType(this.formData[key])
        if (type === 'String') {
          this.formData[key] = ''
        } else if (type === 'Array') {
          this.formData[key] = []
        } else if (type === 'Object') {
          this.formData[key] = {}
        } else {
          this.formData[key] = null
        }
      }
      this.operateType = ''
    }
  }
}
</script>

<style>
#issueList {
  flex: 1;
}
</style>
