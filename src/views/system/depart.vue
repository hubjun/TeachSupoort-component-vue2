<template>
  <div id="depart" ref="depart">
    <search-bar
      :datas="searchConfig"
      :config="btnConfig"
      @handle-search="handleSearch"
      @handle-click="handleBtnClick"
      @handle-reset="handleReset"
    ></search-bar>
    <div class="departContent" :style="{height:depart.height}">
      <div class="depart-tree">
        <el-tree
          @node-click="nodeClick"
          :data="data"
          node-key="id"
          accordion
          :default-expanded-keys="expandArr"
          ref="departTree"
          highlight-current
          :filter-node-method="filterNode"
          :expand-on-click-node="false"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{data.deptName}}</span>
            <span class="icon">
              <i class="el-icon-edit el-icon-plus" @click.stop="append(node, data)"></i>
            </span>
          </span>
        </el-tree>
      </div>
      <el-form :inline="true" :model="Form" ref="Form" :rules="rules" v-if="nodeShow">
        <div class="depart-detail">
          部门信息
          <div></div>
        </div>
        <ul :class="{'detail':operateType === 'detail'}">
          <li>
            <el-form-item label="部门编码" label-width="110px" prop="deptCode">
              <el-input
                v-show="operateType !== 'detail'"
                v-model="Form.deptCode"
                size="small"
                disabled
              ></el-input>
              <el-tooltip
                v-show="operateType === 'detail'"
                effect="dark"
                :content="Form.deptCode"
                placement="right"
              >
                <span>{{Form.deptCode}}</span>
              </el-tooltip>
            </el-form-item>
          </li>
          <li>
            <el-form-item label="部门名称" label-width="110px" prop="deptName">
              <el-input
                v-show="operateType  !== 'detail'"
                v-model="Form.deptName"
                size="small"
                placeholder="请输入部门名称"
              ></el-input>
              <el-tooltip
                v-show="operateType  === 'detail'"
                effect="dark"
                :content="Form.deptName"
                placement="right"
              >
                <span>{{Form.deptName}}</span>
              </el-tooltip>
            </el-form-item>
          </li>
          <li>
            <el-form-item label="拼音码" label-width="110px" prop="pinyinCode">
              <el-input
                v-show="operateType !== 'detail'"
                v-model="Form.pinyinCode"
                size="small"
                disabled
              ></el-input>
              <el-tooltip
                effect="dark"
                :content="Form.pinyinCode"
                v-show="operateType === 'detail'"
                placement="right"
              >
                <span>{{Form.pinyinCode}}</span>
              </el-tooltip>
            </el-form-item>
          </li>

          <li>
            <el-form-item label="五笔码" label-width="110px" prop="fiveStrokeCode">
              <el-input
                v-show="operateType !== 'detail'"
                v-model="Form.fiveStrokeCode"
                size="small"
                disabled
              ></el-input>
              <el-tooltip
                effect="dark"
                v-show="operateType === 'detail'"
                :content="Form.fiveStrokeCode"
                placement="right"
              >
                <span>{{Form.fiveStrokeCode}}</span>
              </el-tooltip>
            </el-form-item>
          </li>
          <li>
            <el-form-item label="创建人" label-width="110px" prop="createBy">
              <el-input
                v-show="operateType !== 'detail'"
                v-model="Form.createBy"
                size="small"
                disabled
              ></el-input>
              <el-tooltip
                effect="dark"
                v-show="operateType === 'detail'"
                :content="Form.createBy"
                placement="right"
              >
                <span>{{Form.createBy}}</span>
              </el-tooltip>
            </el-form-item>
          </li>
          <li>
            <el-form-item label="创建时间" label-width="110px" prop="createTime">
              <el-tooltip
                effect="dark"
                v-show="operateType !== 'detail'"
                :content="Form.createTime"
                placement="right"
              >
                <el-input v-model="Form.createTime" size="small" disabled></el-input>
              </el-tooltip>

              <el-tooltip
                effect="dark"
                v-show="operateType === 'detail'"
                :content="Form.createTime"
                placement="right"
              >
                <span>{{Form.createTime}}</span>
              </el-tooltip>
            </el-form-item>
          </li>
          <li>
            <el-form-item label="最后修改人" label-width="110px" prop="updateBy">
              <el-input
                v-show="operateType !== 'detail'"
                v-model="Form.updateBy"
                size="small"
                disabled
              ></el-input>
              <el-tooltip
                effect="dark"
                v-show="operateType === 'detail'"
                :content="Form.updateBy"
                placement="right"
              >
                <span>{{Form.updateBy}}</span>
              </el-tooltip>
            </el-form-item>
          </li>
          <li>
            <el-form-item label="最后修改时间" label-width="110px" prop="updateTime">
              <el-input
                v-show="operateType !== 'detail'"
                v-model="Form.updateTime"
                size="small"
                disabled
              ></el-input>
              <el-tooltip
                effect="dark"
                v-show="operateType === 'detail'"
                :content="Form.updateTime"
                placement="right"
              >
                <span>{{Form.updateTime}}</span>
              </el-tooltip>
            </el-form-item>
          </li>
          <li>
            <el-form-item label="上级节点" label-width="110px" prop="prevNode">
              <!-- <el-select
                v-show="operateType !== 'detail'"
                v-model="Form.status"
                filterable
                placeholder="请选择上级节点"
              >
                <el-option
                  v-for="item in prevNodeList"
                  :key="item.node"
                  :label="item.nodeName"
                  :value="item.node"
                ></el-option>
              </el-select>-->
              <el-input
                v-show="operateType !== 'detail'"
                v-model="Form.prevNode"
                size="small"
                disabled
              ></el-input>
              <el-tooltip
                v-show="operateType === 'detail'"
                effect="dark"
                :content="Form.prevNode"
                placement="right"
              >
                <span>{{Form.prevNode}}</span>
              </el-tooltip>
            </el-form-item>
          </li>
          <li>
            <el-form-item label="状态" label-width="110px" prop="status">
              <!-- <el-select
                v-show="operateType !== 'detail'"
                v-model="Form.status"
                filterable
                placeholder="请选择状态"
              >
                <el-option
                  v-for="item in statusArr"
                  :key="item.status"
                  :label="item.statusName"
                  :value="item.status"
                ></el-option>
              </el-select>-->
              <div
                :class="{'status':true,'end':Form&&Form.status===1}"
              >{{Form &&Form.status===1?'已启用':'已停用'}}</div>
              <!-- <el-tooltip
                v-show="operateType === 'detail'"
                effect="dark"
                :content="Form.status"
                placement="right"
              >
                <span>{{Form.status}}</span>
              </el-tooltip>-->
            </el-form-item>
          </li>
        </ul>
      </el-form>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="440px"
      @open="dialogOpen"
      @close="dialogClosed"
      :center="true"
    >
      <div slot="title" class="dialog-title">
        <span>{{dialogTitle}}</span>
      </div>
      <el-form :inline="true" :model="form" :rules="rule" ref="form">
        <el-form-item label="上级节点" label-width="85px">
          <div style="color:#333">{{form.prevLevel}}</div>
        </el-form-item>
        <el-form-item label="节点名称" label-width="85px" prop="deptName">
          <el-input clearable v-model="form.deptName" placeholder="请输入节点名称"></el-input>
        </el-form-item>
        <el-form-item label="序号" label-width="85px" prop="sort">
          <el-input clearable v-model="form.sort" placeholder="请输入序号"></el-input>
        </el-form-item>
        <el-form-item label="状态" label-width="85px" prop="status">
          <el-select v-model="form.status" clearable filterable>
            <el-option
              v-for="option in statusArr"
              :label="option.statusName"
              :value="option.status"
              :key="option.status"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <btn-group :config="config" @handle-click="handleBtnClick"></btn-group>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { dictMixin } from '@/mixins/dictMixin'
