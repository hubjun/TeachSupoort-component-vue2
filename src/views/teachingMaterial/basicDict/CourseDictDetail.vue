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
          ref="formlist"
          :datas="formData"
          :form-config="formConfig"
          @handle-btn-click="handleBtnClick"
        ></form-list>
      </div>
    </div>
  </div>
</template>

<script>
import { getCourseDetail, addCourse } from './api'
import FormList from '@/components/form/FormList'
import { dictMixin } from '../../../mixins/dictMixin'

export default {
  components: { FormList },
  mixins: [dictMixin],
  data() {
    return {
      type: '',
      disabled: false,
      basicType: 'JB02XYFS',
      formData: {
        basicName: '',
        basicCode: '',
        pinyinCode: '',
        fiveStrokeCode: '',
        updateBy: '',
        createBy: '',
        disable: false,
        id: '',
        trainLevelId: '',
        trainLevelName: ''
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
                  label: '培养层次',
                  type: 'select',
                  prop: 'trainLevelId',
                  disable: this.disabled,
                  placeholder: '请输选择',
                  options: this.mxLevelType
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
              ]
            ]
          }
        ]
      }
    }
  },
  watch: {},
  methods: {
    // save() {
    //   let params = {
    //     basicType: this.basicType,
    //     dictionaryName: this.formData.basicName,
    //     disable: this.formData.disable,
    //     note: this.formData.note
    //   }
    //   addCourse(params)
    //     .then(res => {
    //       if (res.status) {
    //         this.$message({ message: '保存成功', type: 'success' })
    //         this.$router.go(-1)
    //       } else {
    //         this.$message.error(res.msg)
    //       }
    //     })
    //     .catch()
    // },
    save() {
      this.$refs.formlist.validFormList(valid => {
        if (valid) this.saveForm()
      })
    },
    saveForm() {
      this.formData.trainLevelName = this.formData.trainLevelId
        ? this.mxLevelType.filter(
            e => e.value === this.formData.trainLevelId
          )[0].label
        : ''
      let params = {
        basicName: this.formData.basicName,
        trainLevelId: this.formData.trainLevelId,
        trainLevelName: this.formData.trainLevelName,
        disable: this.formData.disable
      }
      if (this.type === 'add') {
        addCourse(params).then(res => {
          if (res.status) {
            this.$success('新增课程')
            this.$router.go(-1)
          }
        })
      } else if (this.type === 'edit') {
        params.id = this.formData.id
        addCourse(params).then(res => {
          if (res.status) {
            this.$success('修改课程')
            this.$router.go(-1)
          }
        })
      }
    },
    getCourseDetailById(id) {
      getCourseDetail(id).then(res => {
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
    if (this.type !== 'add') {
      this.getCourseDetailById(this.$route.query.id)
    }
    this.baseList('JB02PYCC').then(res => {
      this.mxLevelType = res
    })
  },
  // 挂载完成（可以访问DOM元素）
  mounted() {}
}
</script>
<style lang='scss' scoped>
</style>
