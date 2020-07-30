<template>
  <div id="PurchasePlan" ref="PurchasePlan">
    <search-bar
      :datas="searchConfig"
      :config="btnConfig"
      :is-loading="isLoading"
      @handle-search="handleSearch"
      @handle-click="handleBtnClick"
      @handle-reset="handleReset"
    ></search-bar>
    <div class="table-box">
      <table-list
        :loading="tableConfig.loading"
        :tableHeight="tableConfig.tableHeight"
        :tableData="tableConfig.data"
        :currentPage="tableConfig.pageNum"
        :pageSize="tableConfig.pageSize"
        :total="tableConfig.total"
        @dblclick="dblclick"
        @size-change="changeSize"
        @page-change="changePage"
        @select="handleSelection"
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
            <div v-if="item.prop === 'checkState'">
              <div>
                <div :class="`${getIconName(scope.row.checkState)}`">{{mxPurchasePlanStatus.filter((a) => a.value === scope.row.checkState).length && mxPurchasePlanStatus.filter((a) => a.value === scope.row.checkState)[0].label}}</div>
              </div>
            </div>
            <div  v-else-if="item.prop === 'purchaseState'">
              <div>
                <div>{{scope.row.purchaseState?'已采购':'未采购'}}</div>
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
  import { dictMixin } from '@/mixins/dictMixin'
  import {
    getCentralizedProcessingList
  } from './api';

  export default {
    components: { searchBar, tableList },
    mixins: [dictMixin],
    data: function () {
      return {
        TypeCode: 'JB01ZCLX',
        isLoading: false,
        searchConfig: {
          // 搜索栏配置
          data: {
            purchaseCode: '',
            assetsName: '',
            startEnd: ['', ''],
            checkState: '[0, 1, 8, 9]',
            cgState: 0
          },
          config: [
            {
              label: '采购计划单据编码',
              labelWidth: '130px',
              prop: 'purchaseCode',
              placeholder: '请选择',
              type: 'text'
            },
            {
              label: '计划日期',
              labelWidth: '80px',
              prop: 'startEnd',
              placeholder: '请选择',
              type: 'daterange'
            },
            {
              label: '资产名称',
              labelWidth: '80px',
              prop: 'assetsName',
              placeholder: '请选择',
              type: 'text'
            },
            {
              label: '计划状态',
              labelWidth: '80px',
              prop: 'checkState',
              placeholder: '请选择',
              type: 'select',
              options: [
                {
                  label: '所有',
                  value: '[0, 1, 8, 9]'
                },
                {
                  label: '待申报',
                  value: '[0]'
                },
                {
                  label: '待审核',
                  value: '[1]'
                },
                {
                  label: '已审核',
                  value: '[8]'
                },
                {
                  label: '已驳回',
                  value: '[9]'
                }
              ]
            },
            {
              label: '采购状态',
              labelWidth: '80px',
              prop: 'cgState',
              placeholder: '请选择',
              type: 'select',
              options: [
                {
                  label: '全部',
                  value: 0
                },
                {
                  label: '已采购',
                  value: true
                },
                {
                  label: '未采购',
                  value: false
                }
              ]
            }
          ]
        },
        btnConfig: [],
        tableConfig: {
          data: [],
          loading: false,
          config: [
            {
              prop: 'purchaseCode',
              label: '采购计划单据编码',
              sortable: false
            },
            {
              label: '计划日期',
              prop: 'declareDate',
              placeholder: '请选择',
            },
            {
              prop: 'assetsName',
              label: '资产名称',
              sortable: false
            },
            {
              prop: 'applicant',
              label: '申请人',
              sortable: false
            },
            {
              prop: 'checkState',
              label: '计划状态',
              sortable: false,
            },
            {
              prop: 'remarks',
              label: '备注',
              sortable: false
            },
            {
              prop: 'purchaseState',
              label: '采购状态',
              sortable: false
            }
          ],
          tableHeight: 0,
          pageNum: 1,
          pageSize: 10,
          total: 1,
          selectData: []
        }
      }
    },
    created() {
    },
    mounted() {
      setTimeout(() => {
        this.getTableHeight()
      }, 1)
      this.getList();
    },
    methods: {
      // 双击表格某列
      dblclick(row, column, cell, event) {
        console.log(row.checkState);
        if(row.checkState === 0 || row.checkState === 9) {
          this.$router.push({ path: '/teachasset/purchase-plan/purchase-plan-detail', query: { type: 'edit', id: row.id } })
        }else {
          this.$router.push({ path: '/teachasset/purchase-plan/purchase-plan-detail', query: { type: 'detail', id: row.id } })
        }
      },
      // 计算表格高度
      getTableHeight() {
        const assetAccept = document.getElementById('PurchasePlan').clientHeight
        let searchBox = document
          .getElementById('PurchasePlan')
          .getElementsByClassName('search-box')[0].clientHeight
        let pagination = document
          .getElementById('PurchasePlan')
          .getElementsByClassName('pagination')[0].clientHeight
        this.tableConfig.tableHeight =
          assetAccept - searchBox  - pagination - 40  - 10
      },
      // 点击查询
      handleSearch() {
        this.tableConfig.pageNum = 1;
        this.isLoading = true;
        this.getList();
      },
      // 点击重置
      handleReset() {
        this.tableConfig.pageNum = 1;
        this.getList();
      },
      // 重置逻辑
      handleBtnClick(res) {
        this[res] && this[res]()
      },
      // 点击新增
      addData() {
        this.$router.push({ path: '/teachasset/purchase-plan/purchase-plan-detail', query: { type: 'add' } })
      },
      // 查询数据列表
      getList() {

        if(this.searchConfig.data.startEnd === null){
          this.searchConfig.data.startEnd = ['', '']
        }
        let param = {
          assetsName: this.searchConfig.data.assetsName,
          checkState: JSON.parse(this.searchConfig.data.checkState),
          pageNum: this.tableConfig.pageNum,
          pageSize: this.tableConfig.pageSize,
          planDateEnd: this.searchConfig.data.startEnd[1],
          planDateStart: this.searchConfig.data.startEnd[0],
          purchaseCode: this.searchConfig.data.purchaseCode,
          purchaseState: this.searchConfig.data.cgState
        };
        console.log(param);
        this.tableConfig.loading = true;
        getCentralizedProcessingList(param).then((Result) => {
          this.tableConfig.total = Result.data.total;

          this.tableConfig.data = Result.data.records;

          this.tableConfig.data.forEach((res, i) => {
            var nameList = [];
            this.tableConfig.data[i].lines.forEach((res2, y) => {
              nameList.push(res2.assetsName)
            })
            this.tableConfig.data[i].assetsName = nameList.join(',')
          })

          this.isLoading = false;
          this.tableConfig.loading = false;
        });
      },
      // 切换分页每页显示数量
      changeSize(size) {
        this.tableConfig.pageSize = size
        this.tableConfig.currentPage = 1
        this.getList()
      },
      // 切换分页页码
      changePage(page) {
        this.tableConfig.pageNum = page;
        this.getList()
      },
      // 勾选表格选中框事件
      handleSelection(data) {
        this.tableConfig.selectData = data
      },
      getIconName(val) {
        let res = '';
        switch(val) {
          case 0:
            res = 'font-color-blue'
            break;
          case 1:
            res = 'font-color-blue'
            break;
          case 2:
            res = 'font-color-blue'
            break;
          case 3:
            res = 'font-color-blue'
            break;
          case 9:
            res = 'font-color-red'
            break;
        }
        return res
      }
    }
  }
</script>

<style lang='less'>
  @import '../../../assets/css/variable.less';
  @import '../../../assets/css/style.less';
  #PurchasePlan {
    flex: 1;
  }
</style>
