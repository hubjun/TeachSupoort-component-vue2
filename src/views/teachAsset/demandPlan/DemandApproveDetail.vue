<template>
  <div id="DemandApproveDetail" ref="DemandApproveDetail" class="com-detail-wrap">
    <div class="detail-item">
      <div class="detail-head">
        <div class="tit">基本信息</div>
        <div class="btns">
          <el-button class="com-btn" type="info" @click="cancel" plain>返回</el-button>
          <el-button v-if="$route.query.type!='detail'" class="com-btn" type="primary" @click="save" plain>保存</el-button>
          <el-button v-if="$route.query.type!='detail'" class="com-btn" type="primary" @click="declare" plain>申报</el-button>
        </div>
      </div>
      <div class="detail-content">
        <form-list
          :disabled="disabled"
          :datas="formData"
          ref="formList"
          :form-config="formConfig"
          @handle-btn-click="handleBtnClick"
          @handle-cert-success="handleCertSuccess"
          @handle-cert-change="handleCertChange"
          @handle-cert-remove="handleCertRemove"
          @handle-cert-error="handleCertError"
          @handle-exceed="handleExceed"
          @handle-cert-preview="handleCertPreview"
          @before-upload="beforeUpload"
        >
        </form-list>
      </div>

      <div v-if="$route.query.type=='detail'" class="detail-item">
        <div class="detail-head">
          <div class="tit">附件信息</div>
        </div>
        <div ref="EditTable" class="EditTable-wrap" style="width: 500px">
          <el-table :data="uploadFileList" border stripe :height="200" :header-cell-style="tableHeaderCellStyle" :cell-style="tableCellStyle">
            <el-table-column width="50" align="center" type="index" label="序号"></el-table-column>
            <el-table-column prop="name" align="center" label="附件名称"></el-table-column>
            <el-table-column align="center" label="下载">
              <template slot-scope="scope">
                <a target="_blank" :href="scope.row.url">下载</a>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <div class="detail-item">
        <div class="detail-head">
          <div class="tit">表单信息</div>
          <div class="btns">
            <el-button v-if="$route.query.type!='detail'" class="com-btn" type="primary" @click="tableAdd" plain>新增</el-button>
          </div>
        </div>
        <div id="EditTable" ref="EditTable" class="EditTable-wrap">
          <el-table :data="tableData" border stripe :height="400" :header-cell-style="tableHeaderCellStyle" :cell-style="tableCellStyle">
            <el-table-column width="50" align="center" type="index" label="序号"></el-table-column>
            <el-table-column aprop="assetsName" align="center" label="资产名称">
              <template slot-scope="scope">
                <el-input :disabled="$route.query.type=='detail'" v-model="scope.row.assetsName" placeholder="请输入内容"></el-input>
              </template>
            </el-table-column>
            <el-table-column aprop="quantity" align="center" label="申报数量">
              <template slot-scope="scope">
                <el-input :disabled="$route.query.type=='detail'" v-model="scope.row.quantity" placeholder="请输入内容"></el-input>
              </template>
            </el-table-column>
            <el-table-column aprop="specification" align="center" label="规格型号">
              <template slot-scope="scope">
                <el-input :disabled="$route.query.type=='detail'" v-model="scope.row.specification" placeholder="请输入内容"></el-input>
              </template>
            </el-table-column>
            <el-table-column aprop="assetsUnit" align="center" label="计量单位">
              <template slot-scope="scope">
                <el-select :disabled="$route.query.type=='detail'" v-model="scope.row.assetsUnitId" placeholder="请选择">
                  <el-option v-for="(List,i) in UnitList" v-if="!List.disable" :key="i" :label="List.label" :value="List.value"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column aprop="assetsType" align="center" label="资产类型">
              <template slot-scope="scope">
                <el-select :disabled="$route.query.type=='detail'" v-model="scope.row.assetsTypeId" placeholder="请选择">
                  <el-option v-for="(List,i) in AssetTypeList" v-if="!List.disable" :key="i" :label="List.label" :value="List.value"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <template v-if="$route.query.type!='detail'">
              <el-table-column aprop="assetsType" align="center" label="删除">
                <template slot-scope="scope">
                  <el-button @click="removeClick(scope)" class="font-color-blue" type="text">删除</el-button>
                </template>
              </el-table-column>
            </template>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import FormList from '@/components/form/FormList'
  import { dictMixin } from '@/mixins/dictMixin'
  import { uploadUrl, uploadCert } from '@/axios/common'
  import { BASE_URL } from '@/axios/Global'
  import {
    getDemandPlanId,
    deleteDemandPlanLine,
    editDemandPlan,
    commitPlanning,
    addDemandPlan
  } from './api';
  import EditTable from '../../../components/table/EditTable';
  import AssetSelectTable from '../../../components/pop/AssetSelectTable';

  export default {
    components: {
      FormList,
      EditTable,
      AssetSelectTable
    },
    mixins: [dictMixin],
    data() {
      return {
        type: false,
        UserName: localStorage.getItem('UserName'),
        date: new Date().toISOString(),
        UnitList: [],
        AssetTypeList: [],
        removeList: [],
        uploadFileList: [],
        tableHeaderCellStyle: {
          background: 'rgba(243,243,245,1)',
          padding: '0',
          color: '#333'
        },
        tableCellStyle: {
          padding: '10px 0',
          color: '#666'
        },
        TypeCode: 'JB01ZJLY',
        disabled: false,
        formData: {
          planningCode: '',
          useDept: '',
          checkState: '',
          batchNumber: '',
          applicant: '',
          remarks: '',
          declareDate: ''
        },
        // 表格数据
        tableData: [],
        // 表格高度
        tableHeight: 400,
        dialogVisibleSupples: false
      }
    },
    created() {
      // this.formConfig.cert.show = false
      // this.formConfig.postHeaders.Authorization = `Bearer ${sessionStorage.getItem('TOKEN')}`
      // console.log(this.formConfig.postHeaders.Authorization)
    },
    async mounted() {

      await this.getUnitList().then(res => {
        this.UnitList = res

        console.log(this.UnitList)
      })
      await this.getAssetTypeList().then(res => {
        this.AssetTypeList = res
      })
      this.getDepartDictList().then(res => {
        if(this.$route.query.type !== 'add') {
          getDemandPlanId(this.$route.query.id).then((Result) => {
            this.formData = Result.data;
            this.tableData = Result.data.planningLines;
            if(this.$route.query.type === 'detail') {
              delete this.formConfig.cert
              Result.data.fileInfos.forEach(re => {

                this.uploadFileList.push({
                  id: re.id,
                  path: re.path,
                  name: re.fileName,
                  url: re.url
                })
              })
            }else{
              this.formConfig.cert.certFileList = [];
              this.formConfig.cert.detailCertList = []
              Result.data.fileInfos.forEach(re => {

                this.uploadFileList.push({
                  id: re.id,
                  path: re.path,
                  name: re.fileName,
                  url: re.url
                })

                this.formConfig.cert.certFileList.push({
                  name: re.fileName,
                  id: re.id,
                  url: re.url
                })

                this.formConfig.cert.detailCertList.push({
                  fileName: re.fileName,
                })
                console.log(this.formConfig.cert.detailCertList)
              })
              // this.formConfig.cert.certFileList
            }

          })
        }

      })
    },
    methods: {
      removeClick(value) {
        if(typeof value.row.id !== 'undefined') {
          this.removeList.push(value.row.id)
        }
        this.tableData.splice(value.$index, 1)
      },
      handleCertPreview(response) {
        console.log(response);
      },
      // 文件上传成功
      async handleCertSuccess(response, file, fileList) {
        this.uploadFileList.push({
          id: response.data.id,
          path: response.data.path
        });
      },
      // 文件上传触发
      handleCertChange(file, fileList) {
        this.submit();
      },
      // 文件上传移除
      handleCertRemove(file, fileList) {
        this.uploadFileList.forEach((re, index) => {
          if(typeof file.response === 'undefined') {
            if(re.id === file.id) {
              this.uploadFileList.splice(index, 1);
            }
          }else {
            if(re.id === file.response.data.id) {
              this.uploadFileList.splice(index, 1);
            }
          }
        })
      },
      // 文件上传错误
      handleCertError(err, file, fileList) {
        console.log(err);
      },
      // 文件上传超过限制
      handleExceed(file, fileList) {
        // this.$message.info(`最多只能上传一张图片！`);
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
      async submit() {
        this.$refs.formList.submit()
      },
      // 文件上传之前做文件大小校验
      beforeUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 10
        if (!isLt2M) {
          this.$message.error('上传文件大小不能超过 10MB!')
        }
        return isLt2M
      },
      declare() {

        if (this.$route.query.type === 'add') {
          var file = [];
          this.uploadFileList.forEach(re => {
            file.push(re.id)
          })

          var lines = [];

          this.tableData.forEach(arr => {
            lines.push({
              assetsName: arr.assetsName,
              assetsType: this.AssetTypeList.filter(unit => {
                return unit.value === arr.assetsTypeId
              })[0].label,
              assetsUnit: this.UnitList.filter(unit => {
                return unit.value === arr.assetsUnitId
              })[0].label,
              assetsTypeId: arr.assetsTypeId,
              assetsUnitId: arr.assetsUnitId,
              quantity: arr.quantity,
              id: arr.id,
              specification: arr.specification
            })
          });
          addDemandPlan(
            {
              'fileIds': file,
              'batchNumber': this.formData.batchNumber,
              'lines': lines,
              'remarks': this.formData.remarks,
              // 'useDept': this.formData.useDept
            }).then((res) => {
            commitPlanning(
              {
                'checkState': 1,
                'id': res.data,
                'remarks': this.formData.remarks
              }
            ).then(res => {
              this.$message('申报成功');
              this.cancel();
            })
            this.cancel();
          });
        }else {
          commitPlanning(
            {
              'checkState': 1,
              'id': parseInt(this.$route.query.id),
              'remarks': this.formData.remarks
            }
          ).then(res => {
            this.$message('申报成功');
            this.cancel();
          })
        }


      },
      async save() {

        var file = [];
        this.uploadFileList.forEach(re => {
          file.push(re.id)
        })

        var lines = [];

        this.tableData.forEach(arr => {
          lines.push({
            assetsName: arr.assetsName,
            assetsType: this.AssetTypeList.filter(unit => {
              return unit.value === arr.assetsTypeId
            })[0].label,
            assetsUnit: this.UnitList.filter(unit => {
              return unit.value === arr.assetsUnitId
            })[0].label,
            assetsTypeId: arr.assetsTypeId,
            assetsUnitId: arr.assetsUnitId,
            quantity: arr.quantity,
            id: arr.id,
            specification: arr.specification
          })
        });


        var _this = this;
        if (this.$route.query.type === 'edit') {
          if (this.removeList.length > 0) {
            let ids = this.removeList.join(',');
            deleteDemandPlanLine(ids).then(res => {
              Save();
            });
          } else {
            Save()
          }
          // eslint-disable-next-line no-inner-declarations
          function Save() {
            editDemandPlan({
              'batchNumber': _this.formData.batchNumber,
              'fileIds': file,
              'id': _this.$route.query.id,
              'lines': lines,
              'remarks': _this.formData.remarks
            }).then(() => {
              _this.$message('保存成功');
              _this.cancel();
            });
          }
        } else {
          addDemandPlan(
            {
              'fileIds': file,
              'batchNumber': this.formData.batchNumber,
              'lines': lines,
              'remarks': this.formData.remarks,
              // 'useDept': this.formData.useDept
            }).then(() => {
            this.$message('新增成功');
            this.cancel();
          });
        }
      },
      cancel() {
        this.$router.push({ path: '/teachasset/demand-plan/demand-approve' });
      },
      tableAdd() {
        this.tableData.push({});
      },
      handlePopSelect(res) {
        this.dialogVisibleSupples = false
        this.tableData.push({
          assetName: res.assetName,
          quantity: res.quantity,
          specification: res.specification,
          assetsUnit: res.unit,
          assetsType: res.type
        })
      }
    },
    computed: {
      formConfig() {
        return {
          cert: {
            // show: false,
            show: this.$route.query.type !== 'detail',
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
          labelWidth: '100px',
          config: [
            {
              label: ' 基本信息',
              props: [
                [
                  {
                    label: '单据编码',
                    type: 'text',
                    prop: 'planningCode',
                    disabled: true,
                    placeholder: '系统自动生成'
                  },
                  {
                    label: '使用部门',
                    labelWidth: '80px',
                    prop: 'useDept',
                    placeholder: '请选择',
                    type: 'select',
                    disabled: true,
                    options: this.mxDepartment
                  },
                  {
                    label: '状态',
                    type: 'select',
                    prop: 'checkState',
                    placeholder: '系统自动生成',
                    disabled: true,
                    options: this.mxDemandPlanStatus
                  },
                  {
                    label: '批件号',
                    type: 'text',
                    prop: 'batchNumber',
                    disabled: true,
                    placeholder: '管理部门审核后手动录入'
                  },
                  {
                    label: '申报人',
                    type: 'text',
                    prop: 'updateBy',
                    disabled: true,
                    placeholder: '系统自动生成'
                  },
                  {
                    label: '申报日期',
                    type: 'text',
                    prop: 'declareDate',
                    disabled: true,
                    placeholder: '系统自动生成'
                  }
                ],
                [
                  {
                    label: '备注',
                    span: 12,
                    type: 'textarea',
                    prop: 'remarks',
                    placeholder: '请输入备注'
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
            prop: 'assetName',
            label: '资产名称',
          },
          {
            prop: 'quantity',
            label: '申报数量',
            editable: true
          },
          {
            prop: 'specification',
            label: '规格型号'
          },
          {
            prop: 'assetsUnit',
            label: '计量单位'
          },
          {
            prop: 'assetsType',
            label: '资产类型'
          }
        ]
      }
    }
  }
</script>

<style lang='less'>
  @import '../../../assets/css/variable.less';
  @import '../../../assets/css/style.less';
  #DemandApproveDetail {
    flex: 1;
  }
  .Footer{text-align: right; color: #666; line-height: 40px;}
  .Footer span{margin-right: 30px}
  .Footer span:last-child{margin-right: 0}
</style>
