<template>
  <el-button
    class="search-btn"
    type="primary"
    size="medium"
    :loading="isLoading"
    :disabled="isLoading"
    @click="clickBtn"
    :style="style"
  >{{text}}</el-button>
</template>
<script>
export default {
  props: {
    // isLoading: {
    //   type: Boolean,
    //   default: false
    // },
    text: {
      type: String,
      default: '查询'
    },
    fontSize: {
      type: Number,
      default: 14
    },
    marginLeft: {
      type: Number,
      default: 18
    },
    isLoading: Boolean
  },
  data() {
    return {
      style: {
        padding: '1px 21px',
        'font-size': `${this.fontSize}px`
      },
      timeout: null
    }
  },
  methods: {
    clickBtn() {
      this.$emit('clickBtn')
    }
  }
}
</script>
<style lang='less'>
@import '../../assets/css/variable.less';
.search-btn.el-button--primary.el-button--medium {
  border: none;
  height: 34px;
  line-height: 34px;
  background-color: @m-color;
}
.search-btn.el-button--primary.el-button--medium:hover {
  background-color: @m-color-hover;
}
.search-btn.el-button--primary.el-button--medium:active {
  background-color: @m-color-active;
}
</style>
