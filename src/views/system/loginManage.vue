<template>
  <div id="loginManage" ref="loginManage">
    <search-bar :datas="searchConfig" @handle-search="handleSearch" @handle-reset="handleReset"></search-bar>
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
                {{scope.row[item.prop]===1?'在线':'离线'}}
              </div>
              <div v-if="scope.row[item.prop] === 2" class="com-status-danger">
                <!-- <span class="iconfont">&#xe626;</span> -->
                {{scope.row[item.prop]===1?'在线':'离线'}}
              </div>
            </div>
            <div v-else>{{scope.row[item.prop]}}</div>
          </template>
        </el-table-column>
      </table-list>
    </div>
  </div>
</template>

<script>
import { dictMixin } from '@/mixins/dictMixin'
import searchBar from '@/components/searchBar/searchBar'
import tableList from '@/components/table'
export default {
  components: { searchBar, tableList },
  mixins: [dictMixin],
  data() {
    return {
      searchConfig: {
        // 搜索栏配置
        data: {
          status: '',
          username: ''
        },
        config: [
          {
            label: '状态',
            labelWidth: '80px',
            prop: 'status',
            type: 'select',
            placeholder: '请选择'
          },
          {
            label: '',
            labelWidth: '0px',
            prop: 'username',
            type: 'text',
            placeholder: '请输入用户名称'
          }
        ]
      },
      tableConfig: {
        data: [{ status: 1 }, { status: 2 }],
        config: [
          {
            prop: 'reqCode',
            label: '用户账号',
            sortable: false
          },
          {
            prop: 'reqDate',
            label: '用户名称',
            sortable: true
          },
          {
            prop: 'assetName',
            label: '联系电话',
            sortable: true
          },
          {
            prop: 'status',
            label: '状态',
            sortable: false
          }
        ],
        tableHeight: 0,
        currentPage: 1,
        pageSize: 10,
        total: 1
      }
    }
  },
  created() {
    this.mxLineStatus.unshift({ label: '所有', value: '' })
    this.searchConfig.config.forEach(e => {
      if (e.type === 'select') {
        if (e.prop === 'status') {
          e.options = this.mxLineStatus
        }
      }
    })
  },
  mounted() {
    setTimeout(() => {
      this.getTableHeight()
      // this.getList()
    }, 1)
    window.onresize = () => {
      this.getTableHeight()
    }
  },
  methods: {
    getTableHeight() {
      const loginManage = document.getElementById('loginManage').clientHeight
      let searchBox = document
        .getElementById('loginManage')
        .getElementsByClassName('search-box')[0].clientHeight
      let pagination = document
        .getElementById('loginManage')
        .getElementsByClassName('pagination')[0].clientHeight
      this.tableConfig.tableHeight =
        loginManage - searchBox - pagination - 40 - 10 // 40为table-box的内边距，两个20位margin-bottom
    },
    getList() {},
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
    }
  }
}
</script>

<style>
#loginManage {
  flex: 1;
}
</style>
