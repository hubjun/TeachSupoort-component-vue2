<template>
  <div id="demo">
    <table-list
      :tableHeight="tableHeight"
      :tableData="tableData"
      :currentPage="currentPage"
      :pageSize="pageSize"
      :total="total"
      @size-change="changeSize"
      @page-change="changePage"
    >
      <el-table-column
        v-for="(item,index) in tableColumn"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        align="center"
        :sortable="item.sortable"
        :show-overflow-tooltip="true"
      ></el-table-column>
    </table-list>
  </div>
</template>

<script>
import tableList from '@/components/table'
export default {
  name: 'demo',
  components: {
    tableList
  },
  data() {
    return {
      tableHeight: 100,
      tableData: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
      currentPage: 1,
      pageSize: 10,
      total: 23,
      tableColumn: [
        {
          prop: 'supplyCode',
          label: '单据编号',
          sortable: false
        },
        {
          prop: 'supplyCode',
          label: '单据日期',
          sortable: true
        },
        {
          prop: 'supplyCode',
          label: '仓库',
          sortable: false
        },
        {
          prop: 'supplyCode',
          label: '物资',
          sortable: false
        },
        {
          prop: 'supplyCode',
          label: '操作员',
          sortable: false
        },
        {
          prop: 'supplyCode',
          label: '变更前批号',
          sortable: false
        },
        {
          prop: 'supplyCode',
          label: '变更后批号',
          sortable: false
        }
      ]
    }
  },
  created() {},
  mounted() {},
  methods: {
    getList() {},
    changeSize(size) {
      this.pageSize = size
      this.currentPage = 1
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

<style scoped lang="less">
</style>
<style>
</style>
