<template>
  <div id="DepreciationWayDetail" ref="DepreciationWayDetail" class="com-detail-wrap">
    <div class="detail-item">
      <div class="detail-head">
        <div class="tit">基本信息</div>
        <div class="btns">
          <el-button class="com-btn" type="info" @click="cancel" plain>返回</el-button>
          <el-button v-if="type === 'add' || type === 'edit'" class="com-btn" type="primary" @click="save" plain>保存</el-button>
        </div>
      </div>
      <div class="detail-content">
        <form-list :disabled="disabled" :datas="formData" :form-config="formConfig" :rules="rules" ref="formList"></form-list>
      </div>
    </div>
  </div>
</template>

<script>
  import FormList from '@/components/form/FormList'
  import { dictMixin } from '../../../mixins/dictMixin';
  import EditTable from '@/components/table/EditTable.vue';
  import { createDepreciationWay, updateDepreciationWay, getDepreciationWayDetail } from './api';

  export default {
    name: 'DepreciationWayDetail',
    components: {
      FormList,
      EditTable
    },
    mixins: [dictMixin],
    data() {
      return {
        listPath: '/teachasset/asset-depreciation/depreciation-way',
        // 页面类型
        type: '',
        ids: '',
        // 基础表单是否禁用
        disabled: false,
        // 基础表单数据
        formData: {
          depreciationName: '',
          depreciationPeriod: '',
          useFlag: 1
        },
        rules: {
          depreciationName: [
            { required: true, message: '该字段必填', trigger: 'blur' }
          ],
          depreciationPeriod: [
            { required: true, message: '该字段必填', trigger: 'change' }
          ]
        },
        // 表格数据
        tableData: [],
        // 表格高度
        tableHeight: 400
      }
    },
    created() {
      // 初始化判断当前页面类型
      this.type = this.$route.query.type || 'add'
      if(this.type !== 'add') {
        this.ids = this.$route.query.id
        this.getData()
      }
    },
    mounted() {},
    methods: {
      getData() {
        getDepreciationWayDetail(this.ids).then(res => {
          this.formData = res.data
        })
      },
      // 保存
      save() {
        this.$refs.formList.validFormList((res) => {
          if(res) {
            let params = {
              depreciationName: this.formData.depreciationName,
              depreciationPeriod: this.formData.depreciationPeriod,
              useFlag: this.formData.useFlag
            }
            // 编辑
            if(this.type === 'edit') {
              params.id = this.ids
              updateDepreciationWay(params).then(res => {
                this.$message(res.msg)
                this.$router.push(this.listPath)
              })
              return
            }
            // 新增
            createDepreciationWay(params).then(res => {
              this.$message(res.msg)
              this.$router.push(this.listPath)
            })
          }
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
                    label: '折旧方法编码',
                    type: 'text',
                    prop: 'depreciationCode',
                    placeholder: '根据编码规则自动生成',
                    disabled: true
                  },
                  {
                    label: '名称',
                    type: 'text',
                    prop: 'depreciationName',
                    placeholder: ''
                  },
                  {
                    label: '拼音码',
                    type: 'text',
                    prop: 'pinyinCode',
                    placeholder: '自动生成',
                    disabled: true
                  },
                  {
                    label: '五笔码',
                    type: 'text',
                    prop: 'wubiCode',
                    placeholder: '自动生成',
                    disabled: true
                  },
                  {
                    label: '折旧年限',
                    type: 'unit',
                    unit: '年',
                    prop: 'depreciationPeriod'
                  },
                  {
                    label: '创建人',
                    type: 'text',
                    prop: 'createBy',
                    placeholder: '',
                    disabled: true,
                    hidden: this.type !== 'detail'
                  },
                  {
                    label: '创建时间',
                    type: 'date',
                    prop: 'createTime',
                    placeholder: '',
                    disabled: true,
                    hidden: this.type !== 'detail'
                  }
                ],
                [
                  {
                    label: '状态',
                    type: 'radio',
                    prop: 'useFlag',
                    options: [
                      {
                        label: '启用',
                        value: 1
                      },
                      {
                        label: '停用',
                        value: 2
                      }
                    ]
                  }
                ]
              ]
            }
          ]
        }
      }
    },
    watch: {
      type() {
        this.disabled = this.type === 'detail'
      }
    }
  }
</script>

<style scoped lang="less">

</style>
