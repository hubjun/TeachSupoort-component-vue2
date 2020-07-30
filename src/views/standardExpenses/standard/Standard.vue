<template>
  <div id="Standard" ref="Standard">
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
        </el-table-column>
      </table-list>
    </div>
    <input @change="ExcelUpload" id="ExcelUpload" style="display: none;" type="file">
  </div>
</template>

<script>
  import searchBar from '@/components/searchBar/searchBar'
  import tableList from '@/components/table'
  import { dictMixin } from '@/mixins/dictMixin'
  import {
    getStandard,
    addExcel,
    getExcelMod,
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
            give_outlay: ['', ''],
            pay_outlay: ['', ''],
            rate: ['', ''],
            fiscal_year: '',
            department: ''
          },
          config: [
            {
              label: '年度',
              prop: 'fiscal_year',
              placeholder: '请选择',
              type: 'year'
            },
            {
              label: '部门',
              prop: 'department',
              placeholder: '请输入资产类型编码/名称/拼音码/五笔码',
              type: 'text'
            },
            {
              label: '下达经费（万元）',
              prop: 'give_outlay',
              placeholder: '请输入资产类型编码/名称/拼音码/五笔码',
              type: 'rangenumber'
            },
            {
              label: '开支经费（万元）',
              prop: 'pay_outlay',
              placeholder: '请输入资产类型编码/名称/拼音码/五笔码',
              type: 'rangenumber'
            },
            {
              label: '开支率',
              prop: 'rate',
              placeholder: '请输入资产类型编码/名称/拼音码/五笔码',
              type: 'rangenumber'
            }
          ]
        },
        btnConfig: [
          {
            label: 'Excel导入模板下载',
            type: 'primary',
            plain: true,
            customClass: '',
            callback: 'ClickExcelMod'
          },
          {
            label: 'Excel导入',
            type: 'primary',
            plain: true,
            customClass: '',
            callback: 'ClickUploadExcel'
          },
          {
            label: 'Excel导出',
            type: 'primary',
            plain: true,
            customClass: '',
            callback: 'ClickGetExcel'
          },
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
              prop: 'fiscalYear',
              label: '年度',
              sortable: false
            },
            {
              prop: 'department',
              label: '部门',
              sortable: true
            },
            {
              prop: 'giveOutlay',
              label: '下达经费（万元）',
              sortable: false
            },
            {
              prop: 'payOutlay',
              label: '开支经费（万元）',
              sortable: false
            },
            {
              prop: 'rate',
              label: '开支率',
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
      // 上传表格
      ExcelUpload() {
        let formData = new FormData();
        formData.append('file', document.getElementById('ExcelUpload').files[0]);
        addExcel(formData).then(res => {
          if(!res.status) {
            if(res.data.indexOf('excelType') !== -1 ) {
              this.$message.error('不是Excel文件');
            }else {
              this.$message.error('表格导入失败');
            }
          }else{
            this.$message.success('表格导入成功');
            this.getList();
          }
        })
      },
      // 点击导入表格
      ClickUploadExcel() {
        document.getElementById('ExcelUpload').dispatchEvent(new MouseEvent('click'));
      },
      // 点击模板下载
      ClickExcelMod() {
        let xmlResquest = new XMLHttpRequest();
        xmlResquest.open('GET', getExcelMod(), true);
        xmlResquest.setRequestHeader('Content-type', 'application/vnd.ms-excel');
        xmlResquest.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem('TOKEN'));
        xmlResquest.responseType = 'blob';
        xmlResquest.onload = function (oEvent) {
          let content = xmlResquest.response;
          let elink = document.createElement('a');
          elink.download = '标准经费管理导入模板.xlsx';
          elink.style.display = 'none';
          let blob = new Blob([content]);
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          document.body.removeChild(elink);
        };
        xmlResquest.send();
      },
      // 点击导出表格
      ClickGetExcel() {
        let ids = [];
        this.tableConfig.data.forEach(r => {
          ids.push(r.id);
        })
        let xmlResquest = new XMLHttpRequest();
        xmlResquest.open('GET', getExcel(ids), true);
        xmlResquest.setRequestHeader('Content-type', 'application/vnd.ms-excel');
        xmlResquest.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem('TOKEN'));
        xmlResquest.responseType = 'blob';
        xmlResquest.onload = function (oEvent) {
          let content = xmlResquest.response;
          let elink = document.createElement('a');
          elink.download = '标准经费管理.xlsx';
          elink.style.display = 'none';
          let blob = new Blob([content]);
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          document.body.removeChild(elink);
        };
        xmlResquest.send();
      },
      // 双击表格某列
      dblclick(row, column, cell, event) {
        localStorage.setItem('Standard', JSON.stringify(row));
        this.$router.push({ path: '/standardexpenses/standard/Standard-detail', query: { type: 'edit' } })
      },
      // 计算表格高度
      getTableHeight() {
        const assetAccept = document.getElementById('Standard').clientHeight
        let searchBox = document
          .getElementById('Standard')
          .getElementsByClassName('search-box')[0].clientHeight
        let pagination = document
          .getElementById('Standard')
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
        this.$router.push({ path: '/standardexpenses/standard/Standard-detail', query: { type: 'add' } })
      },

      // 查询数据列表
      getList() {
        if(this.searchConfig.data.fiscal_year === null) {
          this.searchConfig.data.fiscal_year = ''
        }
        this.tableConfig.loading = true;
        getStandard(
          this.searchConfig.data.department,
          this.searchConfig.data.fiscal_year,
          this.searchConfig.data.give_outlay[1] !== '' ? this.searchConfig.data.give_outlay[1] * 10000 : '',
          this.searchConfig.data.give_outlay[0] !== '' ? this.searchConfig.data.give_outlay[0] * 10000 : '',
          this.searchConfig.data.pay_outlay[1] !== '' ? this.searchConfig.data.pay_outlay[1] * 10000 : '',
          this.searchConfig.data.pay_outlay[0] !== '' ? this.searchConfig.data.pay_outlay[0] * 10000 : '',
          this.searchConfig.data.rate[1],
          this.searchConfig.data.rate[0],
          this.tableConfig.pageNum,
          this.tableConfig.pageSize
        ).then((Result) => {
          this.tableConfig.total = Result.data.total;
          this.tableConfig.data = Result.data.list;
          this.tableConfig.data.forEach(res => {
            res.rate = res.rate + '%'
            res.giveOutlay = parseInt((res.giveOutlay / 10000) * 100) / 100
            res.payOutlay = parseInt((res.payOutlay / 10000) * 100) / 100
          })
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
  #Standard {
    flex: 1;
  }
</style>
