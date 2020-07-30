<template>
  <div id="teachAudit" ref="teachAudit">
    <search-bar
      :datas="searchConfig"
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
        @dblclick="dblclick"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
        <el-table-column
          v-for="(item,index) in tableConfig.config"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          align="center"
          :width='item.width'
          :sortable="item.sortable"
          :show-overflow-tooltip="true"
        >
        <template slot-scope="scope">
            <div v-if="item.prop === 'state'">
              <div class="com-status-usual">{{scope.row[item.prop]&&mxAuditStatue.filter(e=> e.value ===scope.row[item.prop])[0].label}}</div>
            </div>
            <div v-else>{{scope.row[item.prop]}}</div>
          </template></el-table-column>
      </table-list>
    </div>
  </div>
</template>

<script>
import searchBar from '@/components/searchBar/searchBar'
import tableList from '@/components/table'
import { dictMixin } from '../../../mixins/dictMixin'
import { bookGrantDeclareList } from './api'
export default {
  components: { searchBar, tableList },
  mixins: [dictMixin],
  data() {
    return {
      searchConfig: {
        // 搜索栏配置
        data: {
          grantDeclareCode: '',
          declareUser: '',
          state: 1,
          date: []
        },
        config: [
          {
            label: '单据编码',
            labelWidth: '80px',
            prop: 'grantDeclareCode',
            type: 'text',
            placeholder: '请输入单据编码'
          },
          {
            label: '申报日期',
            prop: 'date',
            labelWidth: '80px',
            type: 'date'
          },
           {
            label: '计划状态',
            labelWidth: '80px',
            prop: 'state',
            type: 'select',
            options: []
          },
          {
            label: '申报人',
            prop: 'declareUser',
            labelWidth: '80px',
            type: 'text',
            placeholder: '请输入申报人'
          }
        ]
      },
      tableConfig: {
        data: [],
        config: [
          {
            prop: 'grantDeclareCode',
            label: '单独申报单据编码',
            sortable: false
          },
          {
            prop: 'declareUser',
            label: '申报人',
            sortable: true
          },
          {
            prop: 'categoryName',
            label: '教材名称',
            sortable: false
          },
          {
            prop: 'declareDate',
            label: '申报日期',
            sortable: false
          },
          {
            prop: 'declareDepartmentName',
            label: '申报人部门',
            sortable: false
          },
          {
            prop: 'phone',
            label: '联系方式',
            sortable: false
          },
          {
            prop: 'state',
            label: '计划状态',
            width: 130,
            sortable: false
          },
          {
            prop: 'purpose',
            label: '用途',
            sortable: false
          }
        ],
        tableHeight: 0,
        currentPage: 1,
        pageSize: 10,
        total: 1,
        selectData: []
      }
    }
  },
  created() {
    this.searchConfig.config.forEach(item => {
      if (item.type === 'select') {
        if (item.prop === 'state') {
          item.options = this.mxAuditStatue
          item.options.unshift({ label: '所有', value: '' })
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
      const teachAudit = document.getElementById('teachAudit').clientHeight
      let searchBox = document
        .getElementById('teachAudit')
        .getElementsByClassName('search-box')[0].clientHeight
      let pagination = document
        .getElementById('teachAudit')
        .getElementsByClassName('pagination')[0].clientHeight
      this.tableConfig.tableHeight =
        teachAudit - searchBox - pagination - 40 - 10 // 40为table-box的内边距，两个20位margin-bottom
    },
    handleSearch() {
      this.tableConfig.currentPage = 1
      this.getList()
    },
    handleReset() {
      this.getList()
    },
    getList() {
      let params = {
        declareDateEnd: this.searchConfig.data.date.length > 0 ? this.searchConfig.data.date[1] : '',
        declareDateStart: this.searchConfig.data.date.length > 0 ? this.searchConfig.data.date[0] : '',
        declareUser: this.searchConfig.data.declareUser,
        grantDeclareCode: this.searchConfig.data.grantDeclareCode,
        state: this.searchConfig.data.state,
        pageNum: this.tableConfig.currentPage,
        pageSize: this.tableConfig.pageSize
      }
      bookGrantDeclareList(params).then(res => {
        if(res.status) {
          this.tableConfig.data = res.data.records
          this.tableConfig.total = res.data.total
        }
      })
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
    handleSelection(data) {
      this.tableConfig.selectData = data
    },
    dblclick(row) {
      this.$router.push({
        path: `${this.$route.path}-detail`,
        query: {
          id: row.id,
          status: row.state
        }
      })
    }
  }
}
</script>

<style>
#teachAudit {
  flex: 1;
}
</style>
