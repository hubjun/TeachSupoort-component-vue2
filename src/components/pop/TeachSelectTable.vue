<template>
  <div id="TeachSelectTable" ref="TeachSelectTable" class="TeachSelectTable-wrap">
    <div class="query-box">
      <div class="query-item">
        <div class="query-label">采购单据编码</div>
        <div class="query-input">
          <el-input placeholder="请输入采购单据编码" v-model="searchconfig.purchasePlanCode" clearable></el-input>
        </div>
      </div>
      <div class="query-item">
        <div class="query-label">教材编码</div>
        <div class="query-input">
          <el-input placeholder="请输入教材编码" v-model="searchconfig.categoryCode" clearable></el-input>
        </div>
      </div>
      <div class="query-item">
        <div class="query-label">教材名称</div>
        <div class="query-input">
          <el-input placeholder="请输入教材名称" v-model="searchconfig.categoryName" clearable></el-input>
        </div>
      </div>
      <div class="query-btn">
        <search-btn @clickBtn="search"></search-btn>
        <reset-btn @clickBtn="reset"></reset-btn>
      </div>
    </div>
    <table-component :tableData="supplesData" :tableHeight="tableHeight" @dblclick="dblclick">
      <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
      <el-table-column width="150" prop="purchasePlanCode" label="采购计划单据编码" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="categoryCode" label="教材编码" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="categoryName" label="教材名称" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column
        prop="materialTypeName"
        label="教材类型"
        align="center"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column prop="author" label="作者" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="bookNum" label="书号" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="publisher" label="出版社" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="publishDate" label="出版日期" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column
        prop="trainLevelName"
        label="培养层次"
        align="center"
        :show-overflow-tooltip="true"
      ></el-table-column>
    </table-component>
    <table-pagination
      @size-change="changeSize"
      @page-change="changePage"
      :currentPage="currentPage"
      :pageSize="pageSize"
      :total="total"
    ></table-pagination>
  </div>
</template>

<script>
import tableComponent from '@/components/table/table_2'
import tablePagination from '@/components/tableGroup/TablePagination'
import searchBtn from '@/components/button/searchBtn'
import resetBtn from '@/components/button/resetBtn'
import { dictMixin } from '@/mixins/dictMixin'
export default {
  name: 'TeachSelectTable',
  components: {
    tableComponent,
    tablePagination,
    searchBtn,
    resetBtn
  },
  props: {
    // 资产状态
    tableHeight: {
      type: Number,
      default: 400
    }
  },
  mixins: [dictMixin],
  data() {
    return {
      searchconfig: {
        purchasePlanCode: '',
        categoryCode: '',
        categoryName: ''
      },
      currentPage: 1,
      pageSize: 10,
      total: 0,
      supplesData: []
    }
  },
  created() {
    // 初始化资产状态
    this.getList()
  },
  mounted() {},
  methods: {
    search() {
      this.currentPage = 1
      this.getList()
    },
    reset() {
      this.searchconfig.purchasePlanCode = ''
      this.searchconfig.categoryCode = ''
      this.searchconfig.categoryName = ''
      this.currentPage = 1
      this.getList()
    },
    getList() {
      let params = {
        categoryCode: this.searchconfig.purchasePlanCode,
        categoryName: this.searchconfig.name,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        purchasePlanCode: this.currentPage
      }
      this.$planlist(params).then(res => {
        if (res.status) {
          if (res.data.records.length > 0) {
            res.data.records.map(e => {
              e.purchasePlanId = JSON.parse(JSON.stringify(e.id))
              e.id = null
              e.press = e.publisher
              return e
            })
          }
          this.supplesData = res.data.records
          this.total = res.data.total
        }
      })
    },
    dblclick(row, column, event) {
      this.$emit('handle-select', row)
    },
    changeSize(size) {
      this.currentPage = 1
      this.pageSize = size
      this.getList()
    },
    changePage(page) {
      this.currentPage = page
      this.getList()
    }
  },
  computed: {},
  watch: {}
}
</script>

<style lang="less">
  #TeachSelectTable{
    .tab_2 .el-table__empty-block .el-table__empty-text{
      display:block;
    }
  }
</style>
