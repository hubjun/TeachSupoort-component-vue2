<template>
  <div id="AssetScrapRegister" ref="AssetScrapRegister">
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
            <div v-if="item.prop === 'status'">
              <div v-if="scope.row[item.prop] === 1" class="com-status-info">
                <span class="iconfont">&#xe626;</span>待确认
              </div>
              <div v-else-if="scope.row[item.prop] === 2" class="com-status-success">
                <span class="iconfont">&#xe627;</span>已确认
              </div>
            </div>
            <div v-else>{{scope.row[item.prop]}}</div>
          </template>
        </el-table-column>
<!--        <el-table-column-->
<!--            label="操作"-->
<!--            width="150"-->
<!--            align="center"-->
<!--            fixed="right"-->
<!--        >-->
<!--          <template slot-scope="scope">-->
<!--            <div>-->
<!--              <el-button class="font-color-blue" type="text" @click.stop="edit(scope.row)">编辑</el-button>-->
<!--              <el-button class="font-color-red" type="text" @click.stop="del(scope.row)">删除</el-button>-->
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
  import { getScrapRegisterList } from './api';

  export default {
    components: { searchBar, tableList },
    data() {
      return {
        detailPath: '/teachasset/asset-handle/asset-scrap-register-detail',
        // 搜索按钮加载
        isLoading: false,
        // scrapCodeArr: [],
        // 搜索栏配置
        searchConfig: {
          data: {
            scrapCode: '',
            time: [],
            status: 1
          },
          config: [
            {
              label: '单据编码',
              labelWidth: '80px',
              prop: 'scrapCode',
              type: 'text',
              placeholder: '请输入单据编号'
            },
            {
              label: '登记日期',
              prop: 'time',
              labelWidth: '80px',
              type: 'daterange'
            },
            {
              label: '计划状态',
              prop: 'status',
              type: 'select',
              labelWidth: '80px',
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
                  label: '已确认',
                  value: 2
                }
              ]
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
          data: [
            {
              a: 1
            }
          ],
          config: [
            {
              prop: 'scrapCode',
              label: '单据编码',
              sortable: false
            },
            {
              prop: 'names',
              label: '资产名称'
            },
            {
              prop: 'scrapDepa',
              label: '资产报废单位',
              sortable: false
            },
            {
              prop: 'registerName',
              label: '登记人',
              sortable: false
            },
            {
              prop: 'status',
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
        const assetAccept = document.getElementById('AssetScrapRegister').clientHeight
        let searchBox = document
          .getElementById('AssetScrapRegister')
          .getElementsByClassName('search-box')[0].clientHeight
        let pagination = document
          .getElementById('AssetScrapRegister')
          .getElementsByClassName('pagination')[0].clientHeight
        this.tableConfig.tableHeight =
          assetAccept - searchBox - pagination - 40 - 10 // 40为table-box的内边距，两个20位margin-bottom
      },
      // 获取表格数据
      getList() {
        let params = {
          scrap_code: this.searchConfig.data.scrapCode,
          status: this.searchConfig.data.status,
          startTime: '',
          endTime: '',
          contact: this.searchConfig.data.contact,
          pageSize: this.tableConfig.pageSize,
          pageNum: this.tableConfig.currentPage
        }
        if(this.searchConfig.data.time) {
          params.startTime = this.searchConfig.data.time[0]
          params.endTime = this.searchConfig.data.time[1]
        }
        getScrapRegisterList(params).then(res => {
          this.tableConfig.data = res.data.list
          this.tableConfig.total = res.data.total
          this.isLoading = false
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
      // // 编辑
      // edit(row) {
      //   this.$router.push({
      //     path: this.detailPath,
      //     query: {
      //       type: 'edit',
      //       id: row.id
      //     }
      //   })
      // },
      // // 删除
      // del(row) {
      //   console.log(row, 'delete');
      // },
      // 双击事件
      dblclick(row) {
        localStorage.setItem('AssetScrapRegister', JSON.stringify(row))
        this.$router.push({
          path: this.detailPath,
          query: {
            type: 'detail',
            id: row.id
          }
        })
      }
    }
  }
</script>

<style lang='less'>
  @import '../../../assets/css/variable.less';
  #AssetScrapRegister {
    flex: 1;
  }
</style>
