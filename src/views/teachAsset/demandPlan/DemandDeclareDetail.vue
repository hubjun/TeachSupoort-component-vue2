<template>
  <div id="DemandDeclareDetail" ref="DemandDeclareDetail" class="com-detail-wrap">
    <div class="detail-item">
      <div class="detail-head">
        <div class="tit">基本信息</div>
        <div class="btns">
          <el-button class="com-btn" type="info" @click="cancel" plain>返回</el-button>
          <!--          <el-button class="com-btn" type="primary" @click="save" plain>保存</el-button>-->
          <el-button v-if="$route.query.type === 'edit'" class="com-btn" type="danger" @click="turnDown" plain>驳回</el-button>
          <el-button v-if="$route.query.type === 'edit'" class="com-btn" type="primary" @click="declare" plain>审批</el-button>
        </div>
      </div>
      <div class="detail-content">
        <form-list
          :disabled="disabled"
          :datas="formData"
          ref="formList"
          :form-config="formConfig"
        >
        </form-list>
      </div>

      <div class="detail-item">
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
        </div>
        <div id="EditTable" ref="EditTable" class="EditTable-wrap">
          <el-table :data="tableData" border stripe :height="400" :header-cell-style="tableHeaderCellStyle" :cell-style="tableCellStyle">
            <el-table-column width="50" align="center" type="index" label="序号"></el-table-column>
            <el-table-column prop="assetsName" align="center" label="资产名称"></el-table-column>
            <el-table-column prop="quantity" align="center" label="申报数量"></el-table-column>
            <el-table-column prop="specification" align="center" label="规格型号"></el-table-column>
            <el-table-column prop="assetsUnit" align="center" label="计量单位"></el-table-column>
            <el-table-column prop="assetsType" align="center" label="资产类型"></el-table-column>
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
    },
    async mounted() {
      await this.getUnitList().then(res => {
        this.UnitList = res
      })
      await this.getAssetTypeList().then(res => {
        this.AssetTypeList = res
      })
      this.getDepartDictList().then(res => {
        getDemandPlanId(this.$route.query.id).then((Result) => {
          this.formData = Result.data;
          this.tableData = Result.data.planningLines;

          Result.data.fileInfos.forEach(re => {
            this.uploadFileList.push({
              id: re.id,
              path: re.path,
              name: re.fileName,
              url: re.url
            })
          })
          console.log(this.uploadFileList);

        })
      })
    },
    methods: {
      removeClick(value) {
        if(typeof value.row.id !== 'undefined') {
          this.removeList.push(value.row.id)
        }
        this.tableData.splice(value.$index, 1)
      },
      turnDown() {
        commitPlanning(
          {
            'checkState': 9,
            'id': parseInt(this.$route.query.id),
            'remarks': this.formData.remarks
          }
        ).then(res => {
          this.$message('已驳回需求计划');
          this.cancel();
        })
      },
      declare() {
        commitPlanning(
          {
            'checkState': 8,
            'id': parseInt(this.$route.query.id),
            'remarks': this.formData.remarks,
            'batchNumber': this.formData.batchNumber
          }
        ).then(res => {
          this.$message('审批成功');
          this.cancel();
        })
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
              'annexFile': file,
              'batchNumber': this.formData.batchNumber,
              'lines': lines,
              'remarks': this.formData.remarks,
              'useDept': this.formData.useDept
            }).then(() => {
            return;
            this.$message('新增成功');
            this.cancel();
          });
        }
      },
      cancel() {
        this.$router.push({ path: '/teachasset/demand-plan/demand-declare' });
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
                    disabled: this.$route.query.type !== 'edit',
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
                  },
                  {
                    label: '审核人',
                    type: 'text',
                    prop: 'createBy',
                    disabled: true,
                    placeholder: '系统自动生成'
                  },
                  {
                    label: '审核日期',
                    type: 'text',
                    prop: 'updateTime',
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
                    placeholder: '请输入备注',
                    disabled: this.$route.query.type !== 'edit',
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
  #DemandDeclareDetail {
    flex: 1;
  }
</style>
