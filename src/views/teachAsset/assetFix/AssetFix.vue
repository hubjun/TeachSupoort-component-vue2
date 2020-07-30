<template>
  <div id="AssetFix" ref="AssetFix">
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
          @dblclick="dblclick"
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
<!--        <el-table-column-->
<!--            label="操作"-->
<!--            width="150"-->
<!--            align="center"-->
<!--            fixed="right"-->
<!--        >-->
<!--          <template slot-scope="scope">-->
<!--            <div>-->
<!--              <el-button class="font-color-blue" type="text" @click.stop="edit(scope.row)">编辑</el-button>-->
<!--            </div>-->
<!--          </template>-->
<!--        </el-table-column>-->
      </table-list>
    </div>
  </div>
</template>

<script>
  import searchBar from '@/components/searchBar/searchBar'
  import tableList from '@/components/table'
  import { dictMixin } from '../../../mixins/dictMixin';
  import { getFixList } from './api';

  export default {
    components: { searchBar, tableList },
    mixins: [dictMixin],
    data() {
      return {
        detailPath: '/teachasset/asset-fix/asset-fix-detail',
        // 搜索按钮加载
        isLoading: false,
        // 搜索栏配置
        searchConfig: {
          data: {
            maintenanceCode: '',
            time: [],
            maintenanceDepartmentId: '',
            assetName: ''
          },
          config: [
            {
              label: '单据编码',
              labelWidth: '80px',
              prop: 'maintenanceCode',
              placeholder: '请输入单据编码',
              type: 'text'
            },
            {
              label: '维修日期',
              prop: 'time',
              labelWidth: '80px',
              type: 'daterange'
            },
            {
              label: '使用部门',
              prop: 'maintenanceDepartmentId',
              labelWidth: '80px',
              type: 'select',
              options: []
            },
            {
              label: '资产名称',
              labelWidth: '80px',
              prop: 'assetName',
              placeholder: '请输入单资产名称',
              type: 'text'
            }
          ]
        },
        // 按钮组配置
        btnConfig: [
          {
            label: '新增',
            type: 'primary',
            plain: true,
            customClass: '',
            callback: 'addData'
          }
        ],
        // 表格配置
        tableConfig: {
          data: [],
          config: [
            {
              prop: 'maintenanceCode',
              label: '单据编码',
              sortable: false
            },
            {
              prop: 'assetName',
              label: '资产名称'
            },
            {
              prop: 'maintenanceDate',
              label: '维修日期',
              sortable: false
            },
            {
              prop: 'userDepartment',
              label: '使用部门',
              sortable: false
            },
            {
              prop: 'userName',
              label: '使用人',
              sortable: false
            },
            {
              prop: 'maintenancePrice',
              label: '维修金额',
              sortable: false
            },
            {
              prop: 'maintenanceContent',
              label: '维修内容',
              sortable: false
            },
            {
              prop: 'remark',
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
          if (item.prop === 'maintenanceDepartmentId') {
            this.getDepartDictList().then(res => {
              item.options = res
            });
          }
        }
      });
      this.getList()
    },
    mounted() {
      // 动态设置高度
      setTimeout(() => {
        this.getTableHeight()
      }, 1)
      window.onresize = () => {
        this.getTableHeight()
      }
    },
    methods: {
      // 动态设置表格高度
      getTableHeight() {
        const assetAccept = document.getElementById('AssetFix').clientHeight
        let searchBox = document
          .getElementById('AssetFix')
          .getElementsByClassName('search-box')[0].clientHeight
        let pagination = document
          .getElementById('AssetFix')
          .getElementsByClassName('pagination')[0].clientHeight
        this.tableConfig.tableHeight =
          assetAccept - searchBox - pagination - 40 - 10 // 40为table-box的内边距，两个20位margin-bottom
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
      // 获取表格数据
      getList() {
        let params = {
          assetName: this.searchConfig.data.assetName,
          maintenanceCode: this.searchConfig.data.maintenanceCode,
          maintenanceDepartmentId: this.searchConfig.data.maintenanceDepartmentId,
          maintenanceDateStart: this.searchConfig.data.time[0] || '',
          maintenanceDateEnd: this.searchConfig.data.time[1] || '',
          pageNum: this.tableConfig.currentPage,
          pageSize: this.tableConfig.pageSize
        }

        getFixList(params).then(res => {
          this.tableConfig.data = res.data.list
          this.tableConfig.total = res.data.total
          this.isLoading = false
        }).catch(() => {
          this.isLoading = false
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
      // 编辑
      edit(row) {
        this.$router.push({
          path: this.detailPath,
          query: {
            type: 'edit',
            id: row.id
          }
        })
      },
      // 双击事件
      dblclick(row) {
        this.$router.push({
          path: this.detailPath,
          query: {
            type: 'edit',
            id: row.id
          }
        })
      }
    }
  }
</script>

<style lang='less'>
  @import '../../../assets/css/variable.less';
  #AssetFix {
    flex: 1;
  }
</style>
