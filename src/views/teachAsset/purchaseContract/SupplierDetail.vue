<template>
  <div id="SupplierDetail" ref="SupplierDetail" class="com-detail-wrap">
    <div class="detail-item">
      <div class="detail-head">
        <div class="tit">基本信息</div>
        <div class="btns">
          <el-button class="com-btn" type="info" @click="cancel" plain>返回</el-button>
          <el-button class="com-btn" type="primary" @click="save" plain>保存</el-button>
        </div>
      </div>
      <div class="detail-content">
        <form-list :disabled="disabled" :datas="formData" :form-config="baseInfoConfig" @handle-btn-click="handleBtnClick"></form-list>
        <div class="detail-head">
          <div class="tit">联系方式</div>
        </div>
        <form-list :disabled="disabled" :datas="formData" :form-config="contactConfig" @handle-btn-click="handleBtnClick"></form-list>
      </div>
      <div class="detail-content">
        <div class="detail-head">
          <div class="tit">资质信息</div>
        </div>
        <form-list
          :disabled="disabled"
          :datas="formData"
          ref="formList"
          :form-config="uploadConfig"
          @handle-btn-click="handleBtnClick"
          @handle-success="handleSuccess"
          @handle-change="handleChange"
          @handle-remove="handleRemove"
          @handle-error="handleError"
          @handle-exceed="handleExceed"
          @before-upload="beforeUpload"
        >
        </form-list>
      </div>
    </div>
  </div>
</template>

