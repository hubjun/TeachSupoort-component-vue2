<template>
  <div id="AssetScrapRegisterDetail" ref="AssetScrapRegisterDetail" class="com-detail-wrap">
    <div class="detail-item">
      <div class="detail-head">
        <div class="tit">基本信息</div>
        <div class="btns">
          <el-button class="com-btn" type="info" @click="cancel" plain>返回</el-button>
          <el-button v-if="type === 'add' || type === 'edit'" class="com-btn" type="primary" @click="save" plain>保存</el-button>
          <el-button class="com-btn" v-if="type === 'add' || type === 'edit'" type="success" plain>导入</el-button>
          <el-button v-if="type === 'detail' && formData.status === 1" class="com-btn" type="primary" @click="confirm" plain>确认</el-button>
          <el-button class="com-btn" v-if="type === 'detail'" type="success" plain>导出</el-button>
        </div>
      </div>
      <div class="detail-content">
        <form-list ref="formList"
                   @handle-cert-success="handleCertSuccess"
                   @handle-cert-remove="handleCertRemove"
                   @handle-cert-change="handleCertChange"
                   @handle-cert-error="handleCertError"
                   @before-upload="beforeUpload"
                   @Handle-change = "HandleChange"
                   :disabled="disabled" :datas="formData" :form-config="formConfig"></form-list>
      </div>
    </div>

    <div class="detail-item">
      <div class="detail-head">
        <div class="tit">表单信息</div>
        <div class="btns">
          <el-button v-if="!disabled" class="com-btn" type="primary" @click="tableAdd" plain>新增</el-button>
        </div>
      </div>
      <div class="detail-content">
        <edit-table :table-data="tableData" :table-height="tableHeight">
          <el-table-column label="序号" type="index" width="50px" align="center"></el-table-column>
          <el-table-column
              v-for="(item, index) in tableConfig"
              :prop="item.prop"
              :label="item.label"
              align="center"
              :width="item.width" :key="index" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div v-if="!disabled && item.editable">
                <!-- 下拉框 -->
                <el-select v-model="scope.row[item.prop]" v-if="item.type === 'select'">
                  <el-option :label="option.label" :value="option.value" :key="option.value" v-for="option in item.options"></el-option>
                </el-select>
                <!-- 文本框 -->
                <el-input v-model="scope.row[item.prop]" v-else></el-input>
              </div>
              <div v-else>
                <div v-if="item.prop === 'status'">{{scope.row[item.prop] == '0' ? '启用' : '禁用'}}</div>
                <div v-else>{{scope.row[item.prop]}}</div>
              </div>
            </template>
          </el-table-column>
<!--          <el-table-column-->
<!--              label="操作"-->
<!--              width="150"-->
<!--              align="center"-->
<!--              fixed="right"-->
<!--          >-->
<!--            <template slot-scope="scope">-->
<!--              <div>-->
<!--                <el-button type="text" @click="tableDel(scope.$index)">删除</el-button>-->
<!--              </div>-->
<!--            </template>-->
<!--          </el-table-column>-->
        </edit-table>
      </div>
    </div>

    <el-dialog
        :visible.sync="dialogVisibleSupples"
        :close-on-click-modal="false"
        width="1200px"
        :center="true">
      <div slot="title" class="dialog-title">
        <span>资产列表</span>
      </div>
      <asset-select-table :department = formData.scrapDepaId v-if="dialogVisibleSupples" @handle-select="handlePopSelect"></asset-select-table>
    </el-dialog>
  </div>
</template>

