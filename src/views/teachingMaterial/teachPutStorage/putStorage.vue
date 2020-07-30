<template>
  <div id="putStorage" ref="putStorage">
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
          :width="item.width"
          :sortable="item.sortable"
          :show-overflow-tooltip="true"
        >
        <template slot-scope="scope">
            <div v-if="item.prop === 'state'">
              <div v-if="scope.row[item.prop] === 1" class="com-status-unusual">待确认</div>
              <div v-else-if="scope.row[item.prop] === 2" class="com-status-usual">已入库</div>
            </div>
            <div v-else>{{scope.row[item.prop]}}</div>
          </template>
        </el-table-column>
      </table-list>
    </div>
  </div>
</template>

<script>
import searchBar from '@/components/searchBar/searchBar'
import tableList from '@/components/table'
import { bookStorageList } from './api'
import { dictMixin } from '../../../mixins/dictMixin'
export default {
  components: { searchBar, tableList },
  mixins: [dictMixin],
  data() {
    return {
      searchConfig: {
        // 搜索栏配置
        data: {
          bookStorageCode: '',
          preparedBy: '',
          state: '',
          date: []
        },
        config: [
          {
            label: '单据编码',
            labelWidth: '80px',
            prop: 'bookStorageCode',
            type: 'text',
            placeholder: '请输入单据编码'
          },
          {
            label: '入库日期',
            prop: 'date',
            labelWidth: '80px',
            type: 'date'
          },
          {
            label: '制单人',
            prop: 'preparedBy',
            labelWidth: '80px',
            type: 'text',
            placeholder: '请输入制单人'
          },
          {
            label: '计划状态',
            labelWidth: '80px',
            prop: 'state',
            type: 'select',
            options: []
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
        data: [],
        config: [
          {
            prop: 'bookStorageCode',
            label: '入库单单据编码',
            sortable: false
          },
          {
            prop: 'preparedBy',
            label: '制单人',
            sortable: true
          },
          {
            prop: 'categoryName',
            label: '教材名称',
            sortable: false
          },
          {
            prop: 'storageDate',
            label: '入库日期',
            sortable: false
          },
          {
            prop: 'state',
            label: '计划状态',
            width: '150',
            sortable: false
          },
          {
            prop: 'remark',
            label: '备注',
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
          item.options = this.mxStorangeStatus
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
      const putStorage = document.getElementById('putStorage').clientHeight
      let searchBox = document
        .getElementById('putStorage')
        .getElementsByClassName('search-box')[0].clientHeight
      let pagination = document
        .getElementById('putStorage')
        .getElementsByClassName('pagination')[0].clientHeight
      this.tableConfig.tableHeight =
        putStorage - searchBox - pagination - 40 - 10 // 40为table-box的内边距，两个20位margin-bottom
    },
    handleSearch() {
      console.log(this.searchConfig.data)
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
        bookStorageCode: this.searchConfig.data.bookStorageCode,
        preparedBy: this.searchConfig.data.preparedBy,
        state: this.searchConfig.data.state,
        storageDateEnd: this.searchConfig.data.date.length > 0 ? this.searchConfig.data.date[1] : '',
        storageDateStart: this.searchConfig.data.date.length > 0 ? this.searchConfig.data.date[0] : '',
        pageNum: this.tableConfig.currentPage,
        pageSize: this.tableConfig.pageSize
      }
      bookStorageList(params).then(res => {
        if(res.status) {
          this.tableConfig.data = res.data.records
          this.tableConfig.total = res.data.total
        }
      })
    },
    addData() {
      this.$router.push({
        path: `${this.$route.path}-detail`,
        query: {
          type: 'add'
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
          type: 'edit',
          id: row.id,
          status: parseFloat(row.state)
        }
      })
    }
  }
}
</script>

<style>
#putStorage {
  flex: 1;
}
</style>
