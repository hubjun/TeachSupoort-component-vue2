<template>
  <div id="user" ref="user">
    <search-bar
      :datas="searchConfig"
      :config="btnConfig"
      @handle-search="handleSearch"
      @handle-click="handleBtnClick"
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
      >
        <!-- <el-table-column
          type="selection"
          align="center"
          width="55"
          :show-overflow-tooltip="true"
        ></el-table-column>-->
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="55"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          v-for="(item,index) in tableConfig.config"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          align="center"
          :sortable="item.sortable"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <div v-if="item.prop === 'enabled'">
              <div v-if="scope.row[item.prop]" class="com-status-success">
                <!-- <span class="iconfont">&#xe626;</span> -->
                {{scope.row[item.prop]?'启用':'停用'}}
              </div>
              <div v-if="!scope.row[item.prop]" class="com-status-danger">
                <!-- <span class="iconfont">&#xe626;</span> -->
                {{scope.row[item.prop]?'启用':'停用'}}
              </div>
            </div>
            <div v-else>{{scope.row[item.prop]}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="400" align="center" fixed="right">
          <template slot-scope="scope">
            <div>
              <el-button type="text" @click="edit(scope.row)">编辑</el-button>
              <el-button type="text" @click="addDepart(scope.row)">添加部门</el-button>
              <el-button type="text" @click="detail(scope.row)">分配角色</el-button>
              <el-button type="text" @click="resetPassword(scope.row)">重置密码</el-button>
              <el-button type="text" v-if="!scope.row.enabled" @click="open(scope.row)">启用</el-button>
              <el-button
                type="text"
                class="font-color-red"
                v-if="scope.row.enabled"
                @click="close(scope.row)"
              >停用</el-button>
            </div>
          </template>
        </el-table-column>
      </table-list>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="780px"
      @open="dialogOpen"
      @closed="dialogClosed"
      :center="true"
    >
      <div slot="title" class="dialog-title">
        <span>{{dialogTitle}}</span>
      </div>
      <el-form
        :inline="true"
        :model="Form"
        :rules="rules"
        ref="Form"
        class="operate"
        v-if="operateType === 'add' || operateType === 'edit'"
      >
        <el-form-item label="用户账号" label-width="75px" prop="username">
          <el-input v-model="Form.username" size="small" placeholder="请输入用户账号" @keyup.native="(Form.username = Form.username.replace(/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g, ''))"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="75px" prop="password" v-if="operateType === 'add'">
          <el-input
            v-model.trim="Form.password"
            type="text"
            @keyup.native="(Form.password = Form.password.replace(/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g, ''))"
            size="small"
            placeholder="默认密码123456"
          ></el-input>
        </el-form-item>
        <el-form-item label="昵称" label-width="75px" prop="nickname">
          <el-input v-model="Form.nickname" size="small" placeholder="请输入昵称"></el-input>
        </el-form-item>
        <el-form-item label="手机号" label-width="75px" prop="mobile">
          <el-input v-model="Form.mobile" size="small" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" label-width="75px" prop="officialName">
          <el-input v-model="Form.officialName" size="small" placeholder="请输入真实姓名"></el-input>
        </el-form-item>
        <el-form-item label="职务" label-width="75px" prop="position">
          <el-input v-model="Form.position" size="small" placeholder="请输入职务"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" label-width="75px" prop="idCard">
          <el-input v-model="Form.idCard" size="small" placeholder="请输入身份证号"></el-input>
        </el-form-item>
      </el-form>
      <el-form
        :inline="true"
        :model="Forms"
        :rules="rule"
        ref="Forms"
        v-if="operateType === 'allocation'"
      >
        <el-form-item label="昵称" label-width="75px" prop="userRoles">
          <el-select v-model="forms.deptId" clearable filterable>
            <el-option
              v-for="option in mxRolelist"
              :label="option.label"
              :value="option.value"
              :key="option.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <btn-group :config="config" @handle-click="handleBtnClick"></btn-group>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="departVisible"
      :close-on-click-modal="false"
      width="440px"
      @open="departOpen"
      @close="departClose"
      :center="true"
    >
      <div slot="title" class="dialog-title">
        <span>{{dialogTitle}}</span>
      </div>
      <el-form
        :inline="true"
        :model="forms"
        :rules="formsRules"
        ref="forms"
        v-if="operateType === 'depart'"
      >
        <el-form-item label="用户部门" label-width="75px" prop="deptId">
          <el-select v-model="forms.deptId" clearable filterable>
            <el-option
              v-for="option in mxDepartlist"
              :label="option.label"
              :value="option.value"
              :key="option.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form :inline="true" :model="form" :rules="rule" ref="form" v-if="operateType === 'role'">
        <el-form-item label="角色" label-width="75px" prop="userRoles">
          <el-select v-model="form.userRoles" clearable filterable>
            <el-option
              v-for="option in roleLists"
              :label="option.label"
              :value="option.value"
              :key="option.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="com-btn" type="info" @click="departVisible = false" plain>返回</el-button>
        <el-button class="com-btn" type="primary" @click="saveDepart" plain>保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { dictMixin } from '@/mixins/dictMixin'
import searchBar from '@/components/searchBar/searchBar'
import tableList from '@/components/table'
import BtnGroup from '@/components/common/BtnGroup.vue'
import {
  getUserList,
  addUser,
  updateUser,
  defaultPassword,
  updateEnabledUser,
  relationDepart,
  getDeptTree,
  relationRoles
} from './api'
export default {
  components: { searchBar, tableList, BtnGroup },
  mixins: [dictMixin],
  data() {
    let validPhone = (rule, value, callback) => {
      let PhoneReg = /^1(3|4|5|7|8)\d{9}$/
      let IFlag = PhoneReg.test(value)
      if (!IFlag) {
        callback(new Error('请输入有效合法的手机号码！'))
      } else {
        callback()
      }
    }
    let checkIdNum = (rule, value, callback) => {
      const reg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9X]$/
      if (!value) {
        return callback(new Error('证件号码不能为空'))
      } else if (!reg.test(value)) {
        return callback(new Error('证件号码不正确'))
      } else {
        callback()
      }
    }
    let validUsername = (rule, value, callback) => {
      const reg = /^[a-zA-Z]+/
      if (!reg.test(value)) {
        return callback(new Error('请输入以英文字母开头'))
      } else {
        callback()
      }
    }
    return {
      searchConfig: {
        // 搜索栏配置
        data: {
          enabled: '',
          username: '',
          mobile: '',
          nickname: ''
        },
        config: [
          {
            label: '状态',
            labelWidth: '80px',
            prop: 'enabled',
            type: 'select',
            placeholder: '请选择',
            options: []
          },
          {
            label: '手机号',
            labelWidth: '80px',
            prop: 'mobile',
            type: 'text',
            placeholder: '请输入手机号'
          },
          {
            label: '昵称',
            labelWidth: '80px',
            prop: 'nickname',
            type: 'text',
            placeholder: '请输入昵称'
          },
          {
            label: '',
            labelWidth: '0px',
            prop: 'username',
            type: 'text',
            placeholder: '请输入用户账号'
          }
        ]
      },
      btnConfig: [
        {
          label: '新增',
          type: 'primary',
          plain: true,
          customClass: '',
          callback: 'addData'
        }
        // {
        //   label: '批量启用',
        //   type: 'primary',
        //   plain: true,
        //   customClass: '',
        //   callback: 'mutilOpen'
        // },
        // {
        //   label: '批量停用',
        //   type: 'danger',
        //   plain: true,
        //   customClass: '',
        //   callback: 'mutilClose'
        // }
      ],
      tableConfig: {
        data: [{ status: 1 }, { status: 2 }],
        config: [
          {
            prop: 'username',
            label: '用户账号',
            sortable: false
          },
          {
            prop: 'nickname',
            label: '用户昵称',
            sortable: true
          },
          {
            prop: 'mobile',
            label: '手机号',
            sortable: true
          },
          {
            prop: 'enabled',
            label: '状态',
            sortable: false
          }
        ],
        tableHeight: 0,
        currentPage: 1,
        pageSize: 10,
        total: 1
      },
      config: [
        {
          label: '取消',
          type: 'primary',
          plain: true,
          customClass: '',
          callback: 'cancel'
        },
        {
          label: '保存',
          type: 'primary',
          plain: true,
          customClass: '',
          callback: 'save'
        }
      ],
      dialogVisible: false,
      detailVisible: false,
      detailList: [
        {
          value: '001',
          label: '用户账号'
        },
        {
          value: '李小龙',
          label: '创建人'
        },
        {
          value: '李小龙',
          label: '用户名称'
        },
        {
          value: '2019-03-15',
          label: '创建时间'
        },
        {
          value: '13028392838',
          label: '手机号'
        },
        {
          value: '李小龙',
          label: '最后修改人'
        },
        {
          value: '0',
          label: '状态 '
        },
        {
          value: '2019-03-15 ',
          label: '最后修改时间'
        }
      ],
      dialogTitle: '',
      operateType: '',
      Form: {
        username: '',
        password: '',
        nickname: '',
        mobile: '',
        id: null,
        idCard: '',
        officialName: '',
        position: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户账号', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在6到18位字符', trigger: 'blur' },
          {
            required: true,
            validator: validUsername,
            trigger: 'blur'
          }
        ],
        idCard: [
          {
            required: true,
            validator: checkIdNum,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            validator: validPhone,
            trigger: 'blur'
          }
        ]
      },
      rule: {
        userRoles: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ]
      },
      form: {
        userRoles: '',
        userId: null
      },
      departVisible: false,
      forms: {
        deptId: null,
        userId: null
      },
      formsRules: {
        deptId: [{ required: true, message: '请选择部门', trigger: 'change' }]
      }
    }
  },
  created() {
    this.mxOpenStatusNum.unshift({ label: '所有', value: '' })
    this.searchConfig.config.forEach(e => {
      if (e.type === 'select') {
        if (e.prop === 'enabled') {
          e.options = this.mxOpenStatusNum
        }
      }
    })
  },
  mounted() {
    setTimeout(() => {
      this.getTableHeight()
      this.getList()
      this.getTree()
    }, 1)
    window.onresize = () => {
      this.getTableHeight()
    }
  },
  methods: {
    getTableHeight() {
      const user = document.getElementById('user').clientHeight
      let searchBox = document
        .getElementById('user')
        .getElementsByClassName('search-box')[0].clientHeight
      let pagination = document
        .getElementById('user')
        .getElementsByClassName('pagination')[0].clientHeight
      this.tableConfig.tableHeight = user - searchBox - pagination - 40 - 10 // 40为table-box的内边距，两个20位margin-bottom
    },
    async getTree() {
      await this.getDepartList().then(res => {})
    },
    getList() {
      let params = {
        enabled: this.searchConfig.data.enabled,
        mobile: this.searchConfig.data.mobile,
        nickname: this.searchConfig.data.nickname,
        username: this.searchConfig.data.username,
        pageNum: this.tableConfig.currentPage,
        pageSize: this.tableConfig.pageSize
      }
      getUserList(params).then(res => {
        if (res.status) {
          this.tableConfig.total = res.data.total
          this.tableConfig.data = res.data.records
        }
      })
    },
    handleSearch() {
      this.tableConfig.currentPage = 1
      this.getList()
    },
    handleBtnClick(res) {
      this[res] && this[res]()
    },
    handleReset() {
      this.getList()
    },
    changeSize(size) {
      this.tableConfig.pageSize = size
      this.tableConfig.currentPage = 1
      this.getList()
    },
    changePage(page) {
      this.tableConfig.currentPage = page
      this.getList()
    },
    addData() {
      this.operateType = 'add'
      this.dialogVisible = true
      this.dialogTitle = '新增用户'
    },
    mutilOpen() {},
    mutilClose() {},
    edit(row) {
      this.config[0].show = true
      this.operateType = 'edit'
      this.dialogVisible = true
      this.dialogTitle = '编辑用户'
      Object.keys(this.Form).forEach(e => {
        if (row.hasOwnProperty(e)) {
          this.Form[e] = row[e]
        }
      })
    },
    addDepart(row) {
      this.departVisible = true
      this.dialogTitle = '添加部门'
      this.forms.userId = row.id
      this.operateType = 'depart'
    },
    saveDepart() {
      let formName = this.operateType === 'depart' ? 'forms' : 'form'
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (formName === 'forms') {
            relationDepart(this.forms).then(res => {
              if (res.status) {
                this.$success('新增部门')
                this.departVisible = false
                this.tableConfig.currentPage = 1
                this.getList()
              }
            })
          } else {
            relationRoles(this.form).then(res => {
              if (res.status) {
                this.$success('分配用户')
                this.departVisible = false
                this.tableConfig.currentPage = 1
                this.getList()
              }
            })
          }
        } else {
          return false
        }
      })
    },
    async detail(row) {
      this.departVisible = true
      this.dialogTitle = '分配角色'
      this.form.userId = row.id
      this.operateType = 'role'
      this.roleList().then(res => {
        console.log(this.roleLists)
      })
    },
    resetPassword(row) {
      defaultPassword(row.id).then(res => {
        if (res.status) {
          this.$success('重置密码')
          this.getList()
        }
      })
    },
    open(row) {
      let params = {
        id: row.id,
        enabled: 1
      }
      updateEnabledUser(params).then(res => {
        if (res.status) {
          this.$success('用户启用')
          this.getList()
        }
      })
    },
    close(row) {
      let params = {
        id: row.id,
        enabled: 2
      }
      updateEnabledUser(params).then(res => {
        if (res.status) {
          this.$success('用户停用')
          this.getList()
        }
      })
    },
    // deleteUser() {
    //   this.$success('deleteUser')
    // },
    save() {
      this.$refs['Form'].validate(valid => {
        if (valid) {
          this.saveForm()
        } else {
          return false
        }
      })
    },
    saveForm() {
      if (this.operateType === 'add') {
        addUser(this.Form).then(res => {
          if (res.status) {
            this.$success('新增用户')
            this.dialogVisible = false
            this.tableConfig.currentPage = 1
            this.getList()
          }
        })
      } else {
        updateUser(this.Form).then(res => {
          if (res.status) {
            this.$success('修改用户')
            this.dialogVisible = false
            this.tableConfig.currentPage = 1
            this.getList()
          }
        })
      }
    },
    cancel() {
      this.dialogVisible = false
    },
    dialogOpen() {
      this.$nextTick(() => {
        if (this.operateType === 'add') {
          this.$refs['Form'].clearValidate()
        }
      })
    },
    departOpen() {
      this.$nextTick(() => {
        this.operateType === 'depart'
          ? this.$refs['forms'].clearValidate()
          : this.$refs['form'].clearValidate()
      })
    },
    departClose() {
      this.forms.deptId = null
    },
    dialogClosed() {
      for (let key in this.Form) {
        var type = this.$getDataType(this.Form[key])
        if (type === 'String') {
          this.Form[key] = ''
        } else if (type === 'Array') {
          this.Form[key] = []
        } else if (type === 'Object') {
          this.Form[key] = {}
        } else {
          this.Form[key] = null
        }
      }
      this.operateType = ''
    }
  }
}
</script>

<style lang='less'>
#user {
  flex: 1;
  .el-dialog__body {
    .el-form.el-form--inline.operate {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .el-form-item {
        width: 50%;
        padding-right: 30px;
        margin-right: 0;
      }
    }
  }
}
</style>
