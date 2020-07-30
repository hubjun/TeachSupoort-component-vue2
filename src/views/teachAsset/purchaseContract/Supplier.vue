<template>
  <div id="Supplier" ref="Supplier">
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
        <el-table-column type="selection" width="55" align="center"></el-table-column>
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
            <div v-if="item.prop === 'status'">
              <div class="font-color-green" v-if="scope.row.status===1">启用</div>
              <div class="font-color-red" v-else>停用</div>
            </div>
            <div v-else>{{scope.row[item.prop]}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <div>
              <el-button @click="editclick(scope.row.id)" class="font-color-blue" type="text">编辑</el-button>
              <template v-if="scope.row.status===1">
                <el-button @click="disable(2,scope.row.id)" class="font-color-red" type="text">停用</el-button>
              </template>
              <template v-else>
                <el-button @click="disable(1,scope.row.id)" class="font-color-green" type="text">启用</el-button>
              </template>
            </div>
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
    getSupplier,
    disableSupplier
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
            SupplierStatus: '',
            Name: ''
          },
          config: [
            {
              label: '供应商状态',
              labelWidth: '100px',
              prop: 'SupplierStatus',
              placeholder: '请选择',
              type: 'select',
              options: [
                {
                  label: '所有',
                  value: ''
                },
                {
                  label: '启用',
                  value: 1
                },
                {
                  label: '停用',
                  value: 2
                }
              ]
            },
            {
              label: '',
              labelWidth: '0',
              prop: 'Name',
              placeholder: '请输入供应商编码/名称/拼音码/五笔码',
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
          {
            label: '批量启用',
            type: 'success',
            plain: true,
            customClass: '',
            loading: false,
            callback: 'multiOpen'
          },
          {
            label: '批量停用',
            type: 'danger',
            plain: true,
            customClass: '',
            loading: false,
            callback: 'multiClose'
          }
        ],
        tableConfig: {
          data: [],
          loading: false,
          config: [
            {
              prop: 'supplierCode',
              label: '供应商编码',
              sortable: false
            },
            {
              prop: 'supplierName',
              label: '供应商名称',
              sortable: true
            },
            {
              prop: 'status',
              label: '状态',
              sortable: false
            },
            {
              prop: 'address',
              label: '供应商地址',
              sortable: false
            },
            {
              prop: 'contactName',
              label: '联系人',
              sortable: false
            },
            {
              prop: 'contactNumber',
              label: '联系电话',
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
      setTimeout(() => {
        this.getTableHeight()
      }, 1)
      this.getList();
    },
    methods: {
      // 点击禁用/启用
      disable(disable, id) {
        disableSupplier(disable, id).then(res => {
          this.$message.success('操作成功');
          this.btnConfig[1].loading = false;
          this.btnConfig[2].loading = false;
          this.getList();
        });
      },
      // 点击编辑
      editclick(id) {
        this.$router.push({ path: '/teachasset/purchase-contract/supplier-detail', query: { type: 'edit', id: id } })
      },
      // 双击表格某列
      dblclick(row, column, cell, event) {
        sessionStorage.setItem('Supplier', JSON.stringify(row));
        this.$router.push({ path: '/teachasset/purchase-contract/supplier-detail', query: { type: 'edit', id: row.id } })
      },
      // 计算表格高度
      getTableHeight() {
        const assetAccept = document.getElementById('Supplier').clientHeight
        let searchBox = document
          .getElementById('Supplier')
          .getElementsByClassName('search-box')[0].clientHeight
        let pagination = document
          .getElementById('Supplier')
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
      // 点击新增
      addData() {
        this.$router.push({ path: '/teachasset/purchase-contract/supplier-detail', query: { type: 'add' } })
      },
      // 点击批量启用
      multiOpen() {
        if(this.tableConfig.selectData.length === 0) {
          this.$message.info('请勾选要操作的数据');
          return;
        }
        let ids = [];
        for(let i = 0; i < this.tableConfig.selectData.length; i++) {
          ids.push(this.tableConfig.selectData[i].id);
        }
        this.btnConfig[1].loading = true;
        this.disable(1, ids.join(','));
      },
      // 点击批量停用
      multiClose() {
        if(this.tableConfig.selectData.length === 0) {
          this.$message.info('请勾选要操作的数据');
          return;
        }
        let ids = [];
        for(let i = 0; i < this.tableConfig.selectData.length; i++) {
          ids.push(this.tableConfig.selectData[i].id);
        }
        this.btnConfig[2].loading = true;
        this.disable(2, ids.join(','));
      },
      // 查询数据列表
      getList() {
        this.tableConfig.loading = true;
        getSupplier(this.tableConfig.pageNum, this.tableConfig.pageSize, this.searchConfig.data.Name, this.searchConfig.data.SupplierStatus).then(Result => {
          this.tableConfig.total = Result.data.total;
          this.tableConfig.data = Result.data.list;
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
      }
    }
  }
</script>

<style lang='less'>
  @import '../../../assets/css/variable.less';
  @import '../../../assets/css/style.less';
  #Supplier {
    flex: 1;
  }
</style>