<script>
  import { BASE_URL } from '@/axios/Global'
  import { uploadCert } from '@/axios/common'
  import FormList from '@/components/form/FormList'
  import { dictMixin } from '../../../mixins/dictMixin';
  import EditTable from '@/components/table/EditTable.vue';
  import AssetSelectTable from '@/components/pop/AssetSelectTable.vue';
  import { createScrapRegister, confirmScrapRegister, getIsCheckScrapCode } from './api';

  export default {
    name: 'AssetScrapRegisterDetail',
    components: {
      FormList,
      EditTable,
      AssetSelectTable
    },
    mixins: [dictMixin],
    data() {
      return {
        listPath: '/teachasset/asset-handle/asset-scrap-register',
        // 页面类型
        type: '',
        // 基础表单是否禁用
        disabled: false,
        // 基础表单数据
        formData: {
          scrapId: '', //申请编码主键 
          accessory: [], // 附件id
          operator: '', // 经办人
          registerDate: '', // 登记时间
          registerName: '', // 登记人
          remark: '', // 备注
          scrapDepa: '', // 报废单位名称
          assetName: '',
          names: '',
          scrapDepaId: '', // id
          scrapsDetails: [], // 资产列表
          status: 1, // 状态
          isCheckedScrap:''
        },
        // 表格数据
        tableData: [],
        // 表格高度
        tableHeight: 400,
        dialogVisibleSupples: false,
        checkedScrap:[]
      }
    },
    created() {
      this.getScrapCheckedList()
      // 初始化判断当前页面类型
      this.type = this.$route.query.type || 'add'
      this.getDepartList().then(res => {
        // console.log(this.mxDepartlist)
      })
      if(this.type !== 'add') {
        this.ids = this.$route.query.id
        this.formData = JSON.parse(localStorage.getItem('AssetScrapRegister'))
        this.tableData = this.formData.scrapsDetails
      }
    },
    mounted() {
      if(this.type === 'add') {
        let now = new Date()
        let yyyy = now.getFullYear()
        let mm = now.getMonth() < 9 ? ('0' + (now.getMonth() + 1)) : (now.getMonth() + 1)
        let dd = now.getDate() < 10 ? ('0' + now.getDate()) : now.getDate()
        this.formData.registerDate = `${yyyy}-${mm}-${dd}`
      }
    },
    methods: {
      // 保存
      save() {
        this.$refs.formList.validFormList((res) => {
          if (res) {
              let params = {
                accessory: JSON.stringify(this.formData.accessory),
                registerDate: this.formData.registerDate.length === 19 ? this.formData.registerDate : this.formData.registerDate.length ? (this.formData.registerDate + ' 00:00:00') : '',
                operator: this.formData.operator, //经办人
                registerName: this.formData.registerName,
                remark: this.formData.remark,
                // scrapCode: this.formData.scrapCode,
                scrapDepa: this.formData.scrapDepa,
                scrapDepaId: this.formData.scrapDepaId,
                scrapCode: this.formData.isCheckedScrap,
                scrapId: this.formData.scrapId,
                scrapsDetails: this.tableData,
                status: this.formData.status,
                assetName: this.formData.assetName,//资产名称
                names: ''   //新增资产名称
            }
            console.log(params);
            // 新增
            createScrapRegister(params).then(res => {
              if (res.status) {
                this.$message({message: res.msg, type: 'success'})
                this.$router.push(this.listPath)
              }
            })
          }
        })
      },
      confirm() {
        confirmScrapRegister(this.ids).then(res => {
          this.$success('确认')
          this.$router.push(this.listPath)
        })
      },
      // 取消，返回列表
      cancel() {
        this.$router.push(this.listPath)
      },
      // 表格新增
      tableAdd() {
        this.dialogVisibleSupples = true
      },
      // 表格删除
      // tableDel(index) {
      //   this.tableData.splice(index, 1)
      // },
      handlePopSelect(res) {
        console.log(res);
        let flag = false
        if (this.tableData.length > 0) {
          flag = this.tableData.some(e => e.assetCode === res.assetCode)
        }
        if (flag) {
          this.$info('重复选中，请重新勾选')
          return false
        }
        this.dialogVisibleSupples = false
        if (res.assetName !== '') {
          let nameArr = [], _names = '';
          nameArr.push(res.assetName)
          _names.join()
          this.formdata.names = _names
        }
        this.tableData.push({
          assetName: res.assetName,
          assetCode: res.assetCode,
          assetId: res.assetsId,
          assetName: res.assetName,
          assetTypeId: res.assetTypeId,
          assetsScrapsId: res.assetsScrapsId,
          createTime: res.createTime,
          id: res.assetsId,
          price: res.price,
          storeAdd: res.storeAdd,
          type: res.type,
          updateTime: res.updateTime,
          userDepartment: res.userDepartment,
          userDepartmentId: res.userDepartmentId,
          userName: res.userName,
          userNameId: res.userNameId
        })
        
      },
      // 文件上传成功
      handleCertSuccess(response, file, fileList) {
        if (response.status) {
          this.formConfig.cert.uploadSuccessCertNum++
          this.formConfig.cert.addCertList.push(response.data.id)
          if (
            this.formConfig.cert.uploadSuccessCertNum ===
            this.formConfig.cert.uploadCertNum
          ) {
            this.formData.accessory = this.formConfig.cert.addCertList
          }
        } else {
          this.$error(response.msg)
          return false
        }
      },
      // 文件上传触发
      handleCertChange(file, fileList) {
        if (fileList.length > 0) {
          this.formConfig.cert.uploadCert = true
        }
        this.formConfig.cert.uploadCertNum =
          fileList.length - this.formConfig.cert.uploadedCertNum
      },
      // 文件上传移除
      handleCertRemove(file, fileList) {
        this.formConfig.cert.uploadCert = fileList.length > 0
        if (file.status === 'success') {
          this.deleteIdList.push(file.id)
          this.formConfig.cert.uploadedCertNum--
        }
        this.formConfig.cert.uploadCertNum =
          fileList.length - this.formConfig.cert.uploadedCertNum
      },
      // 文件上传错误
      handleCertError(err, file, fileList) {
        if (err.status === 401) {
          this.$router.push({ path: '/login' })
        }
        this.$message({
          message: err.msg,
          type: 'error'
        })
      },
      // 文件上传之前做文件大小校验
      beforeUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 10
        if (!isLt2M) {
          this.$message.error('上传文件大小不能超过 10MB!')
        }
        return isLt2M
      },
      getScrapCheckedList() {
        let params = {
          scrap_status: 4,
          pageNum: 1 ,
          pageSize: 50
        }
        getIsCheckScrapCode(params).then(res => {
          if (res.status) {
            res.data.list = res.data.list.map(e => {
              e.lable = e.scrapCode
              e.value = e.scrapCode
              return e
            })
            this.checkedScrap = res.data.list
            // console.log(this.checkedScrap);              
          } else {
            this.$message.error(res.msg);
          }
        }).catch()
      },
      HandleChange(callback){
        callback&&this[callback]()
      },
      Change(){
        let _scrap = this.formData.isCheckedScrap
        console.log(_scrap);
        // console.log(this.mxDepartlist);
        console.log('selectScrapList', this.checkedScrap);
        console.log('scrapDepaId', this.formData.scrapDepaId);
        let checkedScrapArr = this.checkedScrap
        for (let i = 0, len = checkedScrapArr.length; i < len; i++) {
          if (checkedScrapArr[i].scrapCode == this.formData.isCheckedScrap) {
            this.formData.scrapDepaId = Number(checkedScrapArr[i].scrapDepaId)
            this.formData.scrapDepa = checkedScrapArr[i].scrapDepaName
            this.formData.scrapId = checkedScrapArr[i].id // 已审核单据主键
          }
        }
        console.log(this.formData);
        // console.log('scrapDepaId', this.formData.scrapDepaId);
      },
      Change2() {
        this.mxDepartlist.forEach((v,i) => {
          if (v.value === this.formData.scrapDepaId) {
            this.formData.scrapDepa = v.label;
          }
        })
      }
    },
    computed: {
      // 基础表单配置
      formConfig() {
        return {
          labelWidth: '100px',
          cert: {
            show: true,
            certLabel: '附件信息',
            certFileList: [],
            uploadCertUrl: `${uploadCert}`,
            acceptCertType: '',
            detailCertList: [],
            multiple: false,
            uploadCertNum: 0,
            uploadedCertNum: 0,
            uploadSuccessCertNum: 0,
            uploadCert: false,
            submitCert: false,
            addCertList: []
          },
          config: [
            {
              label: '基本信息',
              props: [
                [
                  {
                    label: '申请单据编码',
                    type: 'select',
                    prop: 'isCheckedScrap',
                    placeholder: '选择申请单据编码',
                    options: this.checkedScrap,
                    callback: 'Change'
                  },
                  {
                    label: '登记单据编码',
                    type: 'text',
                    prop: 'scrapCode',
                    placeholder: '系统自动生成单据编码',
                    disabled: true
                  },                  
                  {
                    label: '登记日期',
                    type: 'date',
                    prop: 'registerDate',
                    placeholder: ''
                  },
                  {
                    label: '登记人',
                    type: 'text',
                    prop: 'registerName',
                    placeholder: '',
                    disabled: true
                  },
                  {
                    label: '资产报废单位',
                    type: 'select',
                    prop: 'scrapDepaId',
                    placeholder: '',
                    options: this.mxDepartlist,
                    callback: 'Change2'
                  },
                  {
                    label: '经办人',
                    type: 'text',
                    prop: 'operator',
                    placeholder: ''
                  },
                  {
                    label: '计划状态',
                    type: 'select',
                    prop: 'status',
                    disabled: true,
                    options: [
                      {
                        label: '待确认',
                        value: 1
                      },
                      {
                        label: '已确认',
                        value: 2
                      }
                    ]
                  }
                ],
                [
                  {
                    label: '备注',
                    type: 'textarea',
                    prop: 'remark',
                    span: 12,
                    placeholder: ''
                  }
                ]
              ]
            }
          ]
        }
      },
      // 表格配置
      tableConfig() {
        return [
          {
            prop: 'assetCode',
            label: '资产编号'
          },
          {
            prop: 'assetName',
            label: '资产名称'
          },
          {
            prop: 'price',
            label: '原始金额'
          },
          {
            prop: 'assetType',
            label: '资产类型'
          },
          {
            prop: 'userDepartment',
            label: '使用部门'
          },
          {
            prop: 'userName',
            label: '使用人'
          },
          {
            prop: 'storeAdd',
            label: '存放位置'
          }
        ]
      }
    }
  }
</script>

<style scoped lang="less">

</style>
