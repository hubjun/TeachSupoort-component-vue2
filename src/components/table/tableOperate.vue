<template>
  <div class="table-operate">
    <table-component :tableData="tableData" :tableHeight="tableHeight">
      <el-table-column width="55" v-if="indexFlag" type="index" label="序号" align="center"></el-table-column>
      <el-table-column
        v-for="(item,index) in tableColumn"
        :key="index"
        :label="item.label"
        align="center"
        :sortable="item.sortable"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <div v-if="item.type!=='detail'">
            <el-input v-model="scope.row[item.prop]"></el-input>
          </div>
          <div v-else>
            <span>{{scope.row[item.prop]}}</span>
          </div>
        </template>
      </el-table-column>
    </table-component>
  </div>
</template>

<script>
import tableComponent from '@/components/table/table_2'
export default {
  props: {
    indexFlag: {
      type: Boolean,
      default: true
    },
    tableHeight: {
      type: Number,
      default: 0
    },
    tableData: {
      type: Array,
      default: () => []
    },
    tableColumn: {
      type: Array,
      default: () => []
    },
    operateFlag: {
      type: Boolean,
      default: true
    }
  },
  components: {
    tableComponent
  },
  data() {
    return {}
  },
  created() {},
  mounted() {},
  methods: {
  }
}
</script>

<style>
</style>
