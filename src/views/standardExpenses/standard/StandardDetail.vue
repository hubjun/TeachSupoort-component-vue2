<template>
  <div id="StandardDetail" ref="StandardDetail" class="com-detail-wrap">
    <div class="detail-item">
      <div class="detail-head">
        <div class="tit">基本信息</div>
        <div class="btns">
          <el-button class="com-btn" type="info" @click="cancel" plain>返回</el-button>
          <el-button v-if="$route.query.type === 'edit'" class="com-btn" type="danger" @click="deleteClick" plain>删除</el-button>
          <el-button v-if="$route.query.type !== 'edit'" class="com-btn" type="primary" @click="save" plain>保存</el-button>
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
    addStandard,
    deleteStandard
  } from './api';

  export default {
    components: {
      FormList
    },
    mixins: [dictMixin],
    data() {
      return {
        disabled: false,
        formData: {
          fiscalYear: '',
          department: '',
          giveOutlay: '',
          rate: '',
          payOutlay: ''
        }
      }
    },
    created() {

    },
    mounted() {
      if(this.$route.query.type === 'edit') {
        this.formData = JSON.parse(localStorage.getItem('Standard'))
        this.formData.fiscalYear = this.formData.fiscalYear + '-1-1'
      }
    },
    methods: {
      getFormData() {
        console.log(this.formData.data)
      },
      handleBtnClick(res) {
        this[res] && this[res]()
      },
      deleteClick() {
        deleteStandard(this.formData.id).then(res => {
          this.$message('删除成功');
          this.cancel();
        })
      },
      save() {
        if(this.formData.fiscalYear === '' || typeof this.formData.fiscalYear === 'undefined') {
          this.$message.error('请选择年度')
          return;
        }
        if(this.formData.department === '' || typeof this.formData.department === 'undefined') {
          this.$message.error('请填写部门')
          return;
        }
        if(this.formData.giveOutlay === '' || typeof this.formData.giveOutlay === 'undefined') {
          this.$message.error('请填写下达经费')
          return;
        }
        if(this.formData.payOutlay === '' || typeof this.formData.payOutlay === 'undefined') {
          this.$message.error('请填写开支经费')
          return;
        }
        addStandard({
          'department': this.formData.department,
          'fiscalYearString': this.formData.fiscalYear,
          'giveOutlay': this.formData.giveOutlay,
          'payOutlay': this.formData.payOutlay
        }).then(() => {
          this.$message('保存成功');
          this.cancel();
        });
      },
      cancel() {
        this.$router.push({ path: '/standardexpenses/standard/standard' });
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
                    label: '年度',
                    type: 'year',
                    prop: 'fiscalYear',
                    disabled: this.$route.query.type === 'edit',
                    placeholder: '请选择年度'
                  },
                  {
                    label: '部门',
                    type: 'text',
                    prop: 'department',
                    disabled: this.$route.query.type === 'edit',
                    placeholder: '请输入部门'
                  },
                  {
                    label: '下达经费',
                    type: 'number',
                    prop: 'giveOutlay',
                    disabled: this.$route.query.type === 'edit',
                    placeholder: '下达经费（万元）'
                  },
                  {
                    label: '开支率',
                    type: 'number',
                    prop: 'rate',
                    disabled: true,
                    placeholder: '系统自动计算'
                  },
                  {
                    label: '开支经费',
                    type: 'number',
                    prop: 'payOutlay',
                    disabled: this.$route.query.type === 'edit',
                    placeholder: '开支经费（万元）'
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
  #StandardDetail {
    flex: 1;
  }
</style>
