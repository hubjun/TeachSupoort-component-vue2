<template>
  <div id="CheckPlanCreate" ref="CheckPlanCreate">
    <search-bar
        :is-loading="isLoading"
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
        ></el-table-column>
      </table-list>
    </div>
  </div>
</template>

<script>
  import searchBar from '@/components/searchBar/searchBar'
  import tableList from '@/components/table'
  import { getCheckPlanCreate, exportCheckPlanCreate } from './api';
  import { BASE_URL } from '@/axios/Global';
  import { dictMixin } from '../../../mixins/dictMixin';

  export default {
    components: { searchBar, tableList },
    mixins: [dictMixin],
    data() {
      return {
        detailPath: '/teachasset/asset-depreciation/depreciation-way-detail',
        // 搜索按钮加载
        isLoading: false,
        // 搜索栏配置
        searchConfig: {
          data: {
            assetTypeId: '',
            assetCode: '',
            assetName: '',
            useDepartmentName: ''
          },
          config: [
            {
              label: '资产类型',
              labelWidth: '80px',
              prop: 'assetTypeId',
              type: 'select',
              options: []
            },
            {
              label: '资产名称',
              labelWidth: '80px',
              prop: 'assetName',
              type: 'text'
            },
            {
              label: '资产编码',
              labelWidth: '80px',
              prop: 'assetCode',
              type: 'text'
            },
            {
              label: '使用部门',
              labelWidth: '80px',
              prop: 'useDepartmentName',
              type: 'text'
            }
          ]
        },
        // 按钮组配置
        btnConfig: [
          {
            label: '生成盘点计划',
            type: 'primary',
            plain: true,
            customClass: '',
            loading: false,
            callback: 'createCheckPlan'
          }
        ],
        // 表格配置
        tableConfig: {
          data: [],
          config: [
            {
              prop: 'userDepartment',
              label: '使用部门',
              sortable: false
            },
            {
              prop: 'assetName',
              label: '资产名称'
            },
            {
              prop: 'assetCode',
              label: '资产编码',
              sortable: false
            },
            {
              prop: 'specification',
              label: '规格型号',
              sortable: false
            },
            {
              prop: 'unit',
              label: '计量单位',
              sortable: false
            },
            {
              prop: 'type',
              label: '资产类型',
              sortable: false
            }
          ],
          tableHeight: 0,
          currentPage: 1,
          pageSize: 10,
          total: 1,
          selectData: [],
          // 表格数据ids
          ids: null
        }
      }
    },
    created() {
      // this.getList()
      this.getAssetType();
    },
    mounted() {
      // 动态设置高度
      setTimeout(() => {
        this.getTableHeight()
        this.getList()
      }, 1)
      window.onresize = () => {
        this.getTableHeight()
      }
    },
    methods: {
      // 动态设置表格高度
      getTableHeight() {
        const assetAccept = document.getElementById('CheckPlanCreate').clientHeight
        let searchBox = document
          .getElementById('CheckPlanCreate')
          .getElementsByClassName('search-box')[0].clientHeight
        let pagination = document
          .getElementById('CheckPlanCreate')
          .getElementsByClassName('pagination')[0].clientHeight
        this.tableConfig.tableHeight =
          assetAccept - searchBox - pagination - 40 - 10 // 40为table-box的内边距，两个20位margin-bottom
      },
      getAssetType() {
        this.getAssetTypeList().then( res => {
          // if (res.status) {
            this.searchConfig.config.forEach(item => {
              if (item.type === 'select') {
                if (item.prop === 'assetTypeId') {
                  item.options = res;
                  item.options.unshift({label: '所有', value: ''});
                  // console.log(res)
                }
              }
            })
        })
      },
      // 获取表格数据
      getList() {
        let params = {
          assetTypeId: this.searchConfig.data.assetTypeId,
          assetName: this.searchConfig.data.assetName,
          assetCode: this.searchConfig.data.assetCode,
          userDepartment: this.searchConfig.data.useDepartmentName,
          pageNum: this.tableConfig.currentPage,
          pageSize: this.tableConfig.pageSize
        }
        // console.log(params)
        getCheckPlanCreate(params).then(res => {
          let data = res.data;
          this.tableConfig.data = data.list
          this.tableConfig.total = data.total
          this.isLoading = false
          let ids_arr = [];
          if (data.list.length) {
            for (let i = 0, len = data.list.length; i < len; i++) {
              ids_arr.push(data.list[i].id);
            }
            this.tableConfig.ids = ids_arr.join();            
          }
          // console.log(ids_arr.join());
        }).catch(() => {
          this.isLoading = false
        })
      },
      // 搜索回调
      handleSearch() {
        this.isLoading = true
        this.tableConfig.currentPage = 1
        this.getList()
      },
      // 重置回调
      handleReset() {
        this.tableConfig.currentPage = 1
        this.getList()
      },
      // 按钮组回调
      handleBtnClick(res) {
        this[res] && this[res]()
      },
      // 新增
      addData() {
        this.$router.push({
          path: this.$route.path + '-detail',
          query: {
            type: 'add'
          }
        })
      },
      // 修改每页数量
      changeSize(size) {
        this.tableConfig.pageSize = size
        this.tableConfig.currentPage = 1
        this.getList()
      },
      // 点击页码
      changePage(page) {
        this.tableConfig.currentPage = page
        this.getList()
      },
      createCheckPlan() {
        let params = {
          assetTypeId: this.searchConfig.data.assetTypeId,
          assetName: this.searchConfig.data.assetName,
          assetCode: this.searchConfig.data.assetCode,
          userDepartment: this.searchConfig.data.useDepartmentName,
        };
        this.btnConfig[0].loading = true;
        exportCheckPlanCreate(params).then(res => {
          if (res.status) {
            this.btnConfig[0].loading = false;
            this.$message({message: '资产盘点计划生成成功', type: 'success'});
            this.getList();
          }
        }).catch(() => {
          this.$message.error(res.msg);
          this.btnConfig[0].loading = false;
        })
      }
    }
  }
</script>

<style lang='less'>
  @import '../../../assets/css/variable.less';
  #CheckPlanCreate {
    flex: 1;
  }
</style>
