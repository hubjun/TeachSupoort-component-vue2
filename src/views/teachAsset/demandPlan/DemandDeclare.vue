<template>
  <div id="DemandDeclare" ref="DemandDeclare">
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
                <div :class="`${getIconName(scope.row.checkState)}`">{{mxDemandPlanStatus.filter((a) => a.value === scope.row.checkState).length && mxDemandPlanStatus.filter((a) => a.value === scope.row.checkState)[0].label}}</div>
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
    getDemandPlan
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
            planningCode: '',
            assetsName: '',
            startEnd: ['', ''],
            useDept: '',
            checkState: '[2]'
          },
          config: [
            {
              label: '单据编码',
              labelWidth: '80px',
              prop: 'planningCode',
              placeholder: '请选择',
              type: 'text'
            },
            {
              label: '资产名称',
              labelWidth: '80px',
              prop: 'assetsName',
              placeholder: '请选择',
              type: 'text'
            },
            {
              label: '申报日期',
              labelWidth: '80px',
              prop: 'startEnd',
              placeholder: '请选择',
              type: 'daterange'
            },
            {
              label: '使用部门',
              labelWidth: '80px',
              prop: 'useDept',
              placeholder: '请选择',
              type: 'select',
              options: []
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
                  value: '[2, 8, 9]'
                },
                {
                  label: '待教保处审批',
                  value: '[2]'
                },
                {
                  label: '教保处驳回',
                  value: '[9]'
                },
                {
                  label: '已审核',
                  value: '[8]'
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
              prop: 'planningCode',
              label: '单据编码',
              sortable: false
            },
            {
              prop: 'assetsName',
              label: '资产名称',
              sortable: true
            },
            {
              prop: 'declareDate',
              label: '申报日期',
              sortable: false
            },
            {
              prop: 'useDept',
              label: '使用部门',
              sortable: false
            },
            {
              prop: 'checkState',
              label: '计划状态',
              sortable: false
            },
            {
              prop: 'remarks',
              label: '备注',
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
      this.searchConfig.config.forEach(item => {
        if (item.type === 'select') {
          if (item.prop === 'useDept') {
            this.getDepartDictList().then(res => {
              item.options = res
              item.options.unshift({ label: '所有', value: '' });
            });
          }
        }
      });
      setTimeout(() => {
        this.getTableHeight()
      }, 1)
      this.getList();
    },
    methods: {
      // 双击表格某列
      dblclick(row, column, cell, event) {
        if(row.checkState === 2) {
          this.$router.push({ path: '/teachasset/demand-plan/demand-declare-detail', query: { type: 'edit', id: row.id } })
        }else {
          this.$router.push({ path: '/teachasset/demand-plan/demand-declare-detail', query: { id: row.id } })
        }
      },
      // 计算表格高度
      getTableHeight() {
        const assetAccept = document.getElementById('DemandDeclare').clientHeight
        let searchBox = document
          .getElementById('DemandDeclare')
          .getElementsByClassName('search-box')[0].clientHeight
        let pagination = document
          .getElementById('DemandDeclare')
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
        this.$router.push({ path: '/teachasset/demand-plan/demand-declare-detail', query: { type: 'add' } })
      },
      // 查询数据列表
      getList() {
        let param = {
          assetsName: this.searchConfig.data.assetsName,
          checkState: JSON.parse(this.searchConfig.data.checkState),
          end: this.searchConfig.data.startEnd[1],
          pageNum: this.tableConfig.pageNum,
          pageSize: this.tableConfig.pageSize,
          planningCode: this.searchConfig.data.planningCode,
          start: this.searchConfig.data.startEnd[0],
          useDeptId: this.searchConfig.data.useDept
        };
        this.tableConfig.loading = true;
        getDemandPlan(param).then((Result) => {
          this.tableConfig.total = Result.data.total;

          if(Result.data.records[0] != null) {
            for(let i = 0; i < Result.data.records.length; i++) {
              Result.data.records[i].assetsName = [];
              for(let y = 0; y < Result.data.records[i].planningLines.length; y++) {
                Result.data.records[i].assetsName.push(Result.data.records[i].planningLines[y].assetsName);
              }
              Result.data.records[i].assetsName = Result.data.records[i].assetsName.join(' , ');
            }
            this.tableConfig.data = Result.data.records;
          }else{
            this.tableConfig.data = [];
          }

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
  #DemandDeclare {
    flex: 1;
  }
</style>
