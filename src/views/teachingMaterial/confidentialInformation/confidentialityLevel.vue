<template>
  <div id="confidentialityLevel" ref="confidentialityLevel">
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
            <div v-if="item.prop === 'secrecyState'">
              <div class="font-color-green" v-if="scope.row[item.prop] === 1">启用</div>
              <div class="font-color-red" v-else>停用</div>
            </div>
            <div v-else>{{scope.row[item.prop]}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <div>
              <el-button @click="editclick(scope.row,scope.row.id)" class="font-color-blue" type="text">编辑</el-button>
              <template v-if="scope.row.secrecyState===1">
                <el-button @click="ting(scope.row.id)" class="font-color-red" type="text">停用</el-button>
              </template>
              <template v-else>
                <el-button @click="qi(scope.row.id)" class="font-color-green" type="text">启用</el-button>
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
    getconfidentialityLevelList,
    startuserConfidentialityLevelList,
    stopuserConfidentialityLevelList
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
            secrecy_state: 0,
            Name: ''
          },
          config: [
            {
              label: '保密级别状态',
              labelWidth: '120px',
              prop: 'secrecy_state',
              placeholder: '请选择',
              type: 'select',
              options: [
                {
                  label: '所有',
                  value: 0
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
              placeholder: '请输入保密级别编码/名称/拼音码/五笔码',
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
          }
        ],
        tableConfig: {
          data: [],
          loading: false,
          config: [
            {
              prop: 'secrecyCode',
              label: '保密级别编码',
              sortable: false
            },
            {
              prop: 'secrecyName',
              label: '保密级别名称',
              sortable: true
            },
            {
              prop: 'secrecyState',
              label: '状态',
              sortable: false
            },
            {
              prop: 'secrecyPinyin',
              label: '拼音码',
              sortable: false
            },
            {
              prop: 'secrecyWubi',
              label: '五笔码',
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
      // 点击禁用
      ting(id) {
        stopuserConfidentialityLevelList(id).then(res => {
          this.$message.success('操作成功');
          this.getList();
        });
      },
      // 点击启用
      qi(id) {
        startuserConfidentialityLevelList(id).then(res => {
          this.$message.success('操作成功');
          this.getList();
        });
      },
      // 点击编辑
      editclick(data, id) {
        sessionStorage.setItem('confidentialityLevel', JSON.stringify(data))
        this.$router.push({ path: '/teachingmaterial/confidential-information/confidentiality-level-detail', query: { type: 'edit', id: id } })
      },
      // 双击表格某列
      dblclick(row, column, cell, event) {
        sessionStorage.setItem('confidentialityLevel', JSON.stringify(row))
        this.$router.push({ path: '/teachingmaterial/confidential-information/confidentiality-level-detail', query: { type: 'edit', id: row.id } })
      },
      // 计算表格高度
      getTableHeight() {
        const assetAccept = document.getElementById('confidentialityLevel').clientHeight
        let searchBox = document
          .getElementById('confidentialityLevel')
          .getElementsByClassName('search-box')[0].clientHeight
        let pagination = document
          .getElementById('confidentialityLevel')
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
        this.$router.push({ path: '/teachingmaterial/confidential-information/confidentiality-level-detail', query: { type: 'add' } })
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
        this.disable(false, ids.join(','));
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
        this.disable(true, ids.join(','));
      },
      // 查询数据列表
      getList() {
        this.tableConfig.loading = true;
        getconfidentialityLevelList(
          this.searchConfig.data.Name,
          this.searchConfig.data.secrecy_state,
          this.tableConfig.pageNum,
          this.tableConfig.pageSize
        ).then((Result) => {
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
  #confidentialityLevel {
    flex: 1;
  }
</style>
