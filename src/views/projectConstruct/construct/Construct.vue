<template>
  <div id="Construct" ref="Construct">
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
            :width="item.width"
            align="center"
            :sortable="item.sortable"
            :show-overflow-tooltip="!item.hideOverflow"
        >
          <template slot="header" slot-scope="scope">
            <div v-if="item.remark && item.remark !== ''">
              <el-tooltip content="Top center" placement="top">
                <div slot="content">{{item.remark}}</div>
                <div class="tool-tip-header">{{item.label}} <span class="tooltip-icon">?</span></div>
              </el-tooltip>
            </div>
            <div v-else>{{item.label}}</div>
          </template>

          <template slot-scope="scope">
            <div v-if="item.prop === 'projectName'">
              <el-popover
                  placement="top-start"
                  title="项目进展"
                  width="600"
                  trigger="hover">
                  <span>{{scope.row.constructionContent}}</span>
                <div slot="reference" style="cursor: pointer;">
                  <span class="font-color-green">{{scope.row[item.prop]}}</span>
                </div>
              </el-popover>
            </div>
            <div v-else-if="item.isIcon">
              <div v-if="scope.row[item.prop] == '1'" class="com-status-success">
                <span class="iconfont">&#xe672;</span>
              </div>
              <div v-else class="com-status-normal">
                <span class="iconfont">&#xe673;</span>
              </div>
            </div>
            <div v-else>{{scope.row[item.prop]}}</div>
          </template>
          
          <el-table-column v-if="item.children && item.children.length" v-for="(child, index2) in item.children" :key="index2" :label="child.label" :prop="child.prop" :width="child.width" align="center">
            <div v-if="child.projectScope == '1' || child.projectScope == '2' || child.projectScope == '3'"> 
              <div class="com-status-success">
                  <span class="iconfont">&#xe672;</span>
                </div>
            </div>
            <div v-if="child.projectAcceptance === 1 || child.projectAcceptance === 2 || child.projectAcceptance === 3"> 
              <div class="com-status-success">
                  <span class="iconfont">&#xe672;</span>
                </div>
            </div>
            <div v-else>
              <div class="com-status-normal">
                  <span class="iconfont">&#xe673;</span>
              </div>
            </div>      
          </el-table-column>
        </el-table-column>

        <el-table-column
            label="操作"
            width="150"
            align="center"
            fixed="right"
        >
          <template slot-scope="scope">
            <div>
              <el-button class="font-color-blue" type="text" @click.stop="edit(scope.row)">编辑</el-button>
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
  import {getConstructList} from '../api'

  export default {
    components: { searchBar, tableList },
    data() {
      return {
        detailPath: '/projectconstruct/construct/construct-detail',
        // 搜索按钮加载
        isLoading: false,
        // 搜索栏配置
        searchConfig: {
          data: {
            projectSource: '',
            projectName: '',
            budgetAmount: '',
            constructionCompany: '',
            supervisor: '',
            contractor: ''
          },
          config: [
            {
              label: '项目来源',
              labelWidth: '90px',
              prop: 'projectSource',
              type: 'text',
              placeholder: '请输入项目来源'
            },
            {
              label: '项目名称',
              prop: 'projectName',
              labelWidth: '90px',
              type: 'text',
              placeholder: '请输入项目名称'
            },
            {
              label: '项目金额(小于)',
              prop: 'budgetAmount',
              labelWidth: '115px',
              type: 'text',
              placeholder: '请输入项目金额'
            },
            {
              label: '主管部门',
              labelWidth: '90px',
              prop: 'constructionCompany',
              type: 'text',
              placeholder: '请输入主管部门'
            },
            {
              label: '主责人',
              labelWidth: '90px',
              prop: 'supervisor',
              type: 'text',
              placeholder: '请输入主责人'
            },
            {
              label: '机关联系人',
              labelWidth: '90px',
              prop: 'contractor',
              type: 'text',
              placeholder: '请输入机关联系人'
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
          popContent: '',
          data: [],
          config: [
            {
              prop: 'projectName',
              label: '项目名称',
              hideOverflow: true,
              width: 200,
              sortable: false
            },
            {
              prop: 'budgetAmount',
              label: '预算(万元)',
              width: 100
            },
            {
              prop: 'constructionUnit',
              label: '主责部门',
              sortable: false
            },
            // {
            //   prop: 'd',
            //   label: '单位开工率',
            //   sortable: false,
            //   width: 100
            // },
            {
              prop: 'supervisor',
              label: '主责人',
              sortable: false
            },
            {
              prop: 'contractor',
              label: '机关联系人',
              sortable: false,
              width: 120
            },
            {
              prop: 'status1',
              label: '立项论证',
              sortable: false,
              isIcon: true
            },
            {
              prop: 'status2',
              label: '采购招标',
              sortable: false,
              isIcon: true
            },
            {
              prop: 'status3',
              label: '合同签订',
              sortable: false,
              isIcon: true
            },
            {
              label: '项目建设',
              sortable: false,
              children: [
                {
                  label: '硬件设备购置',
                  prop: 'projectScope',
                  width: 120
                },
                {
                  label: '软件系统开发',
                  prop: 'projectScope',
                  width: 120
                },
                {
                  label: '场地配套建设',
                  prop: 'projectScope',
                  width: 120
                }
              ]
            },
            {
              label: '项目验收',
              sortable: false,
              children: [
                {
                  label: '产品进场建设',
                  prop: 'projectAcceptance',
                  width: 120
                },
                {
                  label: '项目组验收',
                  prop: 'projectAcceptance',
                  width: 120
                },
                {
                  label: '专家验收',
                  prop: 'projectAcceptance'
                }
              ]
            },
            {
              label: '采购组织单位',
              prop: 'purchasingOrganizationUnit',
              remark: '本级/采购室/代理机构/采购站/地方平台',
              width: 120
            },
            {
              label: '承建(中标)单位',
              prop: 'constructionUnit',
              width: 120
            },
            {
              label: '计划竣工时间',
              prop: 'plannedCompletionTime',
              width: 120
            },
            {
              label: '项目结算',
              prop: 'xmjs',
              remark: '服务、工程、物资',
              width: 120
            }
          ],
          tableHeight: 0,
          currentPage: 1,
          pageSize: 10,
          pageNum: 1,
          total: 1,
          selectData: []
        }
      }
    },
    created() {
      this.getList();
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
        const assetAccept = document.getElementById('Construct').clientHeight
        let searchBox = document
          .getElementById('Construct')
          .getElementsByClassName('search-box')[0].clientHeight
        let pagination = document
          .getElementById('Construct')
          .getElementsByClassName('pagination')[0].clientHeight
        this.tableConfig.tableHeight =
          assetAccept - searchBox - pagination - 40 - 10 // 40为table-box的内边距，两个20位margin-bottom
      },
      // 搜索回调
      handleSearch() {
        // console.log(this.isLoading)
        this.tableConfig.currentPage = 1;
        this.getList();
        this.isLoading = true
        setTimeout(() => {
          this.isLoading = false
        }, 2000)
      },
      // 重置回调
      handleReset() {
        this.getList();
      },
      // 按钮组回调
      handleBtnClick(res) {
        this[res] && this[res]()
      },
      // 获取表格数据
      getList() {
        let params = {
          projectSource: this.searchConfig.data.projectSource,
          projectName: this.searchConfig.data.projectName,
          budgetAmount: this.searchConfig.data.budgetAmount,
          constructionCompany: this.searchConfig.data.constructionCompany,
          supervisor: this.searchConfig.data.supervisor,
          contractor: this.searchConfig.data.contractor,
          pageSize: this.tableConfig.pageSize,
          pageNum: this.tableConfig.pageNum
        };
        getConstructList(params).then(res => {
          this.tableConfig.data = res.data.records
          this.tableConfig.total = res.data.total
          // this.tableConfig.popContent = res.data.records
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
      // 双击事件
      dblclick(row) {
        this.$router.push({
          path: this.detailPath,
          query: {
            type: 'detail',
            id: row.id
          }
        })
      },
      edit(row) {
        this.$router.push({
          path: '/projectconstruct/construct/construct-edit-detail',
          query: {
            type: 'edit',
            eid: row.id,
            txtContent: row.constructionContent
          }
        })
      },
      // 新增
      addData() {
        this.$router.push({
          path: this.$route.path + '-detail',
          query: {
            type: 'add'
          }
        })
      }
    }
  }
</script>

<style lang='less'>
  @import '../../../assets/css/variable.less';
  #Construct {
    flex: 1;
  }
  .tool-tip-header{
    white-space: nowrap;
     .tooltip-icon{
       display: inline-block;
       width: 12px;
       height: 12px;
       border-radius: 50%;
       border: 1px solid rgba(153,153,153,1);
       text-align: center;
       line-height: 12px;
       color: #999;
       font-size: 12px;
     }
  }
</style>
