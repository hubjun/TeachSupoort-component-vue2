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
        <form-list :disabled="disabled" :datas="formData" :form-config="formConfig" @handle-btn-click="handleBtnClick"></form-list>
      </div>
    </div>
  </div>
</template>

<script>
  import { getDictionaryId, addDictionary } from './api'
  import FormList from '@/components/form/FormList'
  import { dictMixin } from '../../../mixins/dictMixin'

  export default {
    components: {FormList},
    mixins: [dictMixin],
    data() {
      return {
        type: '',
        disabled: false,
        basicType: 'JB02XNXN',
        formData: {
          basicName: '',
          disable: false
          // note: ''
        }
      };
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
                    placeholder: '请输选择'
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
                    placeholder: '系统自动填充',
                  },
                  {
                    label: '最后修改人',
                    type: 'text',
                    prop: 'updateTime',
                    disabled: true,
                    placeholder: '系统自动填充',
                  }
                 //  ,{
                 //  label: '备注',
                 //  type: 'textarea',
                 //  prop: 'note',
                 //  disableed: this.disabled,
                 //  placeholder: '请输入备注内容'
                 // }
                 , {
                    label: '状态',
                    type: 'radio',
                    prop: 'disable',
                    disableed: this.disabled,
                    options: this.mxOpenStatus2,
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
        this.disabled === this.type === 'detail'
      }
    },
    methods: {
      save() {
        let params = {
          basicType: this.basicType,
          dictionaryName: this.formData.basicName,
          disable: this.formData.disable
          // note: this.formData.note
        }
        addDictionary(params).then(res => {
          if (res.status) {
            this.$message({message: '保存成功', type: 'success'})
            this.$router.push({ path: '/teachingMaterial/basic-dict/unit-year'})
          } else {
            this.$message.error(res.msg)
          }
        }).catch()
      },
      getDictionaryIdInfo(id) {
        getDictionaryId(id).then((res) => {
          this.formData = res.data;
        })
      },
      cancel() {
        this.$router.push({ path: '/teachingMaterial/basic-dict/unit-year'})
      },
      handleBtnClick(res) {
        this[res] && this[res]()
      },
    },
    //创建完成（可以访问当前this实例）
    created() {
      this.type = this.$route.query.type || 'add'
      if (this.type !== 'add') {
        this.getDictionaryIdInfo(this.$route.query.id)
      }
    },
    //挂载完成（可以访问DOM元素）
    mounted() {
    },
    beforeCreate() {}, //创建之前
    beforeMount() {}, //挂载之前
    beforeUpdate() {}, //更新之前
    beforeDestroy() {}, //销毁之前
    destroyed() {},
    activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
  }
</script>
<style lang='scss' scoped>

</style>
