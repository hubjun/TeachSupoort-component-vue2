<template>
  <div class="tab_2">
    <el-table
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
    >
      <slot></slot>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    tableName: {
      type: String,
      default: 'tab_2'
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
    }
  },
  data() {
    return {
      tableHeaderCellStyle: {
        background: '#F3F4FA',
        padding: '6px 0',
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
    }
  },
  methods: {
    // 选中行高亮
    tableRowStyle({ row, rowIndex }) {
      if (this.selectRow.includes(rowIndex)) {
      }
    },
    select(selection, row) {
      this.$emit('selection', selection, row)
    },
    // 获取选中的row
    handleSelectionChange(data) {
      this.selectData = data
      this.$emit('select', data)
    },
    dblclick(row, column, event) {
      this.$emit('dblclick', row, column, event)
    },
    rowClick(row, column, event) {
      this.$emit('rowClick', row, column, event)
    }
  },
  mounted() {}
}
</script>

<style>
.tab_2::before {
  content: '';
  display: block;
  position: absolute;
  width: 15px;
  height: 15px;
  bottom: -1px;
  left: -1px;
  /* border-bottom: 3px solid #105095; */
  /* border-left: 3px solid #105095; */
}
.tab_2::after {
  content: '';
  display: block;
  position: absolute;
  width: 15px;
  height: 15px;
  bottom: -1px;
  right: -1px;
}
.tab_2 .el-table__body tr.hover-row > td {
  background-color: #fff6e6;
}
.tab_2 > .el-table--enable-row-hover .el-table__body tr:hover > td,
.tab_2 > .el-table--enable-row-hover .el-table__body tr.el-table__row--striped:hover > td {
  background-color: #fff6e6;
}
.tab_2 > .el-table--enable-row-hover .el-table__body tr.current-row td,
.tab_2
  > .el-table--enable-row-hover
  .el-table__body
  .el-table__row--striped.current-row
  td {
  background-color: #ccc;
}
.tab_2 > .el-table {
  border: none;
  box-sizing: border-box;
  background-color: transparent;
}
.tab_2 > .el-table::before {
  background-color: #c8c8c8;
  height: 0;
}
.tab_2 > .el-table--border::after,
.tab_2 > .el-table--group::after {
  width: 0;
}
.tab_2 .el-table__fixed-right::before,
.tab_2 .el-table__fixed::before {
  /* background-color: #c8c8c8; */
  height: 0;
}
/* .tab_2 .el-table thead tr{
   border-bottom: none;
} */
.tab_2 .el-table thead tr th {
  height: 44px;
  border-right: 1px solid #e6e9ef;
  border-top: 1px solid #e6e9ef;
  font-family: 'Microsoft YaHei';
  font-weight: bold;
  font-size: 14px;
}
.tab_2 .el-table thead tr th:first-of-type {
  border-left: 1px solid #e6e9ef;
}
.tab_2 .el-table thead tr th:last-of-type {
  border-right: 1px solid #e6e9ef;
}
/* .tab_2 .el-table tbody tr {
} */
.tab_2 .el-table tr td:first-of-type {
  border-left: 1px solid #e6e9ef;
}
.tab_2 .el-table tr td {
  height: 44px;
  border-right: 1px solid #e6e9ef;
  border-bottom: 1px solid #e6e9ef;
}
.tab_2 .el-icon-arrow-right {
  color: #ffffff;
}
.tab_2 .el-checkbox__inner {
  width: 16px;
  height: 16px;
}
.tab_2 .el-table--striped .el-table__body tr.el-table__row--striped td {
  background-color: #fbfcfd;
}
.tab_2 .el-table--striped .el-table__body tr.el-table__row--striped:hover td{

}
.tab_2 .el-table .sort-caret.descending {
  border-top-color: #93979e;
}
.tab_2 .el-table .sort-caret.ascending {
  border-bottom-color: #93979e;
}
.tab_2 .el-table .ascending .sort-caret.ascending {
  border-bottom-color: #409eff;
}
.tab_2 .el-table .descending .sort-caret.descending {
  border-top-color: #409eff;
}
/* .tab_2 .el-table__body tr.current-row>td{
  background-color: #fdf3ea !important;
  color: #f19944;
} */
.tab_2 .el-table__empty-block {
  border: 1px solid #e6e9ef;
  border-top: none;
}
.tab_2 .el-table__empty-block .el-table__empty-text {
  display: none;
}
.tab_2 .el-input__inner{
    text-align: center;
}
</style>
