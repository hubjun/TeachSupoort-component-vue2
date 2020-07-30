<template>
  <div id="AssetSelectTable" ref="AssetSelectTable" class="AssetSelectTable-wrap">
    <div class="query-box">
      <div class="query-item">
        <div class="query-label">资产编码</div>
        <div class="query-input">
          <el-input placeholder="请输入资产编码" v-model="searchconfig.code" clearable></el-input>
        </div>
      </div>
      <div class="query-item">
        <div class="query-label">资产名称</div>
        <div class="query-input">
          <el-input placeholder="请输入资产名称" v-model="searchconfig.name" clearable></el-input>
        </div>
      </div>
      <div class="query-item">
        <div class="query-label">使用人</div>
        <div class="query-input">
          <el-input placeholder="请输入使用人" v-model="searchconfig.user_name" clearable></el-input>
        </div>
      </div>
      <div class="query-item">
        <div class="query-label">资产类型</div>
        <div class="query-input">
          <el-select v-model="searchconfig.asset_type_id" clearable filterable>
            <el-option
              v-for="option in typeArr"
              :label="option.label"
              :value="option.value"
              :key="option.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="query-item">
        <div class="query-label">使用部门</div>
        <div class="query-input">
          <el-select :disabled="departDisabled" v-model="searchconfig.user_department" clearable filterable>
            <el-option
              v-for="option in departList"
              :label="option.label"
              :value="option.value"
              :key="option.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="query-item">
        <div class="query-label">资产状态</div>
        <div class="query-input">
          <el-select v-model="searchconfig.status" :disabled="true" clearable filterable>
            <el-option
                v-for="option in statusOptions"
                :label="option.label"
                :value="option.value"
                :key="option.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="query-btn">
        <search-btn @clickBtn="search"></search-btn>
        <reset-btn @clickBtn="reset"></reset-btn>
      </div>
    </div>
    <table-component :tableData="supplesData" :tableHeight="supplesHeight" @dblclick="dblclick">
      <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
      <el-table-column prop="assetCode" label="资产编号" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="assetName" label="资产名称" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="type" label="资产类型" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column
        prop="specification"
        label="规格型号"
        align="center"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column prop="unit" label="计量单位" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="userName" label="使用人" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column
        prop="userDepartment"
        label="使用部门"
        align="center"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
          prop="status"
          label="资产状态"
          align="center"
          :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.status === 1">闲置</div>
          <div v-if="scope.row.status === 2">已报废</div>
          <div v-if="scope.row.status === 3">使用中</div>
        </template>
      </el-table-column>
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
  name: 'AssetSelectTable',
  components: {
    tableComponent,
    tablePagination,
    searchBtn,
    resetBtn
  },
  props: {
    // 资产状态
    status: Number,
    department: Number,
    departDisabled: {
      type: Boolean,
      default: false
    }
  },
  mixins: [dictMixin],
  data() {
    return {
      searchconfig: {
        code: '',
        name: '',
        asset_type_id: '',
        user_department: '',
        user_name: '',
        status: ''
      },
      options: [],
      typeArr: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      supplesData: [],
      supplesHeight: 400,
      statusOptions: [
        {
          label: '所有',
          value: ''
        },
        {
          label: '闲置',
          value: 1
        },
        {
          label: '已报废',
          value: 2
        },
        {
          label: '使用中',
          value: 3
        }
      ],
      departList: []
    }
  },
  created() {
    this.mxConfirmStatus.unshift({ label: '', value: '所有' })
    this.options = this.mxConfirmStatus
    
    // 初始化资产状态
    this.searchconfig.status = this.status || ''
    this.searchconfig.user_department = this.department || ''
    this.getList()
    this.getAssetTypeList().then(res => {
      this.typeArr = res
    })
    this.getDepartList().then(res => {
      this.departList = res
    })
  },
  mounted() {},
  methods: {
    search() {
      this.currentPage = 1
      this.getList()
    },
    reset() {
      this.searchconfig.code = ''
      this.searchconfig.name = ''
      this.searchconfig.asset_type_id = ''
      this.searchconfig.user_department = ''
      this.searchconfig.user_name = ''
      this.currentPage = 1
      this.getList()
    },
    getList() {
      let params = {
        asset_code: this.searchconfig.code,
        asset_name: this.searchconfig.name,
        contract_bill_code: '',
        endTime: '',
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        startTime: '',
        type: '',
        asset_type_id: this.searchconfig.asset_type_id,
        user_department: '',
        user_department_id: this.searchconfig.user_department,
        user_name: this.searchconfig.user_name,
        status: this.searchconfig.status
      }
      this.$getAssetsRecordList(params).then(res => {
        if (res.status) {
          if (res.data.list.length > 0) {
            res.data.list.map(e => {
              e.assetsId = JSON.parse(JSON.stringify(e.id))
              e.id = null
              return e
            })
          }
          this.supplesData = res.data.list
          this.total = res.data.total
        } else {
          this.$error(res.msg)
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
  #AssetSelectTable{
    .tab_2 .el-table__empty-block .el-table__empty-text{
      display:block;
    }
  }
</style>
