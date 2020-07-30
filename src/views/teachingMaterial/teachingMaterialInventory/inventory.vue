<template>
  <div id="inventory" ref="inventory">
    <search-bar
      :datas="searchConfig"
      :config="btnConfig"
      :is-loading="isLoading"
      @handle-search="handleSearch"
      @handle-click="handleBtnClick"
      @handle-reset="handleReset"
    ></search-bar>
    <div class="table-box">
      <table-list
        :loading="tableConfig.loading"
        :tableHeight="tableConfig.tableHeight"
        :tableData="tableConfig.data"
        :currentPage="tableConfig.pageNum"
        :pageSize="tableConfig.pageSize"
        :total="tableConfig.total"
        @dblclick="dblclick"
        @size-change="changeSize"
        @page-change="changePage"
        @select="handleSelection"
      >
        <el-table-column label="序号" type="index" width="55" align="center"></el-table-column>
        <el-table-column
          v-for="(item,index) in tableConfig.config"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          align="center"
          :sortable="item.sortable"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <div v-if="item.prop === 'state'">
              <div>
                <div>{{searchConfig.config[2].options.filter((a) => a.value === scope.row.state).length && searchConfig.config[2].options.filter((a) => a.value === scope.row.state)[0].label}}</div>
              </div>
            </div>
            <div v-else>{{scope.row[item.prop]}}</div>
          </template>
        </el-table-column>
      </table-list>
    </div>
  </div>
</template>

<script>
  import searchBar from '@/components/searchBar/searchBar'
  import tableList from '@/components/table'
  import { dictMixin } from '@/mixins/dictMixin'
  import {
    getInventoryList,
  } from './api';

  export default {
    components: { searchBar, tableList },
    mixins: [dictMixin],
    data: function () {
      return {
        TypeCode: 'JB01ZCLX',
        isLoading: false,
        searchConfig: {
          // 搜索栏配置
          data: {
            categoryName: '',
            inventoryDate: ['', ''],
            repertoryInventoryCode: '',
            state: ''
          },
          config: [
            {
              label: '盘点单编码',
              prop: 'repertoryInventoryCode',
              placeholder: '请输入',
              type: 'text'
            },
            {
              label: '盘点日期',
              prop: 'inventoryDate',
              placeholder: '请输入',
              type: 'date'
            },
            {
              label: '计划状态',
              prop: 'state',
              placeholder: '请输入',
              type: 'select',
              options: [
                {
                  label: '所有',
                  value: ''
                },
                {
                  label: '待确认',
                  value: 1
                },
                {
                  label: '已盘点',
                  value: 2
                }
              ]
            },
            {
              label: '教材名称',
              prop: 'categoryName',
              placeholder: '请输入',
              type: 'text'
            }
          ]
        },
        btnConfig: [
          {
            label: '新增',
            type: 'primary',
            plain: true,
            customClass: '',
            callback: 'addData'
          },
        ],
        tableConfig: {
          data: [],
          loading: false,
          config: [
            {
              prop: 'repertoryInventoryCode',
              label: '盘点单编码',
              sortable: false
            },
            {
              prop: 'categoryName',
              label: '教材名称',
              sortable: true
            },
            {
              prop: 'inventoryDate',
              label: '盘点日期',
              sortable: false
            },
            {
              prop: 'state',
              label: '计划状态',
              sortable: false
            },
            {
              prop: 'remark',
              label: '备注',
              sortable: false
            }
          ],
          tableHeight: 0,
          pageNum: 1,
          pageSize: 10,
          total: 1,
          selectData: []
        }
      }
    },
    created() {
    },
    mounted() {
      this.searchConfig.config.forEach(item => {
        if (item.type === 'select') {
          if (item.prop === 'type') {
            this.getAssetTypeList().then(res => {
              item.options = res
              item.options.unshift({ label: '所有', value: '' });
            });
          }
        }
      });
      setTimeout(() => {
        this.getTableHeight()
      }, 1)
      this.getList();
    },
    methods: {
      // 双击表格某列
      dblclick(row, column, cell, event) {
        if(row.state === 2) {
          this.$router.push({ path: '/teachingmaterial/teaching-material-inventory/inventory-detail', query: { type: 'detail', id: row.id} })
        }else {
          this.$router.push({ path: '/teachingmaterial/teaching-material-inventory/inventory-detail', query: { type: 'edit', id: row.id} })

        }
      },
      // 计算表格高度
      getTableHeight() {
        const assetAccept = document.getElementById('inventory').clientHeight
        let searchBox = document
          .getElementById('inventory')
          .getElementsByClassName('search-box')[0].clientHeight
        let pagination = document
          .getElementById('inventory')
          .getElementsByClassName('pagination')[0].clientHeight
        this.tableConfig.tableHeight =
          assetAccept - searchBox  - pagination - 40  - 10
      },
      // 点击查询
      handleSearch() {
        this.tableConfig.pageNum = 1;
        this.isLoading = true;
        this.getList();
      },
      // 点击重置
      handleReset() {
        this.tableConfig.pageNum = 1;
        this.getList();
      },
      // 重置逻辑
      handleBtnClick(res) {
        this[res] && this[res]()
      },
      // 点击生成采购计划
      addData() {
        this.$router.push({ path: '/teachingmaterial/teaching-material-inventory/inventory-detail', query: { type: 'add' } })
      },
      // 查询数据列表
      getList() {
        let param = {
          categoryName: this.searchConfig.data.categoryName,
          inventoryDateEnd: this.searchConfig.data.inventoryDate[1],
          inventoryDateStart: this.searchConfig.data.inventoryDate[0],
          repertoryInventoryCode: this.searchConfig.data.repertoryInventoryCode,
          state: this.searchConfig.data.state,
          pageNum: this.tableConfig.pageNum,
          pageSize: this.tableConfig.pageSize
        };
        this.tableConfig.loading = true;
        getInventoryList(param).then((Result) => {
          this.tableConfig.total = Result.data.total;


          this.tableConfig.data = Result.data.records;

          this.isLoading = false;
          this.tableConfig.loading = false;
        });
      },
      // 切换分页每页显示数量
      changeSize(size) {
        this.tableConfig.pageSize = size
        this.tableConfig.currentPage = 1
        this.getList()
      },
      // 切换分页页码
      changePage(page) {
        this.tableConfig.pageNum = page;
        this.getList()
      },
      // 勾选表格选中框事件
      handleSelection(data) {
        this.tableConfig.selectData = data
      },
      getIconName(val) {
        let res = '';
        switch(val) {
          case 0:
            res = 'font-color-blue'
            break;
          case 1:
            res = 'font-color-blue'
            break;
          case 2:
            res = 'font-color-blue'
            break;
          case 3:
            res = 'font-color-blue'
            break;
          case 9:
            res = 'font-color-red'
            break;
        }
        return res
      }
    }
  }
</script>

<style lang='less'>
  @import '../../../assets/css/variable.less';
  @import '../../../assets/css/style.less';
  #inventory {
    flex: 1;
  }
</style>
