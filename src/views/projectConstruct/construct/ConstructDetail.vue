<template>
  <div id="ConstructDetail" ref="ConstructDetail" class="com-detail-wrap">
    <div class="detail-item">
      <div class="detail-head">
        <div class="tit">基本信息</div>
        <div class="btns">
          <el-button class="com-btn" type="info" @click="cancel" plain>返回</el-button>
          <el-button v-show="!detailHidden" class="com-btn" type="primary" @click="save" plain>保存</el-button>
        </div>
      </div>
      <div class="detail-content">
        <form-list :disabled="disabled" :datas="formData" :form-config="formConfig"></form-list>
      </div>
    </div>
  </div>
</template>

<script>
  import FormList from '@/components/form/FormList'
  import { dictMixin } from '../../../mixins/dictMixin';
  import EditTable from '@/components/table/EditTable.vue';
  import { createConstructInfo, getConstructInfo } from '../api'

  export default {
    name: 'ConstructDetail',
    components: {
      FormList,
      EditTable
    },
    mixins: [dictMixin],
    data() {
      return {
        listPath: '/projectconstruct/construct/construct',
        // 页面类型
        type: '',
        // 基础表单是否禁用
        disabled: false,
        // 基础表单数据
        formData: {
          projectSource: '',
          projectType: '',
          projectName: '',
          budgetAmount: '',
          budgetYear: '',
          constructionCompany: '',
          supervisor: '',
          contractor: '',
          telephoneNumber: '',
          projectScope: [1],
          constructionContent: ''
        },
        // 表格数据
        tableData: [],
        // 表格高度
        tableHeight: 400,
        detailHidden: false
      }
    },
    created() {
      // 初始化判断当前页面类型
      this.type = this.$route.query.type || 'add'
    },
    mounted() {
      if (this.$route.query.type === 'detail') {
        let queryId = this.$route.query.id;
        getConstructInfo(queryId).then(res => {
          if (res.status) {
            this.formData = res.data;
            let str_arr = res.data.projectScope.split(',')
            this.formData.projectScope = str_arr.map(item => {
              return +item
            })
          }
        }).catch(() => {
          this.$message.error(res.msg)
        })
      }
    },
    methods: {
      // 获取表单数据
      getFormData() {
        return this.formData
      },
      // 获取表格数据
      getTableData() {
        return this.tableData
      },
      // 保存
      save() {
        let params = {
          projectSource: this.formData.projectSource,
          projectType: this.formData.projectType,
          projectName: this.formData.projectName,
          budgetAmount: this.formData.budgetAmount,
          budgetYear: this.formData.budgetYear,
          constructionCompany: this.formData.constructionCompany,
          supervisor: this.formData.supervisor,
          contractor: this.formData.contractor,
          telephoneNumber: this.formData.telephoneNumber,
          projectScope: this.formData.projectScope.join(),
          constructionContent: this.formData.constructionContent
        }
        createConstructInfo(params).then(res => {
          if (res.status) {
            this.$message({message: '保存成功', type: 'success'})
            this.$router.push(this.listPath)
          } 
        }).catch(() => {
          this.$message.error(res.msg)
        })
      },
      // 取消，返回列表
      cancel() {
        this.$router.push(this.listPath)
      },
      // 表格新增
      tableAdd() {
        this.tableData.push({
          bh: '',
          mc: '',
          ggxh: '',
          unit: ''
        })
        // 延时滚动到底部。
        setTimeout(() => {
          document.querySelector('.detail-content .el-table__body-wrapper').scrollTop = document.querySelector('.detail-content .el-table__body-wrapper').scrollHeight
        }, 50)
      },
      // 表格删除
      tableDel(index) {
        this.tableData.splice(index, 1)
      }
      // getConstructPlanInfo(params) {
        
      // }
    },
    computed: {
      // 基础表单配置
      formConfig() {
        return {
          labelWidth: '100px',
          config: [
            {
              label: ' 基本信息',
              props: [
                [
                  {
                    label: '项目来源',
                    type: 'text',
                    prop: 'projectSource',
                    placeholder: ''
                  },
                  {
                    label: '项目类型',
                    type: 'text',
                    prop: 'projectType',
                    placeholder: ''
                  },
                  {
                    label: '项目名称',
                    type: 'text',
                    prop: 'projectName',
                    placeholder: ''
                  },
                  {
                    label: '预算金额',
                    type: 'unit',
                    unit: '万元',
                    prop: 'budgetAmount',
                    placeholder: ''
                  },
                  {
                    label: '预算年度',
                    type: 'text',
                    prop: 'budgetYear',
                    placeholder: ''
                  },
                  {
                    label: '建设部门',
                    type: 'text',
                    prop: 'constructionCompany',
                    placeholder: ''
                  },
                  {
                    label: '项目主管领导',
                    type: 'text',
                    prop: 'supervisor',
                    placeholder: ''
                  },
                  {
                    label: '承办人',
                    type: 'text',
                    prop: 'contractor',
                    placeholder: ''
                  },
                  {
                    label: '联系电话',
                    type: 'text',
                    prop: 'telephoneNumber',
                    placeholder: ''
                  },
                  {
                    label: '项目建设',
                    type: 'checkbox',
                    span: 12,
                    prop: 'projectScope',
                    options: [
                      {
                        label: '硬件/设备购置',
                        value: 1
                      },
                      {
                        label: '软件系统开发',
                        value: 2
                      },
                      {
                        label: '场地配套建设',
                        value: 3
                      }
                    ],
                    placeholder: ''
                  }
                ],
                [
                  {
                    label: '建设内容',
                    type: 'textarea',
                    prop: 'constructionContent',
                    span: 12,
                    placeholder: ''
                  }
                ]
              ]
            }
          ]
        }
      },
      // 表格配置
      tableConfig() {
        return [
          {
            prop: 'bh',
            label: '资产编号',
            editable: true // 是否可编辑
          },
          {
            prop: 'mc',
            label: '资产名称',
            editable: true
          },
          {
            prop: 'ggxh',
            label: '规格型号',
            editable: true
          },
          {
            prop: 'unit',
            label: '计量单位',
            editable: true
          },
          {
            prop: 'unit',
            label: '资产类型',
            editable: true
          }
        ]
      }
    },
    watch: {
      type() {
        this.disabled = this.type === 'detail'
        this.detailHidden = this.type === 'detail'
        // if (this.type === 'detail') {
        //   this.disabled = true;
        //   let queryId = this.$route.query.id;
        //   let params = {
        //     id: queryId
        //   }
        //   this.getConstructPlanInfo(params);
        // }
      }
    }
  }
</script>

<style scoped lang="less">

</style>
