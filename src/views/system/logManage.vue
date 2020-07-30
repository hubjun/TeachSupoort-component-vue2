<template>
  <div id="logManage" ref="logManage">
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
        ></el-table-column>
        <el-table-column label="操作" align="center" width="75" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div>
              <el-button class="detail" type="text" @click="detail(scope.row)">详情</el-button>
            </div>
          </template>
        </el-table-column>
      </table-list>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="780px"
      @closed="dialogClosed"
      :center="true"
    >
      <div slot="title" class="dialog-title">
        <span>{{dialogTitle}}</span>
      </div>
      <div class="dialog-content">
        <div class="content-item clearfix" v-for="(item, index) in logDetail" :key="index">
          <span>{{item.name}}</span>
          <span>：</span>
          <span>{{item.value}}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
  </div>
</template>

<script>
import { dictMixin } from '@/mixins/dictMixin'
import searchBar from '@/components/searchBar/searchBar'
import tableList from '@/components/table'
import { getLogList } from './api'
export default {
  components: { searchBar, tableList },
  mixins: [dictMixin],
  data() {
    return {
      searchConfig: {
        // 搜索栏配置
        data: {
          operateName: '',
          time: ''
        },
        config: [
          {
            label: '操作人',
            labelWidth: '80px',
            prop: 'operateName',
            type: 'text',
            placeholder: '请选择'
          },
          {
            label: '操作时间',
            labelWidth: '80px',
            prop: 'time',
            type: 'date',
            placeholder: '日期选择'
          }
        ]
      },
      tableConfig: {
        data: [],
        config: [
          {
            prop: 'method',
            label: '操作的接口的方法',
            sortable: false
          },
          {
            prop: 'module',
            label: '操作模块',
            sortable: false
          },
          {
            prop: 'params',
            label: '请求参数',
            sortable: false
          },
          {
            prop: 'operation',
            label: '操作内容',
            sortable: false
          },
          {
            prop: 'createTime',
            label: '操作时间',
            sortable: true
          },
          {
            prop: 'operator',
            label: '操作人',
            sortable: false
          }
        ],
        tableHeight: 0,
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      dialogVisible: false,
      dialogTitle: '',
      logDetail: [
        {
          name: '操作的接口的方法',
          value: '',
          tool: 'method'
        },
        {
          name: '操作模块',
          value: '',
          tool: 'module'
        },
        {
          name: '请求参数',
          value: '',
          tool: 'params'
        },
        {
          name: '操作内容',
          value: '',
          tool: 'operation'
        },
        {
          name: '操作时间',
          value: '',
          tool: 'createTime'
        },
        {
          name: '操作人',
          value: '',
          tool: 'operator'
        }
      ]
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
      this.getList()
    }, 1)
    window.onresize = () => {
      this.getTableHeight()
    }
  },
  methods: {
    getTableHeight() {
      const logManage = document.getElementById('logManage').clientHeight
      let searchBox = document
        .getElementById('logManage')
        .getElementsByClassName('search-box')[0].clientHeight
      let pagination = document
        .getElementById('logManage')
        .getElementsByClassName('pagination')[0].clientHeight
      this.tableConfig.tableHeight =
        logManage - searchBox - pagination - 40 - 10 // 40为table-box的内边距，两个20位margin-bottom
    },
    getList() {
      let params = {
        endTime: this.searchConfig.data.time.length > 0 ? this.searchConfig.data.time[1] : '',
        staterTime: this.searchConfig.data.time.length > 0 ? this.searchConfig.data.time[0] : '',
        username: this.searchConfig.data.operateName,
        pageNum: this.tableConfig.currentPage,
        pageSize: this.tableConfig.pageSize,
        operateName: ''
      }
      getLogList(params).then(res => {
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
    handleReset() {
      this.searchConfig.data.time = []
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
    detail(row) {
      this.dialogVisible = true
      this.dialogTitle = '日志详情'
      this.logDetail.forEach(e => {
        for(let k in row) {
          if(k === e.tool) {
            e.value = row[k]
          }
        }
      })
    },
    dialogClosed() {
      //   this.logDetail = []
    }
  }
}
</script>

<style>
#logManage {
  flex: 1;
}
</style>
