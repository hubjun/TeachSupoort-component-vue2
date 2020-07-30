<template>
  <div class="search-box">
    <div class="name">
      <div>{{name ? name: $route.meta.breadcrumb[$route.meta.breadcrumb.length- 1]}}</div>
      <btn-group :config="config" @handle-click="handleBtnClick"></btn-group>
    </div>
    <el-form
      class="com-searchBar"
      ref="searchBar"
      :model="datas.data"
      :class="`${datas.config.length > 4 ? 'flex-4' : ''}`"
    >
      <el-form-item
        :label-width="item.labelWidth"
        class="searchBar-item"
        v-for="(item, index) in datas.config"
        :key="index"
        :label="item.label"
        :prop="item.prop"
      >
        <!--   普通文本输入   -->
        <el-input
          v-if="item.type === 'text'"
          :placeholder="item.placeholder"
          v-model="datas.data[item.prop]"
          :disabled="item.disabled"
        ></el-input>

        <!--   时间范围   -->
        <el-date-picker
          v-if="item.type === 'daterange'"
          v-model="datas.data[item.prop]"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :disabled="item.disabled"
        ></el-date-picker>
        <el-date-picker
          v-if="item.type === 'date'"
          v-model="datas.data[item.prop]"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :disabled="item.disabled"
        ></el-date-picker>

        <el-date-picker
          v-if="item.type === 'datetime'"
          v-model="datas.data[item.prop]"
          type="daterange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :disabled="item.disabled"
        ></el-date-picker>

        <el-date-picker
          v-if="item.type === 'dateRange'"
          v-model="datas.data[item.prop]"
          type="daterange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :disabled="item.disabled"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>

        <!--   年选择   -->
        <el-date-picker
          v-if="item.type === 'year'"
          v-model="datas.data[item.prop]"
          value-format="yyyy"
          :type="item.type"
          :placeholder="item.placeholder"
        ></el-date-picker>

        <!--   月份选择   -->
        <el-date-picker
          v-if="item.type === 'month'"
          v-model="datas.data[item.prop]"
          value-format="yyyy-MM"
          :type="item.type"
          :placeholder="item.placeholder"
          :disabled="item.disabled"
        ></el-date-picker>

        <!--  下拉框    -->
        <el-select v-if="item.type === 'select'" v-model="datas.data[item.prop]" :disabled="item.disabled" filterable>
          <el-option
            v-for="(option, index) in item.options"
            :label="option.label"
            :value="option.value"
            :placeholder="option.placeholder"
            :key="index"
          ></el-option>
        </el-select>

        <!--  范围    -->
        <div v-if="item.type === 'range'" class="form-item-range">
          <el-input v-model="datas.data[item.prop][0]" :disabled="item.disabled"></el-input>
          <span class="split-tit">{{item.split || '至'}}</span>
          <el-input v-model="datas.data[item.prop][1]" :disabled="item.disabled"></el-input>
        </div>

        <!--  数字范围    -->
        <div v-if="item.type === 'rangenumber'" class="form-item-range">
          <el-input type="number" v-model="datas.data[item.prop][0]" :disabled="item.disabled"></el-input>
          <span class="split-tit">{{item.split || '至'}}</span>
          <el-input type="number" v-model="datas.data[item.prop][1]" :disabled="item.disabled"></el-input>
        </div>
      </el-form-item>



      <div class="searchBar-group" v-if="!datas.hideBtn">
        <search-btn class="group-button" @clickBtn="search" :is-loading="isLoading"></search-btn>
        <reset-btn class="group-button" @clickBtn="reset"></reset-btn>
      </div>
      <div class="searchBar-group" v-else>
        <slot name="custom-btn"></slot>
      </div>
    </el-form>
  </div>
</template>

<script>
import searchBtn from '@/components/button/searchBtn'
import resetBtn from '@/components/button/resetBtn'
import BtnGroup from '@/components/common/BtnGroup.vue'
export default {
  props: {
    datas: Object,
    name: {
      type: String,
      default: ''
    },
    config: Array,
    isLoading: Boolean
  },
  components: {
    searchBtn,
    resetBtn,
    BtnGroup
  },
  data() {
    return {}
  },
  created() {},
  mounted() {},
  methods: {
    search(isloading) {
      this.$emit('handle-search')
    },
    reset() {
      this.$refs.searchBar.resetFields()
      this.$emit('handle-reset')
    },
    handleBtnClick(callback) {
      this.$emit('handle-click', callback)
    }
  },
  computed: {},
  watch: {}
}
</script>

<style lang="less">
.search-box {
  margin-bottom: 10px;
  padding: 40px 30px;
  background-color: #fff;
  font-family: Microsoft YaHei;
  font-weight: 400;
  box-shadow: 0px 0px 21px 0px rgba(211, 219, 232, 0.5);
  border-radius: 4px;
  .name {
    font-size: 22px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    padding-bottom: 20px;
    display: flex;
    height: 34px;
    align-items: center;
    justify-content: space-between;
  }
  .com-searchBar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding-left: 0 !important;
  }
  .flex-4 .searchBar-item {
    flex: 0 0 25%;
  }
}

// .com-searchBar.flex-4 .searchBar-item {
//   flex: 0 0 25%;
// }
.com-searchBar .searchBar-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
  max-width: 400px;
  flex: 1;
  padding-right: 50px;
}
.com-searchBar .searchBar-group {
  min-width: 160px;
}
.com-searchBar .group-button {
  margin-left: 10px;
}
.com-searchBar .el-form-item__content {
  // width: calc(100% - 50px);
  flex: 1;
  margin-left: 0 !important;
  /*line-height: 34px;*/
}
.com-searchBar .el-date-editor--daterange.el-input,
.el-date-editor--daterange.el-input__inner,
.el-date-editor--timerange.el-input,
.el-date-editor--timerange.el-input__inner {
  width: auto;
}
.com-searchBar .el-date-editor.el-input.el-date-editor--year{
  width: 100%;
}
.com-searchBar .el-select {
  width: 100%;
}
.com-searchBar .el-form-item__label {
  text-align-last: auto;
}
.com-searchBar .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: auto;
}
.com-searchBar {
  .form-item-range {
    width: 100%;
    display: flex;
    .split-tit {
      min-width: 30px;
      text-align: center;
    }
  }
}
</style>
