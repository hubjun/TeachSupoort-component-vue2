<template>
  <div id="parameterUse" ref="parameterUse">
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
        </el-table-column>-->
      </table-list>
    </div>
  </div>
</template>

<script>
import searchBar from '@/components/searchBar/searchBar'
import tableList from '@/components/table'
import { getAssetsRecordDert } from './api'
import { dictMixin } from '@/mixins/dictMixin'
export default {
  components: { searchBar, tableList },
  mixins: [dictMixin],
  data() {
    return {
      searchConfig: {
        // 搜索栏配置
        data: {
          department: '',
          user_department: '',
          asset_name: '',
          asset_code: '',
          date: [],
          type: '',
          contract_bill_code: ''
        },
        config: [
          {
            label: '建账日期',
            labelWidth: '80px',
            prop: 'date',
            type: 'daterange'
          },
          {
            label: '资产名称',
            prop: 'asset_name',
            labelWidth: '80px',
            type: 'text',
            placeholder: '请输入资产名称'
          },
          {
            label: '资产类型',
            prop: 'type',
            labelWidth: '80px',
            type: 'select',
            placeholder: '请输入资产类型',
            options: []
          },
          {
            label: '单据编码',
            prop: 'contract_bill_code',
            labelWidth: '80px',
            type: 'text',
            placeholder: '请输入单据编码'
          },
          {
            label: '使用部门',
            prop: 'user_department',
            labelWidth: '80px',
            type: 'select',
            placeholder: '请选择使用部门',
            options: []
          },
          {
            label: '资产编号',
            prop: 'asset_code',
            type: 'text',
            labelWidth: '80px',
            placeholder: '请输入资产编号'
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
            prop: 'assetCode',
            label: '资产编号',
            sortable: false
          },
          {
            prop: 'assetName',
            label: '资产名称',
            sortable: false
          },
          {
            prop: 'specification',
            label: '规格型号',
            sortable: false
          },
          {
            prop: 'type',
            label: '资产类型',
            sortable: false
          },
          {
            prop: 'price',
            label: '原值',
            sortable: false
          },
          {
            prop: 'currentPrice',
            label: '净值',
            sortable: false
          },
          {
            prop: 'unit',
            label: '计量单位',
            sortable: false
          },
          {
            prop: 'supplierName',
            label: '供应商',
            sortable: false
          },
          {
            prop: 'contractBillCode',
            label: '单据编码',
            sortable: false
          },
          {
            prop: 'department',
            label: '管理部门',
            sortable: false
          },
          {
            prop: 'userDepartment',
            label: '使用部门',
            sortable: false
          },
          {
            prop: 'userName',
            label: '使用人员',
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
    this.userOfRoleList().then(res => {
      this.searchConfig.config.forEach(item => {
        if (item.type === 'select') {
          if (item.prop === 'user_department') {
            item.options = res
            item.options.unshift({ label: '所有', value: '' })
          }
          if (item.prop === 'type') {
            this.getAssetTypeList().then(Res => {
              item.options = Res
              item.options.unshift({ label: '所有', value: '' })
            })
          }
        }
      })
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
      const parameterUse = document.getElementById('parameterUse').clientHeight
      let searchBox = document
        .getElementById('parameterUse')
        .getElementsByClassName('search-box')[0].clientHeight
      let pagination = document
        .getElementById('parameterUse')
        .getElementsByClassName('pagination')[0].clientHeight
      this.tableConfig.tableHeight =
        parameterUse - searchBox - pagination - 40 - 10 // 40为table-box的内边距，两个20位margin-bottom
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
      let params = {
        asset_code: this.searchConfig.data.asset_code,
        asset_name: this.searchConfig.data.asset_name,
        contract_bill_code: this.searchConfig.data.contract_bill_code,
        endTime:
          this.searchConfig.data.date.length > 0
            ? this.searchConfig.data.date[1]
            : '',
        pageNum: this.tableConfig.currentPage,
        pageSize: this.tableConfig.pageSize,
        startTime:
          this.searchConfig.data.date.length > 0
            ? this.searchConfig.data.date[0]
            : '',
        type: '',
        asset_type_id: this.searchConfig.data.type,
        user_department: '',
        user_department_id: this.searchConfig.data.user_department,
        department: this.searchConfig.data.department
      }
      getAssetsRecordDert(params).then(res => {
        if (res.status) {
          this.tableConfig.data = res.data.list
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
    //   this.$store.commit('setParameterInfo', row)
    //   this.$router.push({
    //     path: `${this.$route.path}-detail`,
    //     query: {
    //       type: 'edit'
    //     }
    //   })
    // },
    dblclick(row, column, event) {
      this.$store.commit('setParameterInfo', row)
      this.$router.push({
        path: `${this.$route.path}-detail`,
        query: {
          type: 'edit'
        }
      })
    }
  }
}
</script>

<style lang='less'>
@import '../../../assets/css/variable.less';
#parameterUse {
  flex: 1;
}
</style>
