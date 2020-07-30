<template>
  <div id="assetHandOver" ref="assetHandOver">
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
        <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
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
            <div v-if="item.prop === 'handoverStatusName'">
              <div v-if="scope.row.handoverStatus === 1" class="com-status-info">
                <span class="iconfont">&#xe626;</span>
                {{scope.row[item.prop]}}
              </div>
              <div v-if="scope.row.handoverStatus === 2" class="com-status-success">
                <span class="iconfont">&#xe627;</span>
                {{scope.row[item.prop]}}
              </div>
            </div>
            <div v-else>{{scope.row[item.prop]}}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" width="150" align="center" fixed="right">
        >
          <template slot-scope="scope">
            <div v-if="item.prop === 'handoverStatusName'">
              <div v-if="scope.row.handoverStatus === 1" class="com-status-info">
                <span class="iconfont">&#xe626;</span> {{scope.row[item.prop]}}
              </div>
              <div v-if="scope.row.handoverStatus === 2" class="com-status-success">
                <span class="iconfont">&#xe627;</span> {{scope.row[item.prop]}}
              </div>
            </div>
            <div v-else>{{scope.row[item.prop]}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template slot-scope="scope">
            <div>
              <el-button
                class="edit"
                v-show="scope.row.handoverStatus === 1"
                type="text"
                @click="edit(scope.row)"
              >编辑</el-button>
            </div>
          </template>
        </el-table-column>-->
      </table-list>
    </div>
  </div>
</template>

<script>
import searchBar from '@/components/searchBar/searchBar'
import tableList from '@/components/table'
import { getHandoverList } from './api'
import { dictMixin } from '@/mixins/dictMixin'
export default {
  components: { searchBar, tableList },
  mixins: [dictMixin],
  data() {
    return {
      searchConfig: {
        // 搜索栏配置
        data: {
          handoverCode: '',
          handoverDep: '',
          assetName: '',
          date: [],
          code: '',
          handoverStatus: ''
        },
        config: [
          {
            label: '单据编码',
            labelWidth: '80px',
            prop: 'handoverCode',
            type: 'text',
            placeholder: '请输入单据编码'
          },
          {
            label: '移交日期',
            labelWidth: '80px',
            prop: 'date',
            type: 'datetime'
          },
          {
            label: '使用部门',
            prop: 'handoverDep',
            labelWidth: '80px',
            type: 'select',
            placeholder: '请选择使用部门',
            options: []
          },
          {
            label: '资产名称',
            prop: 'assetName',
            labelWidth: '80px',
            type: 'text',
            placeholder: '请输入资产名称'
          },
          {
            label: '计划状态',
            prop: 'handoverStatus',
            labelWidth: '80px',
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
            prop: 'handoverCode',
            label: '单据编码',
            sortable: false
          },
          {
            prop: 'handoverDate',
            label: '移交日期',
            sortable: true
          },
          {
            prop: 'handoverDep',
            label: '使用部门',
            sortable: false
          },
          {
            prop: 'assetName',
            label: '资产名称',
            sortable: false
          },
          {
            prop: 'handoverMan',
            label: '移交人',
            sortable: false
          },
          {
            prop: 'handoverStatusName',
            label: '计划状态',
            sortable: false,
            formatter: ''
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
        total: 1,
        selectData: []
      }
    }
  },
  created() {
    this.mxConfirmStatus.unshift({
      label: '所有',
      value: ''
    })
    this.searchConfig.config.forEach(item => {
      if (item.type === 'select') {
        if (item.prop === 'handoverStatus') {
          item.options = this.mxConfirmStatus
        }
      }
      if (item.prop === 'handoverDep') {
        this.getDepartList().then(res => {
          item.options = res
          item.options.unshift({ label: '所有', value: '' })
        })
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
      const assetHandOver = document.getElementById('assetHandOver')
        .clientHeight
      let searchBox = document
        .getElementById('assetHandOver')
        .getElementsByClassName('search-box')[0].clientHeight
      let pagination = document
        .getElementById('assetHandOver')
        .getElementsByClassName('pagination')[0].clientHeight
      this.tableConfig.tableHeight =
        assetHandOver - searchBox - pagination - 40 - 10 // 40为table-box的内边距，两个20位margin-bottom
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
    addData() {
      this.$router.push({
        path: `${this.$route.path}-detail`,
        query: {
          type: 'add'
        }
      })
    },
    getList() {
      const params = {
        assetName: this.searchConfig.data.assetName,
        handoverCode: this.searchConfig.data.handoverCode,
        handoverStatus: this.searchConfig.data.handoverStatus,
        handoverDateFrom:
          this.searchConfig.data.date.length > 0
            ? this.searchConfig.data.date[0]
            : '',
        handoverDateTo:
          this.searchConfig.data.date.length > 0
            ? this.searchConfig.data.date[1]
            : '',
        handoverDep: this.searchConfig.data.handoverDep,
        pageIndex: this.tableConfig.currentPage,
        pageSize: this.tableConfig.pageSize
      }
      getHandoverList(params).then(res => {
        if (res.status) {
          this.tableConfig.data = res.data.records
          if (res.data.records.length > 0) {
            res.data.records.map(e => {
              e.handoverStatusName = this.mxConfirmStatus.filter(
                es => es.value === e.handoverStatus
              )[0].label
              if (e.handoverDate && e.handoverDate.indexOf(' ') !== -1) {
                e.handoverDate = e.handoverDate.split(' ')[0]
              }
              return e
            })
          }
          this.tableConfig.total = res.data.total
        } else {
          this.$error(res.msg)
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
    handleGroupClick(type, row) {
      this[type] && this[type](row)
    },
    // edit(row) {
    //   this.$router.push({
    //     path: `${this.$route.path}-detail`,
    //     query: {
    //       type: 'edit',
    //       id: row.id
    //     }
    //   })
    // },
    dblclick(row, column, event) {
      this.$router.push({
        path: `${this.$route.path}-detail`,
        query: {
          type: 'edit',
          id: row.id
        }
      })
    }
  }
}
</script>

<style lang='less'>
@import '../../../assets/css/variable.less';
#assetHandOver {
  flex: 1;
}
</style>
