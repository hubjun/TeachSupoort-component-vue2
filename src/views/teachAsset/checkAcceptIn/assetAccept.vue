<template>
  <div id="assetAccept" ref="assetAccept">
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
        <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
        <el-table-column
          v-for="(item,index) in tableConfig.config"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          align="center"
          :sortable="item.sortable"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <!-- <el-table-column label="操作" width="150" align="center" fixed="right">
          <template slot-scope="scope">
            <div>
              <el-button class="edit" type="text" @click="edit(scope.row)">编辑</el-button>
            </div>
          </template>
        </el-table-column> -->
      </table-list>
    </div>
  </div>
</template>

<script>
import searchBar from '@/components/searchBar/searchBar'
import tableList from '@/components/table'
import { getReceipt, getSupplier } from './api'
export default {
  components: { searchBar, tableList },
  data() {
    return {
      searchConfig: {
        // 搜索栏配置
        data: {
          receipt_code: '',
          contract_name: '',
          purchase_plan_asset_name: '',
          supplier_id: '',
          date: []
        },
        config: [
          {
            label: '单据编码',
            labelWidth: '80px',
            prop: 'receipt_code',
            type: 'text'
          },
          {
            label: '合同名称',
            prop: 'contract_name',
            labelWidth: '80px',
            type: 'text'
          },
          {
            label: '资产名称',
            prop: 'purchase_plan_asset_name',
            labelWidth: '80px',
            type: 'text'
          },
          {
            label: '建账日期',
            labelWidth: '80px',
            prop: 'date',
            type: 'daterange'
          },
          {
            label: '供应商',
            prop: 'supplier_id',
            type: 'select',
            labelWidth: '80px',
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
            prop: 'receiptCode',
            label: '单据编号',
            sortable: false
          },
          {
            prop: 'contractName',
            label: '合同名称',
            sortable: true
          },
          {
            prop: 'supplierName',
            label: '供应商名称',
            sortable: false
          },
          {
            prop: 'receiptDate',
            label: '建账日期',
            sortable: false
          },
          {
            prop: 'purchasePlanAssetName',
            label: '资产名称',
            sortable: false
          },
          {
            prop: 'receiptNumber',
            label: '数量',
            sortable: false
          },
          {
            prop: 'price',
            label: '单价',
            sortable: false
          },
          {
            prop: 'totalPrice',
            label: '金额',
            sortable: false
          },
          {
            prop: 'specification',
            label: '规格型号',
            sortable: false
          },
          {
            prop: 'unit',
            label: '计量单位',
            sortable: false
          },
          {
            prop: 'assetsType',
            label: '资产类型',
            sortable: false
          },
          {
            prop: 'petitionNo',
            label: '批件号',
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
    this.getSupplierList()
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
      const assetAccept = document.getElementById('assetAccept').clientHeight
      let searchBox = document
        .getElementById('assetAccept')
        .getElementsByClassName('search-box')[0].clientHeight
      let pagination = document
        .getElementById('assetAccept')
        .getElementsByClassName('pagination')[0].clientHeight
      this.tableConfig.tableHeight =
        assetAccept - searchBox - pagination - 40 - 10 // 40为table-box的内边距，两个20位margin-bottom
    },
    getSupplierList() {
      let params = {
        pageNum: 1,
        pageSize: 100000,
        searchCode: '',
        status: 1
      }
      getSupplier(params).then(res => {
        if (res.status) {
          this.searchConfig.config.forEach(item => {
            if (item.type === 'select') {
              if (item.prop === 'supplier_id') {
                res.data.list.map(e => {
                  e.value = e.id
                  e.label = e.supplierName
                })
                item.options = res.data.list
                item.options.unshift({ label: '所有', value: '' })
              }
            }
          })
        } else {
          this.$error(res.msg)
        }
      })
    },
    handleSearch() {
      console.log(this.searchConfig.data);
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
      let params = {
        pageNum: this.tableConfig.currentPage,
        pageSize: this.tableConfig.pageSize,
        contract_name: this.searchConfig.data.contract_name,
        endTime:
          this.searchConfig.data.date.length > 0
            ? this.searchConfig.data.date[1]
            : '',
        startTime:
          this.searchConfig.data.date.length > 0
            ? this.searchConfig.data.date[0]
            : '',
        receipt_code: this.searchConfig.data.receipt_code,
        purchase_plan_asset_name: this.searchConfig.data
          .purchase_plan_asset_name,
        supplier_id: this.searchConfig.data.supplier_id
      }
      getReceipt(params).then(res => {
        if (res.status) {
          this.tableConfig.data = res.data.list
          if(res.data.list.length > 0) {
            res.data.list.forEach(e => {
              if(e.receiptDate && e.receiptDate.indexOf(' ') !== -1) {
                e.receiptDate = e.receiptDate.split(' ')[0]
              }
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
    dblclick(row, column, event) {
      this.$router.push({
        path: `${this.$route.path}-detail`,
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
#assetAccept {
  flex: 1;
}
</style>
