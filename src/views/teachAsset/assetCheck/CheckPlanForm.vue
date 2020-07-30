<template>
  <div id="CheckPlanForm" ref="CheckPlanForm">
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
            <div v-if="item.prop === 'state'">
              <div v-if="scope.row[item.prop] === 1" class="com-status-normal">
                未盘点
              </div>
              <div v-if="scope.row[item.prop] === 2" class="com-status-success">
                已盘点
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
  import { getCheckPlanList } from './api';
  import { dictMixin } from '@/mixins/dictMixin'

  export default {
    components: { searchBar, tableList },
    mixins: [dictMixin],
    data() {
      return {
        detailPath: '/teachasset/asset-check/check-plan-form-detail',
        // 搜索按钮加载
        isLoading: false,
        // 搜索栏配置
        searchConfig: {
          data: {
            check_code: '',
            time: [],
            useDepartmentId: '',
            state: ''
          },
          config: [
            {
              label: '单据编码',
              labelWidth: '80px',
              prop: 'check_code',
              type: 'text',
              placeholder: '请输入查询的单据编码'
            },
            {
              label: '盘点日期',
              prop: 'time',
              labelWidth: '80px',
              type: 'daterange'
            },
            {
              label: '使用部门',
              prop: 'useDepartmentId',
              labelWidth: '80px',
              type: 'select',
              options: []
            },
            {
              label: '盘点状态',
              prop: 'state',
              labelWidth: '80px',
              type: 'select',
              options: [
                {
                  label: '所有',
                  value: ''
                },
                {
                  label: '待盘点',
                  value: 1
                },
                {
                  label: '已盘点',
                  value: 2
                }
              ]
            }
          ]
        },
        // 按钮组配置
        btnConfig: [
          // {
          //   label: '新增',
          //   type: 'primary',
          //   plain: true,
          //   customClass: '',
          //   callback: 'addData'
          // }
        ],
        // 表格配置
        tableConfig: {
          data: [],
          config: [
            {
              prop: 'checkCode',
              label: '单据编码',
              placeholder: '请输入单据编码',
              sortable: false
            },
            {
              prop: 'checkDate',
              label: '盘点日期',
              sortable: false
            },
            {
              prop: 'useDepartmentName',
              label: '使用部门',
              sortable: false
            },
            {
              prop: 'state',
              label: '盘点状态',
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
          total: 0,
          selectData: []
        }
      }
    },
    async created() {
      this.getList()
      await this.getDepartList({})
      // console.log(this.mxDepartlist);
      this.searchConfig.config.forEach(item=>{
        if (item.prop === 'useDepartmentId') {
          item.options = this.mxDepartlist
        }
      })
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
        const assetAccept = document.getElementById('CheckPlanForm').clientHeight
        let searchBox = document
          .getElementById('CheckPlanForm')
          .getElementsByClassName('search-box')[0].clientHeight
        let pagination = document
          .getElementById('CheckPlanForm')
          .getElementsByClassName('pagination')[0].clientHeight
        this.tableConfig.tableHeight =
          assetAccept - searchBox - pagination - 40 - 10 // 40为table-box的内边距，两个20位margin-bottom
      },
      // 获取表格数据
      getList() {
        let params = {
          checkCode: this.searchConfig.data.check_code,
          checkDateStart: '',
          checkDateEnd: '',
          useDepartmentId: this.searchConfig.data.useDepartmentId,
          state: this.searchConfig.data.state,
          pageNum: this.tableConfig.currentPage,
          pageSize: this.tableConfig.pageSize
        }
        if(this.searchConfig.data.time) {
          params.checkDateStart = this.searchConfig.data.time[0] || ''
          params.checkDateEnd = this.searchConfig.data.time[1] || ''
        }
        getCheckPlanList(params).then(res => {
          this.tableConfig.data = res.data.list
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
      // 新增
      addData() {
        this.$router.push({
          path: this.$route.path + '-detail',
          query: {
            type: 'add'
          }
        })
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
      dblclick(row) {
        // localStorage.setItem('CheckPlanForm', JSON.stringify(row))
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

<style lang='less'>
  @import '../../../assets/css/variable.less';
  #CheckPlanForm {
    flex: 1;
  }
</style>
