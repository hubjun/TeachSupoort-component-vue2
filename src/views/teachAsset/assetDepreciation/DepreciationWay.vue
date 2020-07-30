<template>
  <div id="DepreciationWay" ref="DepreciationWay">
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
        >
          <template slot-scope="scope">
            <div v-if="item.prop === 'useFlag'">
              <span v-if="scope.row[item.prop] === 1" class="font-color-green">启用</span>
              <span v-if="scope.row[item.prop] === 2" class="font-color-red">停用</span>
            </div>
            <div v-else>{{scope.row[item.prop]}}</div>
          </template>
        </el-table-column>
        <el-table-column
            label="操作"
            width="200"
            align="center"
            fixed="right"
        >
          <template slot-scope="scope">
            <div>
<!--              <el-button class="font-color-blue" type="text" @click.stop="edit(scope.row)">编辑</el-button>-->
              <el-button :class="`${scope.row.useFlag === 2 ? 'font-color-blue' : 'font-color-red'}`" type="text" @click.stop="updateStatus(scope.row)">{{ scope.row.useFlag === 2 ? '启用' : '停用' }}</el-button>
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
  import { getDepreciationWayList, batchUpdateDepreciationWay } from './api';

  export default {
    components: { searchBar, tableList },
    data() {
      return {
        detailPath: '/teachasset/asset-depreciation/depreciation-way-detail',
        // 搜索按钮加载
        isLoading: false,
        // 搜索栏配置
        searchConfig: {
          data: {
            useFlag: '',
            depreciationName: ''
          },
          config: [
            {
              label: '状态',
              labelWidth: '80px',
              prop: 'useFlag',
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
              prop: 'depreciationName',
              labelWidth: '0px',
              type: 'text',
              placeholder: '输入折旧方法名称'
            }
          ]
        },
        // 按钮组配置
        btnConfig: [
          // {
          //   label: '新增',
          //   type: 'primary',
          //   plain: true,
          //   customClass: '',
          //   callback: 'addData'
          // }
        ],
        // 表格配置
        tableConfig: {
          data: [],
          config: [
            {
              prop: 'depreciationCode',
              label: '折旧方法编码',
              sortable: false
            },
            {
              prop: 'depreciationName',
              label: '折旧方法名称'
            },
            {
              prop: 'useFlag',
              label: '状态',
              sortable: false
            },
            {
              prop: 'pinyinCode',
              label: '拼音码',
              sortable: false
            },
            {
              prop: 'wubiCode',
              label: '五笔码',
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
        const assetAccept = document.getElementById('DepreciationWay').clientHeight
        let searchBox = document
          .getElementById('DepreciationWay')
          .getElementsByClassName('search-box')[0].clientHeight
        let pagination = document
          .getElementById('DepreciationWay')
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
          depreciationName: this.searchConfig.data.depreciationName,
          useFlag: this.searchConfig.data.useFlag.toString(),
          pageNum: this.tableConfig.currentPage,
          pageSize: this.tableConfig.pageSize
        }
        getDepreciationWayList(params).then(res => {
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
      updateStatus(row) {
        let params = {
          ids: [{
            id: row.id,
            useFlag: row.useFlag === 1 ? 2 : 1
          }]
        }
        batchUpdateDepreciationWay(params).then(res => {
          this.$success('更新')
          this.getList()
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
  #DepreciationWay {
    flex: 1;
  }
</style>
