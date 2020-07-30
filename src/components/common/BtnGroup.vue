<template>
  <div id="BtnGroup" class="BtnGroup-wrap">
    <el-button v-for="(item, index) in config" v-show="!item.show" :loading="item.loading" :type="item.type" :plain="item.plain" :class="item.customClass" @click="clickBtn(item)" :key="index">{{item.label}}</el-button>
  </div>
</template>

<script>
  export default {
    name: 'BtnGroup',
    props: {
      config: Array
    },
    data() {
      return {}
    },
    created() {

    },
    mounted() {

    },
    methods: {
      clickBtn(res) {
        this.$emit('handle-click', res.callback)
      }
    },
    computed: {},
    components: {},
    watch: {}
  }
</script>

<style scoped lang="less">
@import '../../assets/css/variable.less';
.BtnGroup-wrap {
  .el-button {
    background-color: transparent;
    line-height: 34px;
    height: 34px;
    padding: 0 20px;
    & + .el-button {
      margin-left: 20px;
    }
    &.el-button--primary {
      &.is-plain {
        border: 1px solid @border-primary;
        color: @border-primary;
        &:hover {
          border-color: @border-primary-hover;
          background-color: transparent;
        }
        &:active {
          border-color: @border-primary-active;
          background-color: transparent;
        }
      }
    }
    &.el-button--success {
      &.is-plain {
        border: 1px solid @border-success;
        color: @border-success;
        &:hover {
          border-color: @border-success-hover;
          background-color: transparent;
        }
        &:active {
          border-color: @border-success-active;
          background-color: transparent;
        }
      }
    }
    &.el-button--danger {
      &.is-plain {
        border: 1px solid @border-danger;
        color: @border-danger;
        &:hover {
          border-color: @border-danger-hover;
          background-color: transparent;
        }
        &:active {
          border-color: @border-danger-active;
          background-color: transparent;
        }
      }
    }
    &.el-button--info {
      &.is-plain {
        color: #909399;
        &:hover {
          color: #909399;
        }
        &:active {
           color: #909399;
        }
      }
    }
  }
}
</style>
