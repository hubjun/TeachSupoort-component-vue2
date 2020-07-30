<template>
  <el-dialog
      id="ModifyPsw"
      ref="ModifyPsw"
      class="ModifyPsw-wrap com-pop-wrap"
      title="修改密码"
      :visible.sync="visible"
      :before-close="beforeClose"
      :width="width"
      :destroy-on-close="true"
      center>
    <form-list :datas="formData" :form-config="formConfig"></form-list>

    <span slot="footer" class="dialog-footer">
      <a class="pop-btn" @click="confirm">确定</a>
    </span>
  </el-dialog>
</template>

<script>
  import FormList from '@/components/form/FormList.vue';
  export default {
    name: 'ModifyPsw',
    components: {
      FormList
    },
    data() {
      return {
        width: '390px',
        formData: {
          oPsw: '',
          nPsw: ''
        },
        formConfig: {
          labelWidth: '80px',
          config: [
            {
              label: ' ',
              props: [
                [
                  {
                    label: '当前密码',
                    type: 'password',
                    prop: 'oPsw',
                    span: 24,
                    placeholder: '根据编码规则自动生成'
                  }
                ],
                [
                  {
                    label: '更改密码',
                    type: 'password',
                    prop: 'nPsw',
                    span: 24,
                    placeholder: '请输入密码'
                  }
                ],
                [
                  {
                    label: '确认密码',
                    type: 'password',
                    prop: 'nPsw2',
                    span: 24,
                    placeholder: '请输入密码'
                  }
                ]
              ]
            }
          ]
        }
      }
    },
    created() {

    },
    mounted() {

    },
    methods: {
      confirm() {
        this.$store.commit('setModifyPopVisible', false)
      },
      beforeClose() {
        this.$store.commit('setModifyPopVisible', false)
      }
    },
    computed: {
      visible() {
        return this.$store.state.modifyPopVisible
      }
    }
  }
</script>

<style scoped lang="less">

</style>