<script>
  import FormList from '@/components/form/FormList'
  import { uploadUrl, uploadCert } from '@/axios/common'
  import { dictMixin } from '@/mixins/dictMixin'
  import { BASE_URL } from '@/axios/Global'
  import {
    updateSupplier,
    addSupplier
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
          status: 1
        }
      }
    },
    created() {
      if(this.$route.query.type === 'edit') {
        this.formData = JSON.parse(sessionStorage.getItem('Supplier'));
        this.formData.licenseImgs.forEach(r => {
          this.uploadConfig.picture.imgFileList.push({
            url: r.thumbImage,
            id: r.id
          })
        })

      }
    },
    mounted() {

    },
    methods: {
      // 文件上传成功
      handleSuccess(response, file, fileList) {
        this.uploadConfig.picture.imgFileList.push({
          url: response.data.url,
          id: response.data.id
        })
      },
      // 文件上传触发
      handleChange(file, fileList) {
        this.submit();
      },
      async submit() {
        this.$refs.formList.submit()
      },
      // 文件上传移除
      handleRemove(file, fileList) {
        this.uploadConfig.picture.imgFileList.forEach((r, i) => {
          if(file.id === r.id){
            this.uploadConfig.picture.imgFileList.splice(i, 1)
          }
        })
      },
      // 文件上传错误
      handleError(err, file, fileList) {
        console.log(err);
      },
      // 文件上传超过限制
      handleExceed(file, fileList) {
        this.$message.info(`最多只能上传一张图片！`);
      },
      // 文件上传之前做文件大小校验
      beforeUpload(file) {
        this.$emit('before-upload', file)
      },
      getFormData() {
        console.log(this.formData.data)
      },
      handleBtnClick(res) {
        this[res] && this[res]()
      },
      save() {


        // if(this.formData.depositAccount === '' || this.formData.depositAccount === undefined) {
        //   this.$message.info(`请输入开户账号！`);
        //   return;
        // }
        if(this.formData.supplierName === '' || this.formData.supplierName === undefined) {
          this.$message.info(`请输入供应商名称！`);
          return;
        }

        if(this.formData.depositAccount.length > 19) {
          this.$message.info(`开户账号不能大于19位数！`);
          return;
        }

        // if(this.formData.contactNumber === '' || this.formData.contactNumber === undefined) {
        //   this.$message.info(`请输入联系电话！`);
        //   return;
        // }
        // if(this.formData.address === '' || this.formData.address === undefined) {
        //   this.$message.info(`请输入详细地址！`);
        //   return;
        // }
        // if(this.formData.email === '' || this.formData.email === undefined) {
        //   this.$message.info(`请输入邮箱！`);
        //   return;
        // }

        // var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
        // if(!reg.test(this.formData.email)) {
        //   this.$message.info(`邮箱格式不正确！`);
        //   return;
        // }

        this.formData.licenseImg = [];
        this.uploadConfig.picture.imgFileList.forEach(r => {
          this.formData.licenseImg.push(r.id)
        })
        this.formData.licenseImg = JSON.stringify(this.formData.licenseImg)

        if(this.$route.query.type === 'edit') {
          updateSupplier(this.formData).then((res) => {
            this.$message('保存成功');
            this.cancel();
          });
        }else{
          addSupplier(this.formData).then(() => {
            this.$message('新增成功');
            this.cancel();
          });
        }
      },
      cancel() {
        this.$router.push({ path: '/teachasset/purchase-contract/supplier' });
      }
    },
    computed: {
      baseInfoConfig() {
        return {
          labelWidth: '100px',
          config: [
            {
              label: ' 基本信息',
              props: [
                [
                  {
                    label: '供应商编码',
                    type: 'text',
                    prop: 'supplierCode',
                    disabled: true,
                    placeholder: '系统自动生成'
                  },
                  {
                    label: '供应商名称',
                    type: 'text',
                    prop: 'supplierName',
                    placeholder: '请输入供应商名称'
                  },
                  {
                    label: '供应商简称',
                    type: 'text',
                    prop: 'supplierShort',
                    placeholder: '请输入供应商简称'
                  },
                  {
                    label: '营业证号',
                    type: 'text',
                    prop: 'licenseCode',
                    placeholder: '请输入营业证号'
                  },
                  {
                    label: '企业法人',
                    type: 'text',
                    prop: 'enterprisePerson',
                    placeholder: '请输入企业法人'
                  },
                  {
                    label: '开户银行',
                    type: 'text',
                    prop: 'depositBank',
                    placeholder: '请输入开户银行'
                  },
                  {
                    label: '开户账号',
                    type: 'text',
                    prop: 'depositAccount',
                    placeholder: '请输入开户账号'
                  },
                  {
                    label: '拼音码',
                    type: 'text',
                    prop: 'spellCode',
                    disabled: true,
                    placeholder: '系统自动生成'
                  },
                  {
                    label: '五笔码',
                    type: 'text',
                    prop: 'wubiCode',
                    disabled: true,
                    placeholder: '系统自动生成'
                  },
                  {
                    label: '状态',
                    type: 'radio',
                    prop: 'status',
                    span: 10,
                    options: this.mxOpenStatusNum
                  }
                ]
              ]
            }
          ]
        }
      },
      contactConfig() {
        return {
          labelWidth: '100px',
          config: [
            {
              label: ' 基本信息',
              props: [
                [
                  {
                    label: '联系人',
                    type: 'text',
                    prop: 'contactName',
                    placeholder: '请输入联系人'
                  },
                  {
                    label: '联系电话',
                    type: 'text',
                    prop: 'contactNumber',
                    placeholder: '请输入联系电话'
                  },
                  {
                    label: '详细地址',
                    type: 'text',
                    prop: 'address',
                    placeholder: '请输入详细地址'
                  },
                  {
                    label: '邮箱',
                    type: 'text',
                    prop: 'email',
                    placeholder: '请输入邮箱'
                  }
                ]
              ]
            }
          ]
        }
      },
      uploadConfig() {
        return {
          picture: {
            show: true,
            pictureLabel: '营业执照',
            pictureUploadDisabled: false,
            imgFileList: [],
            uploadImgUrl: `${uploadUrl}`,
            acceptImgType: '',
            detailImgList: [],
            multiple: false,
            uploadImgNum: 0,
            uploadedImgNum: 0,
            limitImgNum: 0,
            uploadSuccessImgNum: 0,
            uploadImg: false,
            submitImg: false,
            addImgList: []
          },
          config: [
            {
              label: ' 基本信息',
              props: [
                [
                  {
                    label: '执照到期日期',
                    type: 'datetime',
                    prop: 'expirationTime',
                    placeholder: '请选择到期日期'
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
  #SupplierDetail {
    flex: 1;
  }
</style>
