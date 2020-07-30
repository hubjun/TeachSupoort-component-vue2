<template>
  <div id="PurchaseContract" ref="PurchaseContract">
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
            <div v-if="item.prop === 'supplierName'">
              <div>
                <div :class="`${getIconName(scope.row.supplierName)}`">{{mxSupplier.filter((a) => a.value === scope.row.supplierId).length && mxSupplier.filter((a) => a.value === scope.row.supplierId)[0].label}}</div>
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
    getContract
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
            contractBillCode: '',
            contractDate: ['', ''],
            contract_name: '',
            contractPrice: ['', ''],
            supplierName: ''
          },
          config: [
            {
              label: '采购合同单据编码',
              labelWidth: '130px',
              prop: 'contractBillCode',
              placeholder: '请选择',
              type: 'text'
            },
            {
              label: '合同签订日期',
              labelWidth: '100px',
              prop: 'contractDate',
              placeholder: '请选择',
              type: 'daterange'
            },
            {
              label: '合同名称',
              labelWidth: '80px',
              prop: 'contract_name',
              placeholder: '请选择',
              type: 'text'
            },
            {
              label: '合同金额',
              labelWidth: '80px',
              prop: 'contractPrice',
              placeholder: '请选择',
              type: 'range'
            },
            {
              label: '供应商名称',
              labelWidth: '100px',
              prop: 'supplierName',
              placeholder: '请选择',
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
          loading: false,
          config: [
            {
              prop: 'contractBillCode',
              label: '采购合同单据编码',
              sortable: false
            },
            {
              prop: 'purchasePlayCode',
              label: '采购计划单据编码',
              sortable: true
            },
            {
              prop: 'contractDate',
              label: '合同签订日期',
              sortable: false
            },
            {
              prop: 'contractName',
              label: '合同名称',
              sortable: false
            },
            {
              prop: 'supplierName',
              label: '供应商名称',
              sortable: false
            },
            {
              prop: 'contractPrice',
              label: '合同金额（元）',
              sortable: false
            },
            {
              prop: 'remark',
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
          if (item.prop === 'supplierName') {
            this.getSupplierList().then(res => {
              item.options = res
              console.log(item)
            });
          }
      });
      this.getList();
      setTimeout(() => {
        this.getTableHeight()
      }, 1)
    },
    methods: {
      // 双击表格某列
      dblclick(row, column, cell, event) {
        this.$router.push({ path: '/teachasset/purchase-contract/purchase-contract-detail', query: { type: 'edit', id: row.id } })
      },
      // 计算表格高度
      getTableHeight() {
        const assetAccept = document.getElementById('PurchaseContract').clientHeight
        let searchBox = document
          .getElementById('PurchaseContract')
          .getElementsByClassName('search-box')[0].clientHeight
        let pagination = document
          .getElementById('PurchaseContract')
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
        this.$router.push({ path: '/teachasset/purchase-contract/purchase-contract-detail', query: { type: 'add' } })
      },
      // 查询数据列表
      getList() {
        this.tableConfig.loading = true;
        getContract(
          this.searchConfig.data.contractBillCode,
          this.searchConfig.data.contract_name,
          this.searchConfig.data.contractDate[1],
          this.searchConfig.data.contractPrice[1],
          this.searchConfig.data.contractPrice[0],
          this.tableConfig.pageNum,
          this.tableConfig.pageSize,
          this.searchConfig.data.contractDate[0],
          this.searchConfig.data.supplierName
        ).then((Result) => {
          this.tableConfig.total = Result.data.total;


          this.tableConfig.data = Result.data.list;

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
  #PurchaseContract {
    flex: 1;
  }
</style>
