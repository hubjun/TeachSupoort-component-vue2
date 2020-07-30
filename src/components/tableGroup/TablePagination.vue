 <template>
  <div class="pagination">
    <el-pagination
      popper-class="paginations"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  props: {
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
    // pageSizes:{
    //   type: Array,
    //   default: 0
    // }
  },
  data() {
    return {}
  },
  methods: {
    // 改变页面的size
    handleSizeChange(size) {
      this.$emit('size-change', size)
    },
    // 改变当前页面
    handleCurrentChange(page) {
      this.$emit('page-change', page)
    }
  },
  mounted() {}
}
</script>

<style lang="less">
.pagination .el-pagination .el-select .el-input .el-input__inner,
.pagination .el-pagination__editor.el-input .el-input__inner {
  background: transparent;
  color: #666;
  border: 1px solid #eee;
  height: 34px;
  line-height: 34px;
}
.pagination .el-pager {
  margin: 0 5px;
}
.pagination .el-pager li.active + li {
  border-left: 1px solid #eee;
}
.pagination .el-pager li {
  background: transparent;
  margin: 0 5px;
  color: #666;
  border: 1px solid #EEE;
  border-radius: 0px;
  height: 34px;
  line-height: 34px;
}
.pagination .el-pager li.active {
  background-color: #60C293;
  color: #fff;
}
.pagination .el-pagination .btn-next,
.pagination .el-pagination .btn-prev {
  background: transparent;
  color: #666;
  border: 1px solid #eee;
  border-radius: 0px;
  height: 34px;
  line-height: 34px;
}
.pagination .el-pagination .btn-next {
  padding-left: 6px;
}
.pagination .el-pagination .btn-prev {
  padding-right: 6px;
}
.el-pagination span:not([class*='suffix']) {
  height: 34px;
  line-height: 34px;
  color: #666;
}
.pagination .el-pagination button:disabled {
  background: transparent;
  cursor: not-allowed;
  color: #666;
}
.pagination .el-pagination span.el-pagination__total{
  line-height: 34px;
}
.pagination .el-pagination__total,
.pagination .el-pagination__jump {
  color: #f0f0f0;
}
.pagination .el-select .el-input .el-select__caret {
  color: #666;
  line-height: 34px;
}
.pagination .el-pagination button:hover {
  // background: #3e94f6;
  color: #666;
}
.pagination .el-pager li:hover {
  background-color: #60C293;
  color: #fff;
}
.pagination .el-select-dropdown__item.selected {
  color: #206bff;
}
.Table .pagination .el-pagination__sizes,
.Table .pagination .el-pagination__total{
  line-height: 34px;
  height: 34px;
}
</style>
