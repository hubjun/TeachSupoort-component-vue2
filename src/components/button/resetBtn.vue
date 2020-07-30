<template>
  <el-button
    class="reset-btn"
    type="primary"
    size="medium"
    @click="clickBtn"
    :style="style"
  >{{text}}</el-button>
</template>
<script>
export default {
  props: {
    text: {
      type: String,
      default: '重置'
    },
    fontSize: {
      type: Number,
      default: 14
    },
    marginLeft: {
      type: Number,
      default: 18
    }
  },
  data() {
    return {
      isLoading: false,
      style: {
        padding: '1px 21px',
        'font-size': `${this.fontSize}px`
      }
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
.reset-btn.el-button--primary.el-button--medium {
  border: none;
  height: 34px;
  line-height: 34px;
  background-color: @border-reset;
}
.reset-btn.el-button--primary.el-button--medium:hover {
  background-color: @border-reset-hover;
}
.reset-btn.el-button--primary.el-button--medium:active {
  background-color: @border-reset-active;
}
</style>