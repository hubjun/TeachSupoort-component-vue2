<template>
  <div id="inventoryInquire" ref="inventoryInquire">
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
            <div v-if="item.prop === 'checkState'">
              <div>
                <div :class="`${getIconName(scope.row.checkState)}`">{{mxDemandPlanStatus.filter((a) => a.value === scope.row.checkState).length && mxDemandPlanStatus.filter((a) => a.value === scope.row.checkState)[0].label}}</div>
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
    getInventoryInquireList,
    getExcel
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
            author: '',
            bookNum: '',
            categoryCode: '',
            categoryName: '',
            publisher: '',
            trainLevelId: ''
          },
          config: [
            {
              label: '教材编码',
              prop: 'categoryCode',
              placeholder: '请输入',
              type: 'text'
            },
            {
              label: '教材名称',
              prop: 'categoryName',
              placeholder: '请输入',
              type: 'text'
            },
            {
              label: '作者',
              prop: 'author',
              placeholder: '请输入',
              type: 'text'
            },
            {
              label: '出版社',
              prop: 'publisher',
              placeholder: '请输入',
              type: 'text'
            },
            {
              label: '书号',
              prop: 'bookNum',
              placeholder: '请输入',
              type: 'text'
            },
            {
              label: '培养层次',
              prop: 'trainLevelId',
              placeholder: '请输入',
              type: 'text'
            }
          ]
        },
        btnConfig: [
          {
            label: 'Excel导出',
            type: 'primary',
            plain: true,
            customClass: '',
            callback: 'ClickGetExcel'
          },
        ],
        tableConfig: {
          data: [],
          loading: false,
          config: [
            {
              prop: 'categoryCode',
              label: '教材编码',
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
              prop: 'bookNum',
              label: '书号',
              sortable: false
            },
            {
              prop: 'author',
              label: '作者',
              sortable: false
            },
            {
              prop: 'publisher',
              label: '出版社',
              sortable: false
            },
            {
              prop: 'publishDate',
              label: '出版日期',
              sortable: false
            },
            {
              prop: 'price',
              label: '单价',
              sortable: false
            },
            {
              prop: 'storagePlace',
              label: '存放地点',
              sortable: false
            },
            {
              prop: 'bookcase',
              label: '书架号',
              sortable: false
            },
            {
              prop: 'quantity',
              label: '库存',
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
      // 点击导出表格
      ClickGetExcel() {
        let ids = [];
        this.tableConfig.data.forEach(r => {
          ids.push(r.id);
        })
        let xmlResquest = new XMLHttpRequest();
        xmlResquest.open('GET', getExcel(ids.join(',')), true);
        xmlResquest.setRequestHeader('Content-type', 'application/vnd.ms-excel');
        xmlResquest.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem('TOKEN'));
        xmlResquest.responseType = 'blob';
        xmlResquest.onload = function (oEvent) {
          let content = xmlResquest.response;
          let elink = document.createElement('a');
          elink.download = '教材库存.xlsx';
          elink.style.display = 'none';
          let blob = new Blob([content]);
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          document.body.removeChild(elink);
        };
        xmlResquest.send();
      },
      // 计算表格高度
      getTableHeight() {
        const assetAccept = document.getElementById('inventoryInquire').clientHeight
        let searchBox = document
          .getElementById('inventoryInquire')
          .getElementsByClassName('search-box')[0].clientHeight
        let pagination = document
          .getElementById('inventoryInquire')
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
        if(this.tableConfig.selectData.length > 0) {

          var ids = [];
          this.tableConfig.selectData.forEach(r => {
            ids.push(r.id);
          })

          sessionStorage.setItem('PurchasePlanData', JSON.stringify(this.tableConfig.selectData));
          this.$router.push({ path: '/teachasset/purchase-plan/purchase-plan-detail', query: { type: 'Tadd' } })
        }else {
          this.$message.info('请勾选要生成计划的明细');
        }



        // generateinventoryInquire(ids.join(',')).then((result) => {
        // })
      },
      // 查询数据列表
      getList() {
        let param = {
          author: this.searchConfig.data.author,
          bookNum: this.searchConfig.data.bookNum,
          categoryCode: this.searchConfig.data.categoryCode,
          categoryName: this.searchConfig.data.categoryName,
          publisher: this.searchConfig.data.publisher,
          trainLevelId: this.searchConfig.data.trainLevelId,
          pageNum: this.tableConfig.pageNum,
          pageSize: this.tableConfig.pageSize
        };
        this.tableConfig.loading = true;
        getInventoryInquireList(param).then((Result) => {
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
  #inventoryInquire {
    flex: 1;
  }
</style>
