<template>
  <div id="assetCollectAudit" ref="assetCollectAudit">
    <search-bar
      :datas="searchConfig"
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
        @dblclick="dblclick"
      >
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
            <div v-if="item.prop === 'typeName'">
              <div v-if="scope.row[item.prop] === '待申报'" class="com-status-info">
                <span class="iconfont">&#xe626;</span> {{scope.row[item.prop]}}
              </div>
              <div v-if="scope.row[item.prop] === '待审核'" class="com-status-info">
                <span class="iconfont">&#xe626;</span> {{scope.row[item.prop]}}
              </div>
              <div v-if="scope.row[item.prop] === '已驳回'" class="com-status-danger">
                <span class="iconfont">&#xe628;</span> {{scope.row[item.prop]}}
              </div>
              <div v-if="scope.row[item.prop] === '已审核'" class="com-status-success">
                <span class="iconfont">&#xe627;</span> {{scope.row[item.prop]}}
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
import searchBar from '@/components/searchBar/searchBar'
import tableList from '@/components/table'
import { getReceiptApply } from './api'
import { dictMixin } from '@/mixins/dictMixin'
export default {
  components: { searchBar, tableList },
  mixins: [dictMixin],
  data() {
    return {
      searchConfig: {
        // 搜索栏配置
        data: {
          reqCode: '',
          reqDep: '',
          assetName: '',
          reqStatus: 2,
          date: []
        },
        config: [
          {
            label: '单据编码',
            labelWidth: '80px',
            prop: 'reqCode',
            type: 'text',
            placeholder: '请输入单据编码'
          },
          {
            label: '申报日期',
            labelWidth: '80px',
            prop: 'date',
            type: 'dateRange'
          },
          {
            label: '资产名称',
            prop: 'assetName',
            labelWidth: '80px',
            type: 'text',
            placeholder: '请输入资产名称'
          },
          {
            label: '使用部门',
            prop: 'reqDep',
            labelWidth: '80px',
            type: 'select',
            placeholder: '请选择使用部门',
            options: []
          },
          {
            label: '计划状态',
            prop: 'reqStatus',
            type: 'select',
            labelWidth: '80px',
            options: []
          }
        ]
      },
      tableConfig: {
        data: [],
        config: [
          {
            prop: 'reqCode',
            label: '单据编码',
            sortable: false
          },
          {
            prop: 'reqDate',
            label: '申报日期',
            sortable: true
          },
          {
            prop: 'assetName',
            label: '资产名称',
            sortable: true
          },
          {
            prop: 'reqDep',
            label: '使用部门',
            sortable: false
          },
          {
            prop: 'reqMan',
            label: '领用人',
            sortable: false
          },
          {
            prop: 'typeName',
            label: '计划状态',
            sortable: false
          },
          {
            prop: 'note',
            label: '备注',
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
    this.mxApplyStatus.shift()
    this.searchConfig.config.forEach(item => {
      if (item.type === 'select') {
        if (item.prop === 'reqStatus') {
          item.options = this.mxApplyStatus
          item.options.unshift({ label: '所有', value: '' })
        }
        if (item.prop === 'reqDep') {
          this.getDepartList().then(res => {
            item.options = res
            item.options.unshift({ label: '所有', value: '' })
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
    getTableHeight() {
      const assetCollectAudit = document.getElementById('assetCollectAudit')
        .clientHeight
      let searchBox = document
        .getElementById('assetCollectAudit')
        .getElementsByClassName('search-box')[0].clientHeight
      let pagination = document
        .getElementById('assetCollectAudit')
        .getElementsByClassName('pagination')[0].clientHeight
      this.tableConfig.tableHeight =
        assetCollectAudit - searchBox - pagination - 40 - 10 // 40为table-box的内边距，两个20位margin-bottom
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
        assetName: this.searchConfig.data.assetName, // 资产名称
        reqStatus: this.searchConfig.data.reqStatus, // 申领状态 1.待申报 2.待审核 3.已驳回 4.已审核
        reqCode: this.searchConfig.data.reqCode, // 申请编码
        reqDep: this.searchConfig.data.reqDep, // 使用单位，取申报人权限
        reqDateFrom:
          this.searchConfig.data.date.length > 0
            ? this.searchConfig.data.date[0] // 申请日期查询开始时间
            : '',
        reqDateTo:
          this.searchConfig.data.date.length > 0
            ? this.searchConfig.data.date[1] // 申请日期查询截止时间
            : '',
        pageIndex: this.tableConfig.currentPage, // 第几页
        pageSize: this.tableConfig.pageSize, // 每页大小
        type: 2 // 列表类型,1申请列表 2审核列表
      }
      getReceiptApply(params).then(res => {
        if (res.status) {
          this.tableConfig.data = res.data.records
          if (res.data.records.length > 0) {
            res.data.records.forEach(e => {
              e.typeName = this.mxApplyStatus.filter(
                es => es.value === e.reqStatus
              )[0].label
              if (e.reqDate && e.reqDate.indexOf(' ') !== -1) {
                e.reqDate = e.reqDate.split(' ')[0]
              }
            })
          }
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
    dblclick(row, column, event) {
      this.$router.push({
        path: `${this.$route.path}-detail`,
        query: {
          type: 'edit',
          id: row.id,
          status: row.reqStatus
        }
      })
    }
  }
}
</script>

<style lang='less'>
@import '../../../assets/css/variable.less';
#assetCollectAudit {
  flex: 1;
}
</style>
