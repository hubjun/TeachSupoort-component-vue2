<template>
  <div id="menu" ref="menu">
    <search-bar
      :datas="searchConfig"
      :config="btnConfig"
      @handle-search="handleSearch"
      @handle-click="handleBtnClick"
      @handle-reset="handleReset"
    ></search-bar>
    <div class="table-box">
      <table-children
        :tableConfig="tableConfig"
        :currentPage="tableConfig.currentPage"
        :pageSize="tableConfig.pageSize"
        :total="tableConfig.total"
        @size-change="changeSize"
        @page-change="changePage"
      >
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
          :align="item.align"
          :sortable="item.sortable"
          :header-align="item.headerAlign"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="240" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div>
              <el-button type="text" @click="add(scope.row)">新增</el-button>
              <el-button type="text" @click="edit(scope.row)">修改</el-button>
              <el-button class="font-color-red" type="text" @click="del(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </table-children>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="900px"
      :center="true"
      @closed="dialogClosed"
      @open="dialogOpen"
    >
      <div slot="title" class="dialog-title">
        <span>{{dialogTitle}}</span>
      </div>
      <el-form :inline="true" :model="Form" :rules="rules" ref="Form">
        <el-form-item
          :label="operateType==='detail'? '菜单名称:' : '菜单名称'"
          label-width="100px"
          prop="menuName"
        >
          <el-input v-model="Form.menuName" size="small" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item
          :label="operateType==='detail'? '菜单序号:' : '菜单序号'"
          label-width="100px"
          prop="sort"
        >
          <el-input
            v-model="Form.sort"
            size="small"
            placeholder="请输入菜单序号"
            @keyup.native="$limitInt(Form,'sort')"
            @blur="$limitInt(Form,'sort')"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="operateType==='detail'? '菜单链接:' : '菜单链接'"
          label-width="100px"
          prop="path"
          v-if="Form.menuPid !== 0"
        >
          <el-input v-model="Form.path" size="small" placeholder="请输入菜单链接"></el-input>
        </el-form-item>
        <el-form-item
          :label="operateType==='detail'? '是否隐藏:' : '是否隐藏'"
          label-width="100px"
          prop="hidden"
          class="hidden-item"
        >
          <el-radio v-model="Form.hidden" :label="1" name="hidden">是</el-radio>
          <el-radio v-model="Form.hidden" :label="0" name="hidden">否</el-radio>
        </el-form-item>
        <el-form-item
          :label="operateType==='detail'? '菜单类型:' : '菜单类型'"
          label-width="100px"
          prop="menuType"
        >
          <el-select v-model="Form.menuType">
            <el-option
              :label="option.label"
              :value="option.value"
              :key="option.value"
              v-for="option in mxMenuType"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="operateType==='detail'? '菜单描述:' : '菜单描述'"
          label-width="100px"
          prop="description"
        >
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入权限描述"
            v-model="Form.description"
            style="width:513px;"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="com-btn" type="info" @click="dialogVisible = false" plain>返回</el-button>
        <el-button class="com-btn" type="primary" @click="submitForm('Form')" plain>保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { dictMixin } from '@/mixins/dictMixin'
