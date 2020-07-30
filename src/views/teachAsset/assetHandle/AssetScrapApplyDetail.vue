<template>
  <div id="AssetScrapApplyDetail" ref="AssetScrapApplyDetail" class="com-detail-wrap">
    <div class="detail-item">
      <div class="detail-head">
        <div class="tit">基本信息</div>
        <div class="btns">
          <el-button class="com-btn" type="info" @click="cancel" plain>返回</el-button>
          <el-button
            v-if="type !== 'detail' && (formData.scrapStatus === 1 || formData.scrapStatus === 3)"
            class="com-btn"
            type="primary"
            @click="save"
            plain
          >保存</el-button>
          <el-button
            v-if="formData.scrapStatus !== 2 && formData.scrapStatus !== 4"
            class="com-btn"
            type="primary"
            @click="toApply"
            plain
          >申报</el-button>
          <el-button v-if="type !== 'add'" class="com-btn" type="success" plain>导出</el-button>
        </div>
      </div>
      <div class="detail-content">
        <form-list ref="formList" :rules='listRules' :disabled="disabled" :datas="formData" :form-config="formConfig"></form-list>
      </div>
    </div>
  </div>
</template>

<script>
import FormList from '@/components/form/FormList'
import { dictMixin } from '../../../mixins/dictMixin'
import EditTable from '@/components/table/EditTable.vue'
import { createScrap, applyScrap } from './api'

export default {
  name: 'AssetScrapApplyDetail',
  components: {
    FormList,
    EditTable
  },
  mixins: [dictMixin],
  data() {
    let validPhone = (rule, value, callback) => {
      let PhoneReg = /^1(3|4|5|7|8)\d{9}$/
      let IFlag = PhoneReg.test(value)
      if (!IFlag) {
        callback(new Error('请输入有效合法的手机号码！'))
      } else {
        callback()
      }
    }
    return {
      listPath: '/teachasset/asset-handle/asset-scrap-apply',
      // 页面类型
      type: '',
      // 基础表单是否禁用
      disabled: false,
      // 基础表单数据
      formData: {
        contact: '',
        contactPhone: '',
        createTime: '',
        remark: '',
        scrapCode: '',
        scrapDate: '',
        scrapDepaName: '',
        scrapIdea: '',
        scrapName: '',
        scrapPrice: 0,
        scrapType: 1,
        scrapStatus: 1
      },
      // 表格数据
      tableData: [],
      // 表格高度
      tableHeight: 400,
      listRules: {
        contactPhone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { validator: validPhone, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getDepartList().then({})
    // 初始化判断当前页面类型
    this.type = this.$route.query.type || 'add'
    if (this.type !== 'add') {
      this.ids = this.$route.query.id
      this.formData = JSON.parse(localStorage.getItem('AssetScrapApply'))
      this.disabled = this.formData.scrapStatus === 2 || this.formData.scrapStatus === 4
    }
  },
  mounted() {
    if (this.type === 'add') {
      let now = new Date()
      let yyyy = now.getFullYear()
      let mm =
        now.getMonth() < 9 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1
      let dd = now.getDate() < 10 ? '0' + now.getDate() : now.getDate()
      this.formData.scrapDate = `${yyyy}-${mm}-${dd}`
    }
  },
  methods: {
    // 保存
    save() {
      this.$refs.formList.validFormList(res => {
        if (res) {
          let params = {
            scrapName: this.formData.scrapName,
            scrapPrice: this.formData.scrapPrice,
            scrapDepaId: this.formData.scrapDepaId,
            scrapDepaName: this.mxDepartlist.filter(
              item => item.value === this.formData.scrapDepaId
            )[0]['label'],
            contact: this.formData.contact,
            contactPhone: this.formData.contactPhone,
            scrapType: this.formData.scrapType,
            scrapDate:
              this.formData.scrapDate.length === 19
                ? this.formData.scrapDate
                : this.formData.scrapDate.length
                ? this.formData.scrapDate + ' 00:00:00'
                : '',
            scrapIdea: this.formData.scrapIdea,
            remark: this.formData.remark,
            id: this.$route.query.id ? this.$route.query.id : null
          }
            // 新增
            createScrap(params).then(res => {
              if (res.status) {
                this.$success('新增报废申请')
                this.$router.push(this.listPath)
              }
            })
        }
      })
    },
    // 通过
    toApply() {
      this.$refs.formList.validFormList(res => {
        if (res) {
          let params = {
            scrapName: this.formData.scrapName,
            scrapPrice: this.formData.scrapPrice,
            scrapDepaId: this.formData.scrapDepaId,
            scrapDepaName: this.mxDepartlist.filter(
              item => item.value === this.formData.scrapDepaId
            )[0]['label'],
            contact: this.formData.contact,
            contactPhone: this.formData.contactPhone,
            scrapType: this.formData.scrapType,
            scrapDate:
              this.formData.scrapDate.length === 19
                ? this.formData.scrapDate
                : this.formData.scrapDate.length
                ? this.formData.scrapDate + ' 00:00:00'
                : '',
            scrapIdea: this.formData.scrapIdea,
            remark: this.formData.remark,
            id: this.$route.query.id ? this.$route.query.id : null,
            scrapStatus: 2
          }
            // 新增
            createScrap(params).then(res => {
              if (res.status) {
                this.$success('报废申请申报')
                this.$router.push(this.listPath)
              }
            })
        }
      })
      // applyScrap(this.ids).then(res => {
      //   this.$success('申报')
      //   this.$router.push(this.listPath)
      // })
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
                  placeholder: '根据编码规则自动生成',
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
                  type: 'unit',
                  unit: '元',
                  prop: 'scrapPrice',
                  placeholder: '',
                  disabled: this.type === 'detail'
                },
                {
                  label: '资产报废单位',
                  type: 'select',
                  prop: 'scrapDepaId',
                  placeholder: '',
                  disabled: this.type === 'detail',
                  options: this.mxDepartlist
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
