<template>
  <div id="ProvisionDepreciation" ref="ProvisionDepreciation">
    <search-bar
        :is-loading="isLoading"
        :datas="searchConfig"
        :config="btnConfig"
        @handle-search="handleSearch"
        @handle-click="handleBtnClick"
        @handle-reset="handleReset"
    >
      <template slot="custom-btn">
        <el-button type="primary" plain class="com-btn" @click="getList">计提折旧</el-button>
        <el-button type="primary" plain class="com-btn" @click="confirm">确认</el-button>
      </template>
    </search-bar>
    <div class="table-box">
      <table-list
          :tableHeight="tableConfig.tableHeight"
          :tableData="tableConfig.data"
          :currentPage="tableConfig.currentPage"
          :pageSize="tableConfig.pageSize"
          :total="tableConfig.total"
          @size-change="changeSize"
          @page-change="changePage"
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
        ></el-table-column>
      </table-list>
    </div>
  </div>
</template>

<script>
  import searchBar from '@/components/searchBar/searchBar'
  import tableList from '@/components/table'
  import { getProvisionDepreciationList, confirmProvisionDepreciationList } from './api';

  export default {
    components: { searchBar, tableList },
    data() {
      return {
        detailPath: '/teachasset/asset-depreciation/depreciation-way-detail',
        // 搜索按钮加载
        isLoading: false,
        // 搜索栏配置
        searchConfig: {
          hideBtn: true,
          data: {
            depreciationDate: ''
          },
          config: [
            {
              label: '计提月份',
              labelWidth: '80px',
              prop: 'depreciationDate',
              type: 'month'
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
              prop: 'assetCode',
              label: '资产编号',
              sortable: false
            },
            {
              prop: 'assetName',
              label: '资产名称'
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
              prop: 'depreciationPrice',
              label: '折旧金额',
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
    created() {
      let now = new Date()
      let yyyy = now.getFullYear()
      let mm = now.getMonth() < 9 ? ('0' + (now.getMonth() + 1)) : (now.getMonth() + 1)
      this.searchConfig.data.depreciationDate = `${yyyy}-${mm}`
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
        const assetAccept = document.getElementById('ProvisionDepreciation').clientHeight
        let searchBox = document
          .getElementById('ProvisionDepreciation')
          .getElementsByClassName('search-box')[0].clientHeight
        let pagination = document
          .getElementById('ProvisionDepreciation')
          .getElementsByClassName('pagination')[0].clientHeight
        this.tableConfig.tableHeight =
          assetAccept - searchBox - pagination - 40 - 10 // 40为table-box的内边距，两个20位margin-bottom
      },
      // 获取表格数据
      getList() {
        let params = {
          depreciationDate: this.searchConfig.data.depreciationDate,
          pageNum: this.tableConfig.currentPage,
          pageSize: this.tableConfig.pageSize
        }
        getProvisionDepreciationList(params).then(res => {
          this.tableConfig.data = res.data.list
          this.tableConfig.total = res.data.total
          this.isLoading = false
        }).catch(() => {
          this.isLoading = false
        })
      },
      confirm() {
        let params = {
          current_time: this.$formatDate(new Date()),
          depreciation_date: this.searchConfig.data.depreciationDate
        }
        confirmProvisionDepreciationList(params).then(res => {
          this.$success('确认')
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
      }
    }
  }
</script>

<style lang='less'>
  @import '../../../assets/css/variable.less';
  #ProvisionDepreciation {
    flex: 1;
  }
</style>
