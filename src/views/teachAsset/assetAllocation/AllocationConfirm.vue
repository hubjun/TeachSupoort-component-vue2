<template>
  <div id="AllocationConfirm" ref="AllocationConfirm">
    <search-bar
        :is-loading="isLoading"
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
          @dblclick="dblclick"
      >
        <el-table-column label="序号" type="index" width="55" align="center"></el-table-column>
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
            <div v-if="item.prop === 'allocateStatus'">
              <div v-if="scope.row[item.prop] === 2" class="com-status-info">
                <span class="iconfont">&#xe626;</span>待审核
              </div>
              <div v-else-if="scope.row[item.prop] === 3" class="com-status-info">
                <span class="iconfont">&#xe626;</span>待审批
              </div>
              <div v-else-if="scope.row[item.prop] === 4" class="com-status-danger">
                <span class="iconfont">&#xe628;</span>审核驳回
              </div>
              <div v-else-if="scope.row[item.prop] === 5" class="com-status-danger">
                <span class="iconfont">&#xe627;</span>审批驳回
              </div>
              <div v-else-if="scope.row[item.prop] === 6" class="com-status-success">
                <span class="iconfont">&#xe627;</span>已审批
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
  import { getApplyList } from './api';
  export default {
    name: 'AllocationConfirm',
    components: { searchBar, tableList },
    data() {
      return {
        detailPath: '/teachasset/asset-allocation/allocation-confirm-detail',
        // 搜索按钮加载
        isLoading: false,
        // 搜索栏配置
        searchConfig: {
          data: {
            allocateCode: '',
            time: [],
            assetName: '',
            inDep: '',
            allocateStatus: 2
          },
          config: [
            {
              label: '单据编码',
              labelWidth: '80px',
              prop: 'allocateCode',
              type: 'text'
            },
            {
              label: '申请日期',
              prop: 'time',
              labelWidth: '80px',
              type: 'daterange'
            },
            {
              label: '资产名称',
              prop: 'assetName',
              labelWidth: '80px',
              type: 'text'
            },
            {
              label: '调入部门',
              labelWidth: '80px',
              prop: 'inDep',
              type: 'text'
            },
            {
              label: '计划状态',
              prop: 'allocateStatus',
              type: 'select',
              labelWidth: '80px',
              options: [
                {
                  label: '所有',
                  value: ''
                },
                {
                  label: '待审核',
                  value: 2
                },
                {
                  label: '待审批',
                  value: 3
                },
                {
                  label: '审核驳回',
                  value: 4
                },
                {
                  label: '审批驳回',
                  value: 5
                },
                {
                  label: '已审批',
                  value: 6
                }
              ]
            }
          ]
        },
        // 按钮组配置
        btnConfig: [],
        // 表格配置
        tableConfig: {
          data: [],
          config: [
            {
              prop: 'allocateCode',
              label: '单据编码',
              sortable: false
            },
            {
              prop: 'assetName',
              label: '资产名称'
            },
            {
              prop: 'applyDate',
              label: '申请日期',
              sortable: false
            },
            {
              prop: 'inDep',
              label: '调入部门',
              sortable: false
            },
            {
              prop: 'outDep',
              label: '调出部门',
              sortable: false
            },
            {
              prop: 'applyMan',
              label: '申请人',
              sortable: false
            },
            {
              prop: 'allocateStatus',
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
          total: 1,
          selectData: []
        }
      }
    },
    created() {
      this.getList()
    },
    mounted() {
      // 动态设置高度
      setTimeout(() => {
        this.getTableHeight()
      }, 1)
      window.onresize = () => {
        this.getTableHeight()
      }
    },
    methods: {
      // 动态设置表格高度
      getTableHeight() {
        const assetAccept = document.getElementById('AllocationConfirm').clientHeight
        let searchBox = document
          .getElementById('AllocationConfirm')
          .getElementsByClassName('search-box')[0].clientHeight
        let pagination = document
          .getElementById('AllocationConfirm')
          .getElementsByClassName('pagination')[0].clientHeight
        this.tableConfig.tableHeight =
          assetAccept - searchBox - pagination - 40 - 10 // 40为table-box的内边距，两个20位margin-bottom
      },
      // 获取表格数据
      getList() {
        let params = {
          allocateCode: this.searchConfig.data.allocateCode,
          allocateStatus: this.searchConfig.data.allocateStatus,
          applyDateFrom: '',
          applyDateTo: '',
          assetName: this.searchConfig.data.assetName,
          inDep: this.searchConfig.data.inDep,
          type: 2,
          pageIndex: this.tableConfig.currentPage,
          pageSize: this.tableConfig.pageSize
        }
        if(this.searchConfig.data.time) {
          params.applyDateFrom = this.searchConfig.data.time[0]
          params.applyDateTo = this.searchConfig.data.time[1]
        }
        getApplyList(params).then(res => {
          this.tableConfig.data = res.data.records
          this.tableConfig.total = res.data.total
          this.isLoading = false
        }).catch(() => {
          this.isLoading = false
        })
      },
      // 搜索回调
      handleSearch() {
        this.isLoading = true
        this.tableConfig.currentPage = 1
        this.getList()
      },
      // 重置回调
      handleReset() {
        this.tableConfig.currentPage = 1
        this.getList()
      },
      // 按钮组回调
      handleBtnClick(res) {
        this[res] && this[res]()
      },
      // 修改每页数量
      changeSize(size) {
        this.tableConfig.pageSize = size
        this.tableConfig.currentPage = 1
        this.getList()
      },
      // 点击页码
      changePage(page) {
        this.tableConfig.currentPage = page
        this.getList()
      },
      // 双击事件
      dblclick(row) {
        this.$router.push({
          path: this.detailPath,
          query: {
            type: 'detail',
            id: row.id
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">
  @import '../../../assets/css/variable.less';
  #AllocationConfirm {
    flex: 1;
  }
</style>
