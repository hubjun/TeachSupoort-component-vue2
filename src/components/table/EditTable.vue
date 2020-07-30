<template>
  <div id="EditTable" ref="EditTable" class="EditTable-wrap">
    <el-table
      :data="tableData"
      border
      stripe
      :height="tableHeight"
      :header-cell-style="tableHeaderCellStyle"
      :cell-style="tableCellStyle"
      style="width: 100%"
    >
      <slot></slot>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    tableData: Array,
    tableHeight: {
      type: Number,
      default: 400
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
        padding: '10px 0',
        color: '#666'
      }
    }
  },
  created() {},
  methods: {
    // 选中行高亮
    tableRowStyle({ row, rowIndex }) {
      if (this.selectRow.includes(rowIndex)) {
      }
    }
  }
}
</script>

<style lang="less">
.EditTable-wrap {
  .el-table {
    height: 42px;
    line-height: 42px;
    font-size: 14px;
    border: none;
    box-sizing: border-box;
    background-color: transparent;
    &::before {
      height: 0;
    }
    &::after {
      width: 0;
    }
    .el-table--enable-row-hover .el-table__body tr:hover > td,
    .el-table--enable-row-hover
      .el-table__body
      tr.el-table__row--striped:hover
      > td {
      background-color: #fff6e6;
    }
    .el-table--enable-row-hover .el-table__body tr.current-row td,
    .el-table--enable-row-hover
      .el-table__body
      .el-table__row--striped.current-row
      td {
      background-color: #ccc;
    }
    // .el-table--border::after,
    // .el-table--group::after {
    //   background-color: #c8c8c8;
    //   width: 0;
    // }
    .el-table__fixed-right::before {
      height: 0;
    }
    .el-table--border::after {
      width: 0;
    }
    tr {
      td {
        height: 34px;
        border-right: 1px solid #eee;
        border-bottom: 1px solid #eee;
        &:first-of-type {
          border-left: 1px solid #eee;
        }
        div {
          font-size: 14px;
          .el-button {
            padding-top: 0;
            padding-bottom: 0;
          }
        }
        .cell .el-input {
          width: 100%;
          .el-input__inner {
            height: 30px;
            line-height: 30px;
          }
          .el-input__icon {
            line-height: 30px;
          }
        }
      }
    }
    thead {
      tr {
        th {
          height: 42px;
          line-height: 42px;
          border-right: 1px solid #eee;
          border-top: 1px solid #eee;
          font-family: 'Microsoft YaHei';
          font-weight: bold;
          font-size: 14px;
          &:first-of-type {
            border-left: 1px solid #eee;
          }
          &:last-of-type {
            border-right: 1px solid #eee;
          }
        }
      }
    }
  }
}
</style>
