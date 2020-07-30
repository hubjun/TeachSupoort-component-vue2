<template>
  <div class="table_3">
    <el-table
      :data="tableConfig.data"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      :header-cell-style="tableHeaderCellStyle"
      :cell-style="tableCellStyle"
      border
      default-expand-all
      :height="tableConfig.height"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <slot></slot>
    </el-table>
    <div>
      <table-pagination
        @size-change="changeSize"
        @page-change="changePage"
        :currentPage="currentPage"
        :pageSize="pageSize"
        :total="total"
      ></table-pagination>
    </div>
  </div>
</template>

<script>
import tablePagination from '@/components/tableGroup/TablePagination'
export default {
  components: { tablePagination },
  props: {
    tableConfig: Object,
    currentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    total: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      tableHeaderCellStyle: {
        background: 'rgba(243,243,245,1)',
        padding: '0',
        color: '#333'
      },
      tableCellStyle: {
        padding: '6px 0',
        color: '#666'
      }
    }
  },
  created() {},
  mounted() {
    console.log(this.tableConfig)
  },
  methods: {
    // 改变页面的size
    changeSize(size) {
      this.$emit('size-change', size)
    },
    // 改变当前页面
    changePage(page) {
      this.$emit('page-change', page)
    }
  }
}
</script>

<style>
.table_3::before {
  content: '';
  display: block;
  position: absolute;
  width: 15px;
  height: 15px;
  bottom: -1px;
  left: -1px;
}
.table_3::after {
  content: '';
  display: block;
  position: absolute;
  width: 15px;
  height: 15px;
  bottom: -1px;
  right: -1px;
}

.table_3 .el-table{
    margin-bottom: 0 !important;
}
.table_3 > .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #fff6e6;
}
.table_3 > .el-table--enable-row-hover .el-table__body tr.current-row td,
.table_3
  > .el-table--enable-row-hover
  .el-table__body
  .el-table__row--striped.current-row
  td {
  background-color: #ccc;
}
.table_3 > .el-table {
  border: none;
  box-sizing: border-box;
  background-color: transparent;
}
.table_3 > .el-table::before {
  background-color: #c8c8c8;
  height: 0;
}
.table_3 > .el-table--border::after,
.table_3 > .el-table--group::after {
  background-color: #c8c8c8;
  width: 0;
}
.table_3 .el-table__fixed-right::before,
.table_3 .el-table__fixed::before {
  background-color: #c8c8c8;
  height: 0;
}
/* .table_3 .el-table thead tr{
   border-bottom: none;
} */
.table_3 .el-table thead tr th {
  height: 42px;
  line-height: 42px;
  border-right: 1px solid #eee;
  border-top: 1px solid #eee;
  font-family: 'Microsoft YaHei';
  font-weight: bold;
  font-size: 14px;
}
.table_3 .el-table thead tr th:first-of-type {
  border-left: 1px solid #eee;
}
.table_3 .el-table thead tr th:last-of-type {
  border-right: 1px solid #eee;
}
/* .table_3 .el-table tbody tr {
} */
.table_3 .el-table tr td:first-of-type {
  border-left: 1px solid #eee;
}
.table_3 .el-table tr td {
  height: 44px;
  border-right: 1px solid #eee;
  border-bottom: 1px solid #eee;
}
/* .table_3 .el-icon-arrow-right {
  color: #ffffff;
} */
.table_3 .el-checkbox__inner {
  width: 16px;
  height: 16px;
}
.table_3 .el-table--striped .el-table__body tr.el-table__row--striped td {
  background-color: #fbfcfd;
}
.table_3
  .el-table--striped
  .el-table__body
  tr.el-table__row--striped:hover
  > td {
  background-color: #fff6e6;
}
.table_3 .el-table__body tr.hover-row > td {
  background-color: #fff6e6;
}
.table_3 .el-table .sort-caret.descending {
  border-top-color: #93979e;
}
.table_3 .el-table .sort-caret.ascending {
  border-bottom-color: #93979e;
}
.table_3 .el-table .ascending .sort-caret.ascending {
  border-bottom-color: #409eff;
}
.table_3 .el-table .descending .sort-caret.descending {
  border-top-color: #409eff;
}
/* .table_3 .el-table__body tr.current-row>td{
  background-color: #fdf3ea !important;
  color: #f19944;
} */
.table_3 .el-table__empty-block {
  border: 1px solid #eee;
  border-top: none;
}
.table_3 .el-table__empty-block .el-table__empty-text {
  /* display: none; */
}
.pagination {
  text-align: center;
  padding: 40px 0 30px;
}
</style>
<style lang="less">
@import '../../assets/css/variable.less';
.table_3 {
  .el-button {
    height: 32px;
    line-height: 32px;
    padding: 0 10px;
    &.edit {
      color: @border-primary;
    }
    &.open {
      color: @border-success;
    }
    &.close {
      color: @border-danger;
    }
  }
}
</style>