import tableList from '@/components/table'
import searchBar from '@/components/searchBar/searchBar'
import BtnGroup from '@/components/common/BtnGroup.vue'
import { getDeptTree, addDepart, deleteDepart, enabledDept } from './api'
export default {
  components: { searchBar, tableList, BtnGroup },
  mixins: [dictMixin],
  data() {
    return {
      searchConfig: {
        // 搜索栏配置
        data: {
          status: '',
          deptName: ''
        },
        config: [
          {
            label: '状态',
            labelWidth: '80px',
            prop: 'status',
            type: 'select',
            placeholder: '请选择',
            options: []
          },
          {
            label: '',
            labelWidth: '0px',
            prop: 'deptName',
            type: 'text',
            placeholder: '请输入部门名称/拼音码/五笔码'
          }
        ]
      },
      operateType: 'detail',
      data: [],
      expandArr: [],
      status: '',
      deptCode: '',
      statusArr: [
        {
          status: 1,
          statusName: '启用'
        },
        {
          status: 2,
          statusName: '停用'
        }
      ],
      btnConfig: [
        {
          label: '取消',
          type: 'info',
          plain: true,
          customClass: '',
          show: true,
          callback: 'cancel'
        },
        {
          label: '保存',
          type: 'primary',
          plain: true,
          customClass: '',
          show: true,
          callback: 'save'
        },
        {
          label: '编辑',
          type: 'primary',
          plain: true,
          customClass: '',
          show: true,
          callback: 'edit'
        },
        {
          label: '删除',
          type: 'danger',
          plain: true,
          customClass: '',
          show: true,
          callback: 'delete'
        },
        {
          label: '启用',
          type: 'primary',
          plain: true,
          customClass: '',
          show: true,
          callback: 'open'
        },
        {
          label: '停用',
          type: 'danger',
          plain: true,
          customClass: '',
          show: true,
          callback: 'close'
        }
      ],
      nodeList: [
        {
          node: '0',
          nodeName: '根节点'
        },
        {
          node: '1',
          nodeName: '叶子节点'
        }
      ],
      prevNodeList: [
        {
          node: '0',
          nodeName: '高值'
        },
        {
          node: '1',
          nodeName: '低值'
        }
      ],
      config: [
        {
          label: '取消',
          type: 'primary',
          plain: true,
          customClass: '',
          callback: 'Cancel'
        },
        {
          label: '保存',
          type: 'primary',
          plain: true,
          customClass: '',
          callback: 'saveForm'
        }
      ],
      Form: {
        deptCode: '',
        deptName: '123',
        pinyinCode: '',
        fiveStrokeCode: '',
        createBy: '',
        createTime: '',
        updateBy: '',
        updateTime: '',
        prevNode: '',
        parentId: null,
        nodeType: '',
        status: '',
        id: null,
        children: null
      },
      id: null,
      dialogVisible: false,
      dialogTitle: '',
      form: {
        prevLevel: '',
        levelName: '',
        deptName: '',
        sort: '',
        status: null
      },
      rule: {
        deptName: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ]
      },
      rules: {
        deptName: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ]
      },
      depart: {
        height: 0
      },
      nodeShow: false
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
      this.getDepartHeight()
      this.getTree()
    }, 1)
    window.onresize = () => {
      this.getDepartHeight()
    }
  },
  methods: {
    getDepartHeight() {
      const depart = document.getElementById('depart').clientHeight
      let searchBox = document
        .getElementById('depart')
        .getElementsByClassName('search-box')[0].clientHeight
      this.depart.height = depart - searchBox - 10 + 'px' // 40为table-box的内边距，两个20位margin-bottom
    },
    getTree() {
      getDeptTree().then(res => {
        if (res.status) {
          this.data = res.data
          this.expandArr = [res.data[0].id]
        }
      })
    },
    handleSearch() {
      this.nodeShow = false
      this.$refs.departTree.filter(this.searchConfig.data)
    },
    handleBtnClick(res) {
      this[res] && this[res]()
    },
    handleReset() {
      this.nodeShow = false
      this.getTree()
    },
    nodeClick(data) {
      this.nodeShow = true
      this.operateType = 'detail'
      Object.keys(this.Form).forEach(e => {
        if (data.hasOwnProperty(e)) {
          this.Form[e] = data[e]
        }
      })
      if (data.parentId === 0) {
        this.btnConfig.forEach(e => {
          e.show = true
        })
        return false
      }
      this.btnConfig.forEach(e => {
        e.show = false
        if (e.callback !== 'cancel' && e.callback !== 'save') {
          e.show = false
          if (data.status === 1) {
            if (e.callback === 'open') {
              e.show = true
            }
          } else if (data.status === 2) {
            if (e.callback === 'close') {
              e.show = true
            }
          } else if (data.status === 1) {
            if (e.callback === 'open') {
              e.show = true
            }
          }
        } else {
          e.show = true
        }
      })
    },
    append(node, data) {
      this.form.parentId = data.id
      this.form.prevLevel = data.deptName
      this.id = data.id
      this.dialogVisible = true
    },
    cancel() {
      this.operateType = 'detail'
      this.btnConfig.forEach(e => {
        e.show = false
        if (e.callback !== 'cancel' && e.callback !== 'save') {
          e.show = false
          if (this.Form.status === 1) {
            if (e.callback === 'open') {
              e.show = true
            }
          } else if (this.Form.status === 2) {
            if (e.callback === 'close') {
              e.show = false
            }
          }
        } else {
          e.show = true
        }
      })
    },
    edit() {
      this.btnConfig.forEach(e => {
        e.show = false
        if (
          e.callback === 'open' ||
          e.callback === 'close' ||
          e.callback === 'edit' ||
          e.callback === 'delete'
        ) {
          e.show = true
        }
      })
      this.operateType = 'edit'
    },
    filterNode(value, data) {
      if (value.status === '' && value.deptName === '') {
        return true
      } else if (value.status !== '' && value.deptName === '') {
        return data.status === value.status
      } else if (value.status === '' && value.deptName !== '') {
        return (
          data.deptName.indexOf(value.deptName) !== -1 ||
          (data.fiveStrokeCode &&
            data.fiveStrokeCode.indexOf(value.deptName) !== -1) ||
          (data.pinyinCode && data.pinyinCode.indexOf(value.deptName) !== -1)
        )
      } else if (value.status !== '' && value.deptName !== '') {
        return (
          data.status === value.status &&
          (data.deptName.indexOf(value.deptName) !== -1 ||
            (data.fiveStrokeCode &&
              data.fiveStrokeCode.indexOf(value.deptName) !== -1) ||
            (data.pinyinCode && data.pinyinCode.indexOf(value.deptName) !== -1))
        )
      }
    },
    delete() {
      if (this.Form.children && this.Form.children.length > 0) {
        this.$message.info('当前部门不能删除')
        return false
      }
      deleteDepart(this.Form.id).then(res => {
        if (res.status) {
          this.$success('删除部门')
          this.nodeShow = false
          this.getTree()
          // this.$router.go(0)
        }
      })
    },
    open(row) {
      let params = {
        id: this.Form.id,
        enabled: 1
      }
      enabledDept(params).then(res => {
        if (res.status) {
          this.$success('启用部门')
          this.nodeShow = false
          this.getTree()
        }
      })
    },
    close(row) {
      if (this.Form.children && this.Form.children.length > 0) {
        this.$message.info('当前部门不能删除')
        return false
      }
      let params = {
        id: this.Form.id,
        enabled: 2
      }
      enabledDept(params).then(res => {
        if (res.status) {
          this.$success('停用部门')
          this.nodeShow = false
          this.getTree()
        }
      })
    },
    Cancel() {
      this.dialogVisible = false
    },
    saveForm() {
      let params = {
        deptName: this.form.deptName,
        parentId: this.form.parentId,
        sort: this.form.sort,
        status: this.form.status
      }
      addDepart(params).then(res => {
        if (res.status) {
          this.$success('新增部门')
          this.dialogVisible = false
          this.getTree()
        }
      })
    },
    recursive(data, newChild, id) {
      if (data && data.length > 0) {
        data.forEach(e => {
          if (e.id === id) {
            if (!e.children) {
              this.$set(e, 'children', [])
            }
            e.children.push(newChild)
            this.dialogVisible = false
          }
          if (e.children && e.children.length > 0) {
            this.recursive(e.children, newChild, this.id)
          }
        })
      }
    },
    save() {
      this.$success('save')
    },
    dialogOpen() {
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },
    dialogClosed() {
      for (let key in this.form) {
        var type = this.$getDataType(this.form[key])
        if (type === 'String') {
          this.form[key] = ''
        } else if (type === 'Array') {
          this.form[key] = []
        } else if (type === 'Object') {
          this.form[key] = {}
        } else {
          this.form[key] = null
        }
      }
      this.operateType = ''
    }
  }
}
</script>

<style lang='less'>
#depart {
  flex: 1;
}
</style>
