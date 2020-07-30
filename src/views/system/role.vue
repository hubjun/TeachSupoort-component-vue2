<template>
  <div id="role" ref="role">
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
        @select="handleSelectionChange"
        @size-change="changeSize"
        @page-change="changePage"
      >
        <el-table-column type="selection" align="center" width="55" :show-overflow-tooltip="true"></el-table-column>
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
            <div v-if="item.prop === 'status'">
              <div v-if="scope.row[item.prop] === 1" class="com-status-success">
                <!-- <span class="iconfont">&#xe626;</span> -->
                {{scope.row[item.prop]===1?'启用':'停用'}}
              </div>
              <div v-if="scope.row[item.prop] === 2" class="com-status-danger">
                <!-- <span class="iconfont">&#xe626;</span> -->
                {{scope.row[item.prop]===1?'启用':'停用'}}
              </div>
            </div>
            <div v-else>{{scope.row[item.prop]}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="310" fixed="right">
          <template slot-scope="scope">
            <div>
              <el-button class="edit" type="text" @click="edit(scope.row)">修改</el-button>
              <el-button class="edit" type="text" @click="allocation(scope.row)">权限分配</el-button>
              <el-button class="font-color-red" type="text" @click="del(scope.row)">删除</el-button>
              <!-- <el-button type="text" v-if="scope.row.status === 2" @click="open(scope.row)">启用</el-button> -->
              <el-button
                type="text"
                class="font-color-red"
                v-if="scope.row.status === 1"
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
      width="1400px"
      @closed="dialogClosed"
      :center="true"
    >
      <div slot="title" class="dialog-title">
        <span>{{dialogTitle}}</span>
      </div>
      <div class="dialog-content">
        <com-power
          :powerList="powerList"
          :rolePowerVisi="rolePowerVisi"
          :rolePowerDetail="rolePowerDetail"
          :roleMenu="roleMenu"
          @handle-look="handleLook"
          @handle-check-all="handleCheckAll"
          @handle-all-group-change="checkAllGroupChange"
        ></com-power>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="com-btn" type="info" @click="dialogVisible = false" plain>取消</el-button>
        <el-button class="com-btn" type="primary" @click="submitForm()" plain>保存</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="visible"
      :close-on-click-modal="false"
      width="400px"
      @closed="closed"
      @open="opened"
      :center="true"
    >
      <div slot="title" class="dialog-title">
        <span>{{dialogTitle}}</span>
      </div>
      <el-form :inline="true" :model="Form" :rules="rules" ref="Form">
        <el-form-item label="角色名称" label-width="75px" prop="roleName">
          <el-input v-model="Form.roleName" size="small" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="75px" prop="roleDesc">
          <el-input v-model="Form.roleDesc" size="small" placeholder="请输入角色描述"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="com-btn" type="info" @click="visible = false" plain>取消</el-button>
        <el-button class="com-btn" type="primary" @click="submit('Form')" plain>保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { dictMixin } from '@/mixins/dictMixin'
import searchBar from '@/components/searchBar/searchBar'
import tableList from '@/components/table'
import ComPower from '@/components/comPower/comPower'
import {
  menuTree,
  rolePage,
  createRole,
  updateRole,
  deleteRole,
  batchDeleteRole,
  relationRole,
  getRole
} from './api'
export default {
  components: { searchBar, tableList, ComPower },
  mixins: [dictMixin],
  // computed: {
  //   rolePowerVisi() {
  //     return false
  //   }
  // },
  data() {
    return {
      powerList: {
        powerType: '菜单权限',
        id: 'comPower',
        roleList: []
      },
      rolePowerDetail: {},
      rolePowerVisi: false,
      roleMenu: [
        {
          name: '基本信息',
          id: 'badicInfo',
          show: false
        },
        {
          name: '权限配置',
          id: 'powerSet',
          show: true
        }
      ],
      searchConfig: {
        // 搜索栏配置
        data: {
          roleName: ''
        },
        config: [
          {
            label: '角色名称',
            labelWidth: '80px',
            prop: 'roleName',
            type: 'text',
            placeholder: '请输入角色名称'
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
        },
        {
          label: '批量删除',
          type: 'danger',
          plain: true,
          customClass: '',
          callback: 'mutilDel'
        }
      ],
      tableConfig: {
        data: [{ status: 1 }, { status: 2 }],
        config: [
          {
            prop: 'roleName',
            label: '角色名称',
            sortable: false
          },
          {
            prop: 'roleDesc',
            label: '角色描述',
            sortable: false
          }
        ],
        selectData: [],
        tableHeight: 0,
        currentPage: 1,
        pageSize: 10,
        total: 1
      },
      dialogVisible: false,
      dialogTitle: '',
      visible: false,
      Form: {
        roleName: '',
        roleDesc: '',
        id: null
      },
      operate: '',
      rules: {}
    }
  },
  created() {
    this.mxOpenStatusNum.unshift({ label: '所有', value: '' })
    this.searchConfig.config.forEach(e => {
      if (e.type === 'select') {
        if (e.prop === 'status') {
          e.options = this.mxOpenStatusNum
        }
      }
    })
  },
  mounted() {
    setTimeout(() => {
      this.getTableHeight()
      this.getList()
      this.getRoleList()
    }, 1)
    window.onresize = () => {
      this.getTableHeight()
    }
  },
  methods: {
    getTableHeight() {
      const role = document.getElementById('role').clientHeight
      let searchBox = document
        .getElementById('role')
        .getElementsByClassName('search-box')[0].clientHeight
      let pagination = document
        .getElementById('role')
        .getElementsByClassName('pagination')[0].clientHeight
      this.tableConfig.tableHeight = role - searchBox - pagination - 40 - 10 // 40为table-box的内边距，两个20位margin-bottom
    },
    getRoleList() {
      menuTree().then(res => {
        if (res.status) {
          let arr = []
          res.data.forEach(e => {
            let obj = {}
            obj['roleName'] = e.menuName
            obj['id'] = e.id
            obj['menupath'] = e.path
            obj['defaultRole'] = false
            obj['selfDefinedRole'] = 'sys'
            obj['rolePower'] = []
            if (e.children && e.children.length > 0) {
              e.children.forEach(es => {
                let Obj = {}
                Obj['rolePowerType'] = es.menuName
                Obj['rolePowerTypeId'] = es.id
                Obj['menupath'] = es.path
                Obj['rolePowerNow'] = []
                Obj['rolePowerList'] = []
                if (es.children.length > 0) {
                  es.children.forEach(Es => {
                    let object = {}
                    object['name'] = Es.menuName
                    object['fieldId'] = Es.id
                    object['menupath'] = Es.path
                    Obj['rolePowerList'].push(object)
                  })
                }
                obj['rolePower'].push(Obj)
              })
            }
            arr.push(obj)
          })
          this.powerList.roleList = arr
        }
      })
    },
    getList() {
      let params = {
        pageNum: this.tableConfig.currentPage,
        pageSize: this.tableConfig.pageSize,
        roleName: this.searchConfig.data.roleName
      }
      rolePage(params).then(res => {
        if (res.status) {
          this.tableConfig.total = res.data.total
          this.tableConfig.data = res.data.records
        }
      })
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.saveForm()
        } else {
          return false
        }
      })
    },
    submitForm() {
      let menuIds = []
      this.powerList.roleList.forEach(e => {
        e.rolePower.forEach(es => {
           menuIds = menuIds.concat(es.rolePowerNow)
          if(es.rolePowerNow.length > 0) {
            menuIds.push(es.rolePowerTypeId)
            menuIds.push(e.id)
          }
        })
      })
      menuIds = Array.from(new Set(menuIds))
      let params = {
        roleId: this.Form.id,
        menuIds
      }
      relationRole(params).then(res => {
        if(res.status) {
          this.$success('角色分配')
          this.getList()
          this.dialogVisible = false
        }
      })
    },
    saveForm() {
      if (this.operate === 'add') {
        createRole(this.Form).then(res => {
          if (res.status) {
            this.tableConfig.currentPage = 1
            this.getList()
            this.visible = false
            this.$success('新增用户')
          }
        })
      } else {
        updateRole(this.Form).then(res => {
          if (res.status) {
            this.tableConfig.currentPage = 1
            this.getList()
            this.visible = false
            this.$success('修改用户')
          }
        })
      }
    },
    handleSelectionChange(data) {
      this.tableConfig.selectData = data
    },
    handleSearch() {
      this.tableConfig.currentPage = 1
      this.getList()
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
    handleBtnClick(res) {
      this[res] && this[res]()
    },
    addData() {
      this.operate = 'add'
      this.visible = true
      this.dialogTitle = '新增角色'
    },
    edit(row) {
      this.operate = 'edit'
      this.visible = true
      this.dialogTitle = '修改角色'
      Object.keys(this.Form).forEach(e => {
        if (row.hasOwnProperty(e)) {
          this.Form[e] = row[e]
        }
      })
    },
    allocation(row) {
      this.dialogVisible = true
      this.dialogTitle = '权限分配'
      this.Form.id = row.id
      getRole(row.id).then(res => {
        if(res.status) {
          
        }
      })
    },

    del(row) {
      deleteRole(row.id).then(res => {
        if (res.status) {
          this.tableConfig.currentPage = 1
          this.getList()
          this.$success('删除用户')
        }
      })
    },
    mutilDel() {
      if (this.tableConfig.selectData.length > 0) {
        let ids = []
        this.tableConfig.selectData.forEach(e => {
          ids.push(e.id)
        })
        batchDeleteRole(ids).then(res => {
          if (res.status) {
            this.tableConfig.currentPage = 1
            this.getList()
            this.$success('批量删除用户')
          }
        })
      } else {
        this.$info('请勾选角色')
      }
    },
    opened() {
      this.$nextTick(() => {
        this.$refs['Form'].clearValidate()
      })
    },
    closed() {
      this.Form.roleName = ''
      this.Form.roleDesc = ''
    },
    dialogClosed() {
      this.rolePowerVisi = false
    },
    handleLook(item) {
      if (item.selfDefinedRole !== 'sys') {
        this.roleMenu[0].show = true
      } else {
        this.roleMenu[0].show = false
      }
      this.rolePowerVisi = true
      this.rolePowerDetail = item
    },
    handleCheckAll(item) {
      let allPower = []
      item.rolePowerList.map((item, index) => {
        allPower.push(item.fieldId)
      })

      if (item.rolePowerNow.length !== item.rolePowerList.length) {
        item.rolePowerNow = allPower
      } else {
        item.rolePowerNow = []
      }
    },
    checkAllGroupChange(item, index) {
      let length = item.rolePowerList.length
      let data = this.rolePowerDetail.rolePower[index].rolePowerNow
    }
  }
}
</script>

<style>
#role {
  flex: 1;
}
</style>
