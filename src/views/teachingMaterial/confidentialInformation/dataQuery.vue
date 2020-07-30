<template>
  <div id="dataQuery" ref="dataQuery">
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
            <div v-if="item.prop === 'dataType'">
              <div>
                <div>{{scope.row.dataType===1?'地图':'教材'}}</div>
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
    getConfidentialityList
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
            data_code: '',
            data_name: '',
            data_type: 0,
            secrecy_levelid: 0
          },
          config: [
            {
              label: '资料编号',
              prop: 'data_code',
              placeholder: '请输入',
              type: 'text'
            },
            {
              label: '保密级别',
              prop: 'secrecy_levelid',
              placeholder: '请选择',
              type: 'select',
              options: this.mxconfidentialityLevel
            },
            {
              label: '资料类型',
              prop: 'data_type',
              placeholder: '请选择',
              type: 'select',
              options: [
                {
                  label: '所有',
                  value: 0
                },
                {
                  label: '地图',
                  value: 1
                },
                {
                  label: '教材',
                  value: 2
                }
              ]
            },
            {
              label: '资料名称',
              prop: 'data_name',
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
              prop: 'dataCode',
              label: '资料编号',
              sortable: false
            },
            {
              prop: 'dataType',
              label: '资料类型',
              sortable: true
            },
            {
              prop: 'dataName',
              label: '资料名称',
              sortable: false
            },
            {
              prop: 'publishDate',
              label: '出版日期',
              sortable: false
            },
            {
              prop: 'dataAddr',
              label: '存放地点',
              sortable: false
            },
            {
              prop: 'dataShelf',
              label: '书架号',
              sortable: false
            },
            {
              prop: 'author',
              label: '作者',
              sortable: false
            },
            {
              prop: 'dataNum',
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
      this.getConfidentialityLevel().then(r => {
        this.searchConfig.config[1].options = this.mxconfidentialityLevel
        this.searchConfig.config[1].options.unshift({
          label: '所有',
          value: 0
        })
        console.log(this.searchConfig.config[1].options);
      })

      setTimeout(() => {
        this.getTableHeight()
      }, 1)
      this.getList();
    },
    methods: {
      // 双击表格某列
      dblclick(row, column, cell, event) {
        this.$router.push({ path: '/teachingmaterial/confidential-information/confidential-information-entry', query: { type: 'edit', id: row.id } })
      },
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
        const assetAccept = document.getElementById('dataQuery').clientHeight
        let searchBox = document
          .getElementById('dataQuery')
          .getElementsByClassName('search-box')[0].clientHeight
        let pagination = document
          .getElementById('dataQuery')
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
        this.$router.push({ path: '/teachingmaterial/confidential-information/confidential-information-entry', query: { } })
      },
      // 查询数据列表
      getList() {
        this.tableConfig.loading = true;
        getConfidentialityList(
          this.searchConfig.data.data_code,
          this.searchConfig.data.data_name,
          this.searchConfig.data.data_type,
          this.tableConfig.pageNum,
          this.tableConfig.pageSize,
          this.searchConfig.data.secrecy_levelid,
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
  #dataQuery {
    flex: 1;
  }
</style>