import searchBar from '@/components/searchBar/searchBar'
import tableChildren from '@/components/table/table_3'
import { menuTree, delMenu, createMenu, updateMenu, menuList } from './api'
export default {
  components: { searchBar, tableChildren },
  mixins: [dictMixin],
  computed: {},
  data() {
    return {
      searchConfig: {
        // 搜索栏配置
        data: {
          menuName: '',
          path: ''
        },
        config: [
          {
            label: '菜单名称',
            labelWidth: '80px',
            prop: 'menuName',
            type: 'text',
            placeholder: '请输入菜单名称'
          },
          {
            label: '菜单链接',
            labelWidth: '80px',
            prop: 'path',
            type: 'text',
            placeholder: '请输入菜单链接'
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
      ],
      tableConfig: {
        data: [
          {
            id: 1,
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }
        ],
        config: [
          {
            label: '菜单名称',
            prop: 'menuName',
            headerAlign: 'center'
          },
          {
            label: '菜单链接',
            prop: 'path',
            align: 'center'
          },
          {
            label: '菜单编码',
            prop: 'sort',
            align: 'center'
          },
          {
            label: '菜单类型',
            prop: 'typeName',
            align: 'center'
          },
          {
            label: '是否隐藏',
            prop: 'state',
            align: 'center'
          }
        ],
        currentPage: 1,
        pageSize: 10,
        total: 1,
        height: 0
      },
      dialogVisible: false,
      dialogTitle: '',
      operateType: '',
      Form: {
        menuName: '',
        sort: '',
        path: '',
        menuType: 1,
        parentId: 0,
        hidden: '',
        description: '',
        id: null
      },
      rules: {}
    }
  },
  created() {},
  mounted() {
    setTimeout(() => {
      this.getTableHeight()
      this.getTreeList()
    }, 1)
    window.onresize = () => {
      this.getTableHeight()
    }
  },
  methods: {
    getTableHeight() {
      const menu = document.getElementById('menu').clientHeight
      let searchBox = document
        .getElementById('menu')
        .getElementsByClassName('search-box')[0].clientHeight
      let pagination = document
        .getElementById('menu')
        .getElementsByClassName('pagination')[0].clientHeight
      this.tableConfig.height = menu - searchBox - pagination - 40 - 10 // 40为table-box的内边距，两个20位margin-bottom
    },
    getTreeList() {
      menuTree().then(res => {
        if (res.status) {
          this.recursive(res.data)
          this.tableConfig.data = res.data
          this.tableConfig.total = res.data.length
        }
      })
    },
    recursive(array) {
      if (array.length > 0) {
        array.forEach(e => {
          e.typeName = this.mxMenuType.filter(
            es => e.menuType === es.value
          )[0].label
          e.state = e.hidden ? '是' : '否'
          if (e.children && e.children.length > 0) {
            this.recursive(e.children)
          }
        })
      }
    },
    handleSearch(res) {
      let pageNum = this.tableConfig.currentPage
      let pageSize = this.tableConfig.pageSize
      let params = {
        pageNum,
        pageSize,
        ...this.searchConfig.data
      }
      menuList(params).then(res => {
        if(res.status) {
          this.$success('查询菜单')
          this.tableConfig.data = res.data.records
          this.tableConfig.total = res.data.total
        }
      })
    },
    handleBtnClick(res) {
      this[res] && this[res]()
    },
    handleReset() {
      this.getTreeList()
    },
    changeSize(size) {
      this.tableConfig.currentPage = 1
      this.tableConfig.pageSize = size
      this.handleSearch()
    },
    changePage(page) {
      this.tableConfig.currentPage = page
      this.handleSearch()
    },
    addData() {
      this.dialogVisible = true
      this.dialogTitle = '新增菜单'
      this.operateType = 'add'
      this.Form.parentId = 0
      this.Form.hidden = 0
    },
    add(row) {
      this.dialogVisible = true
      this.dialogTitle = '新增菜单'
      this.operateType = 'add'
      this.Form.parentId = row.id
      this.Form.hidden = 0
    },
    edit(row) {
      this.dialogVisible = true
      this.dialogTitle = '修改菜单'
      this.operateType = 'edit'
      Object.keys(this.Form).forEach(e => {
        if (row.hasOwnProperty(e)) {
          this.Form[e] = row[e]
        }
      })
      this.Form.hidden = Number(row.hidden)
    },
    del(row) {
      delMenu(row.id).then(res => {
        if (res.status) {
          this.tableConfig.currentPage = 1
          this.getTreeList()
        }
      })
    },
    dialogOpen() {
      this.$nextTick(() => {
        this.$refs['Form'].clearValidate()
      })
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
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.saveForm()
        }
      })
    },
    saveForm() {
      let hidden = Boolean(this.Form.hidden)
      let params = {
        ...this.Form,
        hidden
      }
      if (this.operateType === 'add') {
        createMenu(params).then(res => {
          if (res.status) {
            this.dialogVisible = false
            this.getTreeList()
            setTimeout(() => {
              document.querySelector(
                '.table_3 .el-table__body-wrapper'
              ).scrollTop = document.querySelector(
                '.table_3 .el-table__body-wrapper'
              ).scrollHeight
            }, 50)
          }
        })
      } else {
        updateMenu(params).then(res => {
          if (res.status) {
            this.dialogVisible = false
            this.getTreeList()
          }
        })
      }
    }
  }
}
</script>

<style lang='less'>
#menu {
  flex: 1;
  .el-dialog__body {
    .el-form {
      .el-form-item {
        width: 50%;
        margin-right: 0;
        padding-right: 30px;
        display: inline-block;
        .el-form-item__content {
          width: calc(100% - 110px);
        }
        &:last-child {
          width: 100%;
        }
      }
    }
  }
}
</style>
