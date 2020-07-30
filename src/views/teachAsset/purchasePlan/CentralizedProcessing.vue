<template>
  <div id="CentralizedProcessing" ref="CentralizedProcessing">
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
        <el-table-column type="selection" width="55" align="center"></el-table-column>
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
    getCentralizedProcessing,
    generateCentralizedProcessing
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
            type: '',
            name: '',
            planingCode: ''
          },
          config: [
            {
              label: '资产类型',
              labelWidth: '80px',
              prop: 'type',
              placeholder: '请选择',
              type: 'select',
              options: []
            },
            {
              label: '资产名称',
              labelWidth: '80px',
              prop: 'name',
              placeholder: '请选择',
              type: 'text'
            },
            {
              label: '需求计划单据编码',
              labelWidth: '130px',
              prop: 'planingCode',
              placeholder: '请选择',
              type: 'text'
            }
          ]
        },
        btnConfig: [
          {
            label: '生成采购计划',
            type: 'primary',
            plain: true,
            customClass: '',
            callback: 'addData'
          }
        ],
        tableConfig: {
          data: [],
          loading: false,
          config: [
            {
              prop: 'planningCode',
              label: '单据编码',
              sortable: false
            },
            {
              prop: 'assetsName',
              label: '资产名称',
              sortable: true
            },
            {
              prop: 'quantity',
              label: '申报数量',
              sortable: false
            },
            {
              prop: 'specification',
              label: '规格型号',
              sortable: false
            },
            {
              prop: 'assetsUnit',
              label: '计量单位',
              sortable: false
            },
            {
              prop: 'assetsType',
              label: '资产类型',
              sortable: false
            },
            {
              prop: 'batchNumber',
              label: '批件号',
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
        this.$router.push({ path: '/teachasset/demand-plan/demand-approve-detail', query: { type: 'edit', id: row.id } })
      },
      // 计算表格高度
      getTableHeight() {
        const assetAccept = document.getElementById('CentralizedProcessing').clientHeight
        let searchBox = document
          .getElementById('CentralizedProcessing')
          .getElementsByClassName('search-box')[0].clientHeight
        let pagination = document
          .getElementById('CentralizedProcessing')
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



        // generateCentralizedProcessing(ids.join(',')).then((result) => {
        // })
      },
      // 查询数据列表
      getList() {
        let param = {
          assetsName: this.searchConfig.data.name,
          planingCode: this.searchConfig.data.planingCode,
          typeId: this.searchConfig.data.type,
          pageNum: this.tableConfig.pageNum,
          pageSize: this.tableConfig.pageSize
        };
        this.tableConfig.loading = true;
        getCentralizedProcessing(param).then((Result) => {
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
  #CentralizedProcessing {
    flex: 1;
  }
</style>
