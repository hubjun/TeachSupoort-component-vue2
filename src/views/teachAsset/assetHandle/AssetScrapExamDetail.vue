<template>
  <div id="AssetScrapExamDetail" ref="AssetScrapExamDetail" class="com-detail-wrap">
    <div class="detail-item">
      <div class="detail-head">
        <div class="tit">基本信息</div>
        <div class="btns">
          <el-button class="com-btn" type="info" @click="cancel" plain>返回</el-button>
          <el-button class="com-btn" v-if="formData.scrapStatus === 2" type="primary" @click="toConfirm" plain>审核</el-button>
          <el-button class="com-btn" v-if="formData.scrapStatus === 2" type="danger" @click="toReject" plain>驳回</el-button>
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
  import { confirmScrap, rejectScrap } from './api';

  export default {
    name: 'AssetScrapExamDetail',
    components: {
      FormList,
      EditTable
    },
    mixins: [dictMixin],
    data() {
      return {
        listPath: '/teachasset/asset-handle/asset-scrap-exam',
        // 页面类型
        type: '',
        // 基础表单是否禁用
        disabled: false,
        // 基础表单数据
        formData: {},
        // 表格数据
        tableData: [],
        // 表格高度
        tableHeight: 400
      }
    },
    created() {
      // 初始化判断当前页面类型
      this.type = this.$route.query.type || 'add'
      this.formData = JSON.parse(localStorage.getItem('AssetScrapExam'))
    },
    mounted() {},
    methods: {
      toConfirm() {
        confirmScrap(this.formData).then(res => {
          this.$success('审核')
          this.$router.push(this.listPath)
        })
      },
      toReject() {
        rejectScrap(this.formData).then(res => {
          this.$success('驳回')
          this.$router.push(this.listPath)
        })
      },
      // 取消，返回列表
      cancel() {
        this.$router.push(this.listPath)
      }
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
                    label: '单据编码',
                    type: 'text',
                    prop: 'scrapCode',
                    placeholder: '',
                    disabled: true
                  },
                  {
                    label: '项目名称',
                    type: 'text',
                    prop: 'scrapName',
                    placeholder: '',
                    disabled: this.type === 'detail'
                  },
                  {
                    label: '报废金额',
                    type: 'text',
                    prop: 'scrapPrice',
                    placeholder: '',
                    disabled: this.type === 'detail'
                  },
                  {
                    label: '资产报废单位',
                    type: 'text',
                    prop: 'scrapDepaName',
                    placeholder: '',
                    disabled: this.type === 'detail'
                  },
                  {
                    label: '联系人',
                    type: 'text',
                    prop: 'contact',
                    placeholder: '',
                    disabled: this.type === 'detail'
                  },
                  {
                    label: '联系电话',
                    type: 'text',
                    prop: 'contactPhone',
                    placeholder: '',
                    disabled: this.type === 'detail'
                  },
                  {
                    label: '项目类型',
                    type: 'select',
                    prop: 'scrapType',
                    placeholder: '请选择',
                    disabled: this.type === 'detail',
                    options: [
                      {
                        label: '教学类',
                        value: 1
                      },
                      {
                        label: '科研类',
                        value: 2
                      },
                      {
                        label: '后勤类',
                        value: 3
                      }
                    ]
                  },
                  {
                    label: '申请日期',
                    type: 'date',
                    prop: 'scrapDate',
                    placeholder: '',
                    disabled: this.type === 'detail'
                  },
                  {
                    label: '计划状态',
                    type: 'select',
                    prop: 'scrapStatus',
                    disabled: true,
                    options: [
                      {
                        label: '待申报',
                        value: 1
                      },
                      {
                        label: '待审核',
                        value: 2
                      },
                      {
                        label: '已驳回',
                        value: 3
                      },
                      {
                        label: '已审核',
                        value: 4
                      }
                    ]
                  }
                ],
                [
                  {
                    label: '单位意见',
                    type: 'textarea',
                    prop: 'scrapIdea',
                    span: 12,
                    placeholder: '',
                    disabled: false
                  },
                  {
                    label: '备注',
                    type: 'textarea',
                    prop: 'remark',
                    span: 12,
                    placeholder: '',
                    disabled: false
                  }
                ]
              ]
            }
          ]
        }
      }
    }
  }
</script>

<style scoped lang="less">

</style>
