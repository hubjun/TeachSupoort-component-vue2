<template>
  <div id="AllocationExamDetail" ref="AllocationExamDetail" class="com-detail-wrap">
    <div class="detail-item">
      <div class="detail-head">
        <div class="tit">基本信息</div>
        <div class="btns">
          <el-button class="com-btn" type="info" @click="cancel" plain>返回</el-button>
          <el-button class="com-btn" v-if="formData.allocateStatus === 3" type="primary" @click="pass" plain>审批</el-button>
          <el-button class="com-btn" v-if="formData.allocateStatus === 3" type="danger" @click="unpass" plain>驳回</el-button>
          <el-button class="com-btn" type="success" @click="exportFile" plain>导出</el-button>
        </div>
      </div>
      <div class="detail-content">
        <form-list :disabled="disabled" :datas="formData" :form-config="formConfig"></form-list>
      </div>
    </div>

    <div class="detail-item">
      <div class="detail-head">
        <div class="tit">需求列表</div>
        <div class="btns">
        </div>
      </div>
      <div class="detail-content">
        <edit-table :table-data="demandTableData" :table-height="tableHeight">
          <el-table-column label="序号" type="index" width="50px" align="center"></el-table-column>
          <el-table-column
              v-for="(item, index) in demandTableConfig"
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
        </edit-table>
      </div>
    </div>

    <div class="detail-item">
      <div class="detail-head">
        <div class="tit">确认列表</div>
        <div class="btns">
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
        </edit-table>
      </div>
    </div>
  </div>
</template>

<script>
  import FormList from '@/components/form/FormList'
  import { dictMixin } from '../../../mixins/dictMixin';
  import EditTable from '@/components/table/EditTable.vue';
  import { getApplyDetail, toPass, toReject } from './api';

  export default {
    name: 'AllocationExamDetail',
    components: {
      FormList,
      EditTable
    },
    mixins: [dictMixin],
    data() {
      return {
        listPath: '/teachasset/asset-allocation/allocation-exam',
        // 页面类型
        type: 'detail',
        // 基础表单是否禁用
        disabled: false,
        // 基础表单数据
        formData: {
          allocateCode: '',
          applyDate: '',
          allocateStatus: '',
          inDep: '',
          outDep: '',
          confirmMan: '',
          confirmDate: '',
          approvalMan: '',
          approvalDate: '',
          textarea: ''
        },
        // 表格数据
        tableData: [],
        demandTableData: [],
        // 表格高度
        tableHeight: 400,
        ids: ''
      }
    },
    created() {
      // 初始化判断当前页面类型
      this.type = this.$route.query.type
      this.ids = this.$route.query.id
      this.getData()
    },
    mounted() {},
    methods: {
      getData() {
        getApplyDetail(this.ids).then(res => {
          this.formData = res.data
          this.tableData = res.data.details
          this.demandTableData = res.data.reqDetails
        })
      },
      // 审批
      pass() {
        let params = {
          id: this.ids,
          approvalInfo: this.formData.note
        }
        toPass(params).then(res => {
          this.$success('审批')
          this.$router.push(this.listPath)
        })
      },
      // 驳回
      unpass() {
        let params = {
          id: this.ids,
          rejectStatus: 5,
          approvalInfo: this.formData.note
        }
        toReject(params).then(res => {
          this.$success('驳回')
          this.$router.push(this.listPath)
        })
      },
      exportFile() {
        // to do 导出
      },
      // 取消，返回列表
      cancel() {
        this.$router.push(this.listPath)
      }
    },
    computed: {
      // 基础表单配置
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
                    prop: 'allocateCode',
                    placeholder: '',
                    disabled: true
                  },
                  {
                    label: '申请人',
                    type: 'text',
                    prop: 'applyMan',
                    placeholder: '',
                    disabled: true
                  },
                  {
                    label: '申请日期',
                    type: 'date',
                    prop: 'applyDate',
                    placeholder: '',
                    disabled: true
                  },
                  {
                    label: '状态',
                    type: 'select',
                    prop: 'allocateStatus',
                    options: [
                      {
                        label: '待申报',
                        value: 1
                      },
                      {
                        label: '待审核',
                        value: 2
                      },
                      {
                        label: '待审批',
                        value: 3
                      },
                      {
                        label: '已驳回',
                        value: 4
                      },
                      {
                        label: '已审批',
                        value: 5
                      }
                    ],
                    disabled: true
                  },
                  {
                    label: '调入部门',
                    type: 'text',
                    prop: 'inDep',
                    placeholder: '',
                    disabled: true
                  },
                  {
                    label: '调出部门',
                    type: 'text',
                    prop: 'outDep',
                    placeholder: '',
                    disabled: true
                  },
                  {
                    label: '调出确认人',
                    type: 'text',
                    prop: 'confirmMan',
                    disabled: true
                  },
                  {
                    label: '确认时间',
                    type: 'date',
                    prop: 'confirmDate',
                    disabled: true
                  },
                  {
                    label: '调拨审批人',
                    type: 'text',
                    prop: 'approvalMan',
                    placeholder: '默认当前用户',
                    disabled: true
                  },
                  {
                    label: '审批日期',
                    type: 'date',
                    prop: 'approvalDate',
                    placeholder: '默认当前审批时间',
                    disabled: true
                  }
                ],
                [
                  {
                    label: '备注',
                    type: 'textarea',
                    prop: 'note',
                    span: 12,
                    placeholder: '',
                    disabled: false
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
            prop: 'specification',
            label: '规格型号'
          },
          {
            prop: 'unit',
            label: '计量单位'
          },
          {
            prop: 'type',
            label: '资产类型'
          }
        ]
      },
      // 需求表格配置
      demandTableConfig() {
        return [
          {
            prop: 'assetName',
            label: '资产名称'
          },
          {
            prop: 'specification',
            label: '规格型号'
          },
          {
            prop: 'unit',
            label: '计量单位'
          },
          {
            prop: 'type',
            label: '资产类型'
          }
        ]
      }
    }
  }
</script>

<style scoped lang="less">

</style>
