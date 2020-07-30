<template>
  <div id="createPurchase" ref="createPurchase">
    <search-bar
      :datas="searchConfig"
      :config="btnConfig"
      @handle-search="handleSearch"
      @handle-click="handleBtnClick"
      @handle-reset="handleReset"
    ></search-bar>
    <div class="table-box">
      <table-list
        :tableHeight="tableConfig.tableHeight"
        :tableData="tableConfig.data"
        :currentPage="tableConfig.currentPage"
        :pageSize="tableConfig.pageSize"
        :total="tableConfig.total"
        @size-change="changeSize"
        @page-change="changePage"
        @select="handleSelection"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
        <el-table-column
          v-for="(item,index) in tableConfig.config"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          align="center"
          :sortable="item.sortable"
          :show-overflow-tooltip="true"
        ></el-table-column>
      </table-list>
    </div>
  </div>
</template>

<script>
import searchBar from '@/components/searchBar/searchBar'
import tableList from '@/components/table'
import { dictMixin } from '../../../mixins/dictMixin'
import  { purchasePlanReqList }  from './api'
export default {
  components: { searchBar, tableList },
  mixins: [dictMixin],
  data() {
    return {
      searchConfig: {
        // 搜索栏配置
        data: {
          schoolYearId: '',
          bookCategoryName: '',
          chooseWayId: '',
          materialTypeId: ''
        },
        config: [
          {
            label: '学年',
            labelWidth: '80px',
            prop: 'schoolYearId',
            type: 'select',
            options: []
          },
          {
            label: '选用方式',
            prop: 'chooseWayId',
            labelWidth: '80px',
            type: 'select',
            options: []
          },
          {
            label: '教材名称',
            prop: 'bookCategoryName',
            labelWidth: '80px',
            type: 'text',
            placeholder: '请输入教材名称'
          },
          {
            label: '教材类型',
            labelWidth: '80px',
            prop: 'materialTypeId',
            type: 'select',
            options: []
          }
        ]
      },
      btnConfig: [
        {
          label: '生成采购计划',
          type: 'primary',
          plain: true,
          customClass: '',
          callback: 'getPlan'
        }
      ],
      tableConfig: {
        data: [],
        config: [
          {
            prop: 'reqCode',
            label: '需求计划编码',
            sortable: false
          },
          {
            prop: 'categoryName',
            label: '教材名称',
            sortable: true
          },
          {
            prop: 'trainLevelName',
            label: '培养层次',
            sortable: false
          },
          {
            prop: 'materialTypeName',
            label: '教材类型',
            sortable: false
          },
          {
            prop: 'bookNum',
            label: '书号',
            sortable: false
          },
          {
            prop: 'chooseWayName',
            label: '选用方式',
            sortable: false
          },
          {
            prop: 'publisher',
            label: '出版社',
            sortable: false
          },
          {
            prop: 'reqNum',
            label: '需求数量',
            sortable: false
          },
          {
            prop: 'note',
            label: '备注',
            sortable: false
          }
        ],
        tableHeight: 0,
        currentPage: 1,
        pageSize: 10,
        total: 1,
        selectData: []
      }
    }
  },
  created() {
    this.searchConfig.config.forEach(item => {
      if (item.type === 'select') {
        if (item.prop === 'schoolYearId') {
          this.baseList('JB02XNXN').then(res => {
            this.mxYearList = res
            this.mxYearList.unshift({ label: '所有', value: '' })
            item.options = this.mxYearList
          })
        }
        if (item.prop === 'chooseWayId') {
          this.baseList('JB02JCLX').then(res => {
            this.mxSelectWay = res
            this.mxSelectWay.unshift({ label: '所有', value: '' })
            item.options = this.mxSelectWay
          })
        }
        if (item.prop === 'materialTypeId') {
          this.baseList('JB02XYFS').then(res => {
            this.mxTeachType = res
            this.mxTeachType.unshift({ label: '所有', value: '' })
            item.options =  this.mxTeachType
          })
        }
      }
    })
  },
  mounted() {
    setTimeout(() => {
      this.getTableHeight()
      this.getList()
    }, 1)
    window.onresize = () => {
      this.getTableHeight()
    }
  },
  methods: {
    getTableHeight() {
      const createPurchase = document.getElementById('createPurchase')
        .clientHeight
      let searchBox = document
        .getElementById('createPurchase')
        .getElementsByClassName('search-box')[0].clientHeight
      let pagination = document
        .getElementById('createPurchase')
        .getElementsByClassName('pagination')[0].clientHeight
      this.tableConfig.tableHeight =
        createPurchase - searchBox - pagination - 40 - 10 // 40为table-box的内边距，两个20位margin-bottom
    },
    handleSearch() {
      this.tableConfig.currentPage = 1
      this.getList()
    },
    handleReset() {
      this.getList()
    },
    handleBtnClick(res) {
      this[res] && this[res]()
    },
    getList() {
      let params = {
        bookCategoryName: this.searchConfig.data.bookCategoryName,
        chooseWayId: this.searchConfig.data.chooseWayId,
        materialTypeId: this.searchConfig.data.materialTypeId,
        schoolYearId: this.searchConfig.data.schoolYearId,
        pageNum: this.tableConfig.currentPage,
        pageSize: this.tableConfig.pageSize
      }
      purchasePlanReqList(params).then(res => {
        if(res.status) {
          this.tableConfig.data = res.data.records
          this.tableConfig.total = res.data.total
        }
      })
    },
    getPlan() {},
    changeSize(size) {
      this.tableConfig.pageSize = size
      this.tableConfig.currentPage = 1
      this.getList()
    },
    changePage(page) {
      this.tableConfig.currentPage = page
      this.getList()
    },
    handleSelection(data) {
      this.tableConfig.selectData = data
    }
  }
}
</script>

<style>
#createPurchase {
  flex: 1;
}
</style>
