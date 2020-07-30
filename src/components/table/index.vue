<template>
  <div class="Table">
    <el-table
      v-loading="loading"
      :ref="tableName"
      stripe
      :data="tableData"
      :height="tableHeight"
      border
      fit
      style="width: 100%"
      :highlight-current-row="currentFlag"
      :tree-props="{children: 'children'}"
      :header-cell-style="tableHeaderCellStyle"
      :cell-style="tableCellStyle"
      :row-style="tableRowStyle"
      :row-key="rowKey"
      @select="select"
      @selection-change="handleSelectionChange"
      @row-dblclick="dblclick"
      @row-click="rowClick"
      @current-change="currentChange"
      @select-all="selectAll"
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
  components: {
    tablePagination
  },
  props: {
    tableName: {
      type: String,
      default: 'Table'
    },
    loading: {
      type: Boolean,
      default: false
    },
    tableHeight: {
      type: Number,
      default: 0
    },
    tableData: {
      type: Array,
      default: () => []
    },
    rowKey: {
      type: String,
      default: ''
    },
    currentFlag: {
      type: Boolean,
      default: false
    },
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
      },
      selectData: [],
      selectRow: []
    }
  },
  watch: {
    selectData(data) {
      this.selectRow = []
      if (data.length > 0) {
        data.forEach((item, index) => {
          this.selectRow.push(this.tableData.indexOf(item))
        })
      }
    },
    tableData(data) {
      if (
        (this.tableName === 'consume' || this.tableName === 'supplies') &&
        data.length > 0
      ) {
        this.$nextTick(() => {
          data.filter(e => {
            if (e.choose_flag === 2) {
              this.$refs[this.tableName].toggleRowSelection(e, true)
            }
          })
        })
      }
    }
  },
  methods: {
    // 选中行高亮
    tableRowStyle({ row, rowIndex }) {
      if (this.selectRow.includes(rowIndex)) {
      }
    },
    // 选中复选框
    select(selection, row) {
      this.$emit('selection', selection, row)
    },
    // 选中全选框
    selectAll(selection) {
      this.$emit('selectAll', selection)
    },
    // 获取选中的row
    handleSelectionChange(data) {
      if (this.tableName === 'preserve') {
        if (data.length > 1) {
          this.$refs[this.tableName].clearSelection()
          this.$refs[this.tableName].toggleRowSelection(data.pop())
        }
      } else {
        this.selectData = data
        this.$emit('select', data)
      }
    },
    // 复选框改变状态
    currentChange(currentRow, oldCurrentRow) {
      if (this.tableName === 'preserve') {
        this.$refs[this.tableName].toggleRowSelection(currentRow)
      }
    },
    // 双击列表触发
    dblclick(row, column, event) {
      this.$emit('dblclick', row, column, event)
    },
    // 点击列表触发
    rowClick(row, column, event) {
      this.$emit('rowClick', row, column, event)
    },
    // 改变页面的size
    changeSize(size) {
      this.$emit('size-change', size)
    },
    // 改变当前页面
    changePage(page) {
      this.$emit('page-change', page)
    }
    // clickBtn(type, row) {
    //   this.$emit('handle-group-click', type, row)
    // }
  },
  mounted() {
    if (this.tableName === 'consume') {
    }
  }
}
</script>

<style>
.Table::before {
  content: '';
  display: block;
  position: absolute;
  width: 15px;
  height: 15px;
  bottom: -1px;
  left: -1px;
}
.Table::after {
  content: '';
  display: block;
  position: absolute;
  width: 15px;
  height: 15px;
  bottom: -1px;
  right: -1px;
}

.Table > .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #fff6e6;
}
.Table > .el-table--enable-row-hover .el-table__body tr.current-row td,
.Table
  > .el-table--enable-row-hover
  .el-table__body
  .el-table__row--striped.current-row
  td {
  background-color: #ccc;
}
.Table > .el-table {
  border: none;
  box-sizing: border-box;
  background-color: transparent;
}
.Table > .el-table::before {
  background-color: #c8c8c8;
  height: 0;
}
.Table > .el-table--border::after,
.Table > .el-table--group::after {
  background-color: #c8c8c8;
  width: 0;
}
.Table .el-table__fixed-right::before,
.Table .el-table__fixed::before {
  background-color: #c8c8c8;
  height: 0;
}
/* .Table .el-table thead tr{
   border-bottom: none;
} */
.Table .el-table thead tr th {
  height: 42px;
  line-height: 42px;
  border-right: 1px solid #eee;
  border-top: 1px solid #eee;
  font-family: 'Microsoft YaHei';
  font-weight: bold;
  font-size: 14px;
}
.Table .el-table thead tr th:first-of-type {
  border-left: 1px solid #eee;
}
.Table .el-table thead tr th:last-of-type {
  border-right: 1px solid #eee;
}
/* .Table .el-table tbody tr {
} */
.Table .el-table tr td:first-of-type {
  border-left: 1px solid #eee;
}
.Table .el-table tr td {
  height: 44px;
  border-right: 1px solid #eee;
  border-bottom: 1px solid #eee;
}
/* .Table .el-icon-arrow-right {
  color: #ffffff;
} */
.Table .el-checkbox__inner {
  width: 16px;
  height: 16px;
}
.Table .el-table--striped .el-table__body tr.el-table__row--striped td {
  background-color: #fbfcfd;
}
.Table .el-table--striped .el-table__body tr.el-table__row--striped:hover > td{
  background-color: #fff6e6;
}
.Table .el-table__body tr.hover-row > td {
  background-color: #fff6e6;
}
.Table .el-table .sort-caret.descending {
  border-top-color: #93979e;
}
.Table .el-table .sort-caret.ascending {
  border-bottom-color: #93979e;
}
.Table .el-table .ascending .sort-caret.ascending {
  border-bottom-color: #409eff;
}
.Table .el-table .descending .sort-caret.descending {
  border-top-color: #409eff;
}
/* .Table .el-table__body tr.current-row>td{
  background-color: #fdf3ea !important;
  color: #f19944;
} */
.Table .el-table__empty-block {
  border: 1px solid #eee;
  border-top: none;
}
.Table .el-table__empty-block .el-table__empty-text {
  /* display: none; */
} 
.pagination {
  text-align: center;
  padding: 40px 0 30px;
}
</style>
<style lang="less">
@import '../../assets/css/variable.less';
.Table {
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
