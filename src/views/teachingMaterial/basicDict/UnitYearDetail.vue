<template>
  <div id="AssetTypeDetail" ref="AssetTypeDetail" class="com-detail-wrap">
    <div class="detail-item">
      <div class="detail-head">
        <div class="tit">课程字典信息</div>
        <div class="btns">
          <el-button class="com-btn" type="info" @click="cancel" plain>返回</el-button>
          <el-button v-show="!disabled" class="com-btn" type="primary" @click="save" plain>保存</el-button>
        </div>
      </div>
      <div class="detail-content">
        <form-list
          :disabled="disabled"
          :datas="formData"
          ref="formlist"
          :form-config="formConfig"
          @handle-btn-click="handleBtnClick"
        ></form-list>
      </div>
    </div>
  </div>
</template>

<script>
import { getDictionaryId, addDictionary, editDictionary } from './api'
import FormList from '@/components/form/FormList'
import { dictMixin } from '../../../mixins/dictMixin'

export default {
  components: { FormList },
  mixins: [dictMixin],
  data() {
    return {
      type: '',
      disabled: false,
      basicType: 'JB02XNXN',
      formData: {
      basicName: '',
        note: '',
        basicCode: '',
        pinyinCode: '',
        fiveStrokeCode: '',
        updateBy: '',
        createBy: '',
        disable: false,
        id: ''
      }
    }
  },
  computed: {
    formConfig() {
      return {
        labelWidth: '100px',
        config: [
          {
            // label: ' 基本信息',
            props: [
              [
                {
                  label: '课程编码',
                  type: 'text',
                  prop: 'basicCode',
                  disabled: true,
                  placeholder: '系统自动生成'
                },
                {
                  label: '课程名称',
                  type: 'text',
                  prop: 'basicName',
                  disable: this.disabled,
                  placeholder: '请输入名称'
                },
                {
                  label: '拼音码',
                  type: 'text',
                  prop: 'pinyinCode',
                  disabled: true,
                  placeholder: '系统自动生成'
                },
                {
                  label: '五笔码',
                  type: 'text',
                  prop: 'fiveStrokeCode',
                  disabled: true,
                  placeholder: '系统自动生成'
                },
                {
                  label: '创建人',
                  type: 'text',
                  prop: 'createBy',
                  disabled: true,
                  placeholder: '系统自动填充'
                },
                {
                  label: '最后修改人',
                  type: 'text',
                  prop: 'updateBy',
                  disabled: true,
                  placeholder: '系统自动填充'
                },
                {
                  label: '状态',
                  type: 'radio',
                  prop: 'disable',
                  disabled: this.type === 'edit',
                  options: this.mxOpenStatus2
                }
              ],
              [
                 {
                  label: '备注',
                  type: 'textarea',
                  prop: 'note',
                  span: 12,
                  disabled: this.disabled,
                  placeholder: '请输入备注内容'
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
      // ;(this.disabled === this.type) === 'detail'
    }
  },
  methods: {
   save() {
      this.$refs.formlist.validFormList(valid => {
        if (valid) this.saveForm()
      })
    },
    saveForm() {
      let params = {
        basicName: this.formData.basicName,
        basicType: this.basicType,
        note: this.formData.note,
        disable: this.formData.disable
      }
      if (this.type === 'add') {
        addDictionary(params).then(res => {
          if (res.status) {
            this.$success('新增学年')
            this.$router.go(-1)
          }
        })
      } else if (this.type === 'edit') {
        params.id = this.formData.id
        editDictionary(params).then(res => {
          if (res.status) {
            this.$success('修改学年')
            this.$router.go(-1)
          }
        })
      }
    },
    getDictionaryIdInfo(id) {
      getDictionaryId(id).then(res => {
        if(res.status) {
          this.formData = res.data
        }
      })
    },
    cancel() {
      this.$router.go(-1)
    },
    handleBtnClick(res) {
      this[res] && this[res]()
    }
  },
  // 创建完成（可以访问当前this实例）
  created() {
    this.type = this.$route.query.type || 'add'
    if (this.type !== 'add') this.getDictionaryIdInfo(this.$route.query.id)
  },
  // 挂载完成（可以访问DOM元素）
  mounted() {}
}
</script>
<style lang='scss' scoped>
</style>
