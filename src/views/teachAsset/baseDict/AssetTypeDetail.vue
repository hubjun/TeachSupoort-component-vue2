<template>
  <div id="AssetTypeDetail" ref="AssetTypeDetail" class="com-detail-wrap">
    <div class="detail-item">
      <div class="detail-head">
        <div class="tit">基本信息</div>
        <div class="btns">
          <el-button class="com-btn" type="info" @click="cancel" plain>返回</el-button>
          <el-button class="com-btn" type="primary" @click="save" plain>保存</el-button>
        </div>
      </div>
      <div class="detail-content">
        <form-list :disabled="disabled" :datas="formData" :form-config="formConfig" @handle-btn-click="handleBtnClick"></form-list>
      </div>
    </div>
  </div>
</template>

<script>
  import FormList from '@/components/form/FormList'
  import { dictMixin } from '@/mixins/dictMixin'
  import {
    getDictionaryId,
    addDictionary,
    editDictionary
  } from './api';

  export default {
    components: {
      FormList
    },
    mixins: [dictMixin],
    data() {
      return {
        TypeCode: 'JB01ZCLX',
        disabled: false,
        formData: {
          basicName: '',
          disable: false
        }
      }
    },
    created() {

    },
    mounted() {
      if(this.$route.query.type === 'edit') {
        getDictionaryId(this.$route.query.id).then((Result) => {
          this.formData = Result.data;
        })
      }else{

      }
    },
    methods: {
      getFormData() {
        console.log(this.formData.data)
      },
      handleBtnClick(res) {
        this[res] && this[res]()
      },
      save() {
        if(this.$route.query.type === 'edit') {
          editDictionary(this.formData.id, this.formData.basicName).then((r) => {
            if(!r.status) {
              this.$message.error(r.data);
            }else{
              this.$message('保存成功');
              this.cancel();
            }
          });
        }else{
          addDictionary({
            basicType: this.TypeCode,
            dictionaryName: this.formData.basicName
          }).then((r) => {
            if(!r.status) {
              this.$message.error(r.data);
            }else{
              this.$message('保存成功');
              this.cancel();
            }
          });
        }
      },
      cancel() {
        this.$router.push({ path: '/teachasset/base-dict/asset-type' });
      }
    },
    computed: {
      formConfig() {
        return {
          labelWidth: '100px',
          config: [
            {
              label: ' 基本信息',
              props: [
                [
                  {
                    label: '资产类型编码',
                    type: 'text',
                    prop: 'basicCode',
                    disabled: true,
                    placeholder: '系统自动生成'
                  },
                  {
                    label: '名称',
                    type: 'text',
                    prop: 'basicName',
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
                    prop: 'updateBy',
                    disabled: true,
                    placeholder: '系统自动填充',
                  },
                  {
                    label: '最后修改人',
                    type: 'text',
                    prop: 'createBy',
                    disabled: true,
                    placeholder: '系统自动填充',
                  },
                  {
                    label: '状态',
                    type: 'radio',
                    prop: 'disable',
                    options: this.mxOpenStatus2,
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

<style lang='less'>
  @import '../../../assets/css/variable.less';
  @import '../../../assets/css/style.less';
  #AssetTypeDetail {
    flex: 1;
  }
</style>
