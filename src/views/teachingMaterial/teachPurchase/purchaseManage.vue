<template>
  <div id="purchaseManage" ref="purchaseManage">
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
        @select="handleSelection"
        @dblclick="dblclick"
      >
        <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
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
            <div v-if="item.prop === 'purchaseStatus'">
              <div v-if="scope.row[item.prop] === 1" class="com-status-usual">正常采购</div>
              <div v-else-if="scope.row[item.prop] === 2" class="com-status-unusual">异常采购</div>
            </div>
            <div v-else-if="item.prop === 'planStatus'">
              <div v-if="scope.row[item.prop] === 2" class="com-status-usual">已确认</div>
              <div v-else-if="scope.row[item.prop] === 1" class="com-status-unusual">未确认</div>
            </div>
            <div v-else-if="item.prop === 'chooseWay'">
              <div class="com-status-usual">
                {{
                scope.row[item.prop]?mxSelectWay.filter(e=>e.value === scope.row[item.prop])[0].label:''
                }}</div>
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
import { dictMixin } from '../../../mixins/dictMixin'
import { purchasePlanList } from './api'
export default {
  components: { searchBar, tableList },
  mixins: [dictMixin],
  data() {
    return {
      searchConfig: {
        // 搜索栏配置
        data: {
          schoolYearId: '',
          bookCategoryName: '',
          chooseWay: '',
          planStatus: '',
          date: [],
          purchaseStatus: ''
        },
        config: [
          {
            label: '学年',
            labelWidth: '80px',
            prop: 'schoolYearId',
            type: 'select',
            options: []
          },
          {
            label: '教材名称',
            prop: 'bookCategoryName',
            labelWidth: '80px',
            type: 'text',
            placeholder: '请输入教材名称'
          },
          {
            label: '采购状态',
            prop: 'purchaseStatus',
            labelWidth: '80px',
            type: 'select',
            options: []
          },
          {
            label: '计划状态',
            labelWidth: '80px',
            prop: 'planStatus',
            type: 'select',
            options: []
          },
          {
            label: '采购日期',
            labelWidth: '80px',
            prop: 'date',
            type: 'date'
          },
          {
            label: '选用方式',
            prop: 'chooseWay',
            labelWidth: '80px',
            type: 'select',
            options: []
          }
        ]
      },
      tableConfig: {
        data: [],
        config: [
          {
            prop: 'purchasePlanCode',
            label: '采购单据编码',
            sortable: false
          },
          {
            prop: 'categoryName',
            label: '教材名称',
            sortable: true
          },
          {
            prop: 'purchaseDate',
            label: '采购日期',
            sortable: false
          },
          {
            prop: 'courseName',
            label: '课程',
            sortable: false
          },
          {
            prop: 'schoolYear',
            label: '学年',
            sortable: false
          },
          {
            prop: 'chooseWay',
            label: '选用方式',
            sortable: false
          },
          {
            prop: 'requireNum',
            label: '采购需求',
            sortable: false
          },
          {
            prop: 'purchaseNum',
            label: '采购数量',
            sortable: false
          },
          {
            prop: 'purchaseStatus',
            label: '采购状态',
            sortable: false
          },
          {
            prop: 'planStatus',
            label: '计划状态',
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
       if (item.prop === 'schoolYearId') {
          this.baseList('JB02XNXN').then(res => {
            this.mxYearList = res
            this.mxYearList.unshift({ label: '所有', value: '' })
            item.options = this.mxYearList
          })
        }
        if (item.prop === 'chooseWay') {
          this.baseList('JB02XYFS').then(res => {
            this.mxSelectWay = res
            this.mxSelectWay.unshift({ label: '所有', value: '' })
            item.options = this.mxSelectWay
          })
        }
        if (item.prop === 'purchaseStatus') {
          item.options = this.mxPurchaseStatus
          item.options.unshift({ label: '所有', value: '' })
        }
        if (item.prop === 'planStatus') {
          item.options = this.mxConfirmStatus
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
      const purchaseManage = document.getElementById('purchaseManage')
        .clientHeight
      let searchBox = document
        .getElementById('purchaseManage')
        .getElementsByClassName('search-box')[0].clientHeight
      let pagination = document
        .getElementById('purchaseManage')
        .getElementsByClassName('pagination')[0].clientHeight
      this.tableConfig.tableHeight =
        purchaseManage - searchBox - pagination - 40 - 10 // 40为table-box的内边距，两个20位margin-bottom
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
        bookCategoryName: this.searchConfig.data.bookCategoryName,
        chooseWay: this.searchConfig.data.chooseWay,
        planStatus: this.searchConfig.data.planStatus,
        purchaseDateFrom: this.searchConfig.data.date.length > 0 ? this.searchConfig.data.date[0] : '',
        purchaseDateTo: this.searchConfig.data.date.length > 0 ? this.searchConfig.data.date[1] : '',
        purchaseStatus: this.searchConfig.data.purchaseStatus,
        schoolYearId: this.searchConfig.data.schoolYearId,
        pageNum: this.tableConfig.currentPage,
        pageSize: this.tableConfig.pageSize
      }
      purchasePlanList(params).then(res => {
        if(res.status) {
          this.tableConfig.data = res.data.records
          res.data.records.forEach(e => {
            // e.purchaseStatus = 1
            // e.planStatus = 1
            // e.chooseWay = 1
          })
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
          planStatus: row.planStatus,
          purchaseStatus: row.purchaseStatus
        }
      })
    }
  }
}
</script>

<style>
#purchaseManage {
  flex: 1;
}
</style>
