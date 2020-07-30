<template>
  <div id="AllocationApplyDetail" ref="AllocationApplyDetail" class="com-detail-wrap">
    <div class="detail-item">
      <div class="detail-head">
        <div class="tit">基本信息</div>
        <div class="btns">
          <el-button class="com-btn" type="info" @click="cancel" plain>返回</el-button>
          <el-button v-if="type !== 'detail' && (formData.allocateStatus === 1 || formData.allocateStatus === 4)" class="com-btn" type="primary" @click="save" plain>保存</el-button>
          <el-button v-if="type === 'edit' && (formData.allocateStatus === 1 || formData.allocateStatus === 4)" class="com-btn" type="primary" @click="apply" plain>申报</el-button>
          <el-button v-if="type !== 'add'" class="com-btn" type="success" @click="exportFile" plain>导出</el-button>
        </div>
      </div>
      <div class="detail-content">
        <form-list ref="formList" :disabled="disabled" :datas="formData" :form-config="formConfig"></form-list>
      </div>
    </div>

    <div class="detail-item">
      <div class="detail-head">
        <div class="tit">需求列表</div>
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
          <el-table-column
              v-if="type === 'edit' || type === 'add'"
              label="操作"
              width="150"
              align="center"
              fixed="right"
          >
            <template slot-scope="scope">
              <div>
                <el-button type="text" @click="tableDel(scope.$index)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </edit-table>
      </div>
    </div>

    <div v-show="tableHidden" class="detail-item">
      <div class="detail-head">
        <div class="tit">确认列表</div>
        <!-- <div class="btns">
          <el-button class="com-btn" type="primary" @click="tableAdd" plain>新增</el-button>
        </div> -->
      </div>
      <div class="detail-content">
        <edit-table :table-data="tableConfirmData" :table-height="tableHeight">
          <el-table-column label="序号" type="index" width="50px" align="center"></el-table-column>
          <el-table-column
              v-for="(item, index) in tableConfirmConfig"
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
          <!-- <el-table-column
              label="操作"
              width="150"
              align="center"
              fixed="right"
          >
            <template slot-scope="scope">
              <div>
                <el-button type="text" @click="tableDel(scope.$index)">删除</el-button>
              </div>
            </template>
          </el-table-column> -->
        </edit-table>
      </div>
    </div>
  </div>
</template>

<script>
  import FormList from '@/components/form/FormList'
  import { dictMixin } from '../../../mixins/dictMixin';
  import EditTable from '@/components/table/EditTable.vue';
  import AssetSelectTable from '@/components/pop/AssetSelectTable.vue';
  import { createOrUpdateApply, getApplyDetail, toApply } from './api';

  export default {
    name: 'AllocationApplyDetail',
    components: {
      FormList,
      EditTable,
      AssetSelectTable
    },
    mixins: [dictMixin],
    data() {
      return {
        listPath: '/teachasset/asset-allocation/allocation-apply',
        // 页面类型
        type: '',
        // 基础表单是否禁用
        disabled: false,
        // 基础表单数据
        formData: {
          allocateCode: '', // 编码
          allocateStatus: 1, // 状态
          // applyMan: '', // 申请人
          applyDate: '', // 申请日期
          details: [], // 明细列表
          // inDep: '', // 调入部门
          note: '', // 备注
          outDep: '' // 调出部门
        },
        // 表格数据
        tableData: [],
        tableConfirmData: [],
        // 表格高度
        tableHeight: 400,
        dialogVisibleSupples: false,
        tableHidden: false
      }
    },
    async created() {
      this.getAssetTypeList()
      // 初始化判断当前页面类型
      this.type = this.$route.query.type || 'add'
      await this.getDepartList()
      if(this.type !== 'add') {
        this.ids = this.$route.query.id
        await this.getData()
      }
    },
    mounted() {
      if(this.type === 'add') {
        let now = new Date()
        let yyyy = now.getFullYear()
        let mm = now.getMonth() < 9 ? ('0' + (now.getMonth() + 1)) : (now.getMonth() + 1)
        let dd = now.getDate() < 10 ? ('0' + now.getDate()) : now.getDate()
        this.formData.applyDate = `${yyyy}-${mm}-${dd}`
      }
    },
    methods: {
      async getData() {
        getApplyDetail(this.ids).then(res => {
          this.formData = res.data
          this.tableData = res.data.reqDetails
          this.tableConfirmData = res.data.details
          this.formData.outDep = res.data.reqDetails[0].id
        })
      },
      // 保存
      save() {
        if(!this.tableData.length) {
          this.$message({
            type: 'info',
            message: '至少包含一条表单信息'
          })
          return
        }
        this.$refs.formList.validFormList((res) => {
          if(res) {
            debugger
            console.log(this.mxAssetType)
            this.tableData.map((item) => {
              item.type = this.mxAssetType.filter(i => i.value === item.type).label
            })
            let params = {
              allocateStatus: 1,
              applyDate: this.formData.applyDate,
              applyMan: this.formData.applyMan,
              inDep: this.formData.inDep,
              outDep: this.mxDepartlist.filter(item => item.value === this.formData.outDep).label,
              note: this.formData.note,
              reqDetails: this.tableData
            }
            if(this.type === 'edit') {
              params.id =  this.ids
            }
            // 新增 修改
            createOrUpdateApply(params).then(res => {
              this.$message({
                type: 'success',
                message: res.msg
              })
              this.type !== 'edit' && this.$router.push(this.listPath)
            })
          }
        })
      },
      // 通过
      apply() {
        toApply({ id: this.ids }).then(res => {
          this.$success('申报')
          this.$router.push(this.listPath)
        })
      },
      exportFile() {
        // to do 导出
      },
      // 取消，返回列表
      cancel() {
        this.$router.push(this.listPath)
      },
      // 表格新增
      tableAdd() {
        this.tableData.push({
          assetName: '',
          reqCount: 0,
          specification: '',
          type: '',
          unit: ''
        })
      },
      // 表格删除
      tableDel(index) {
        this.tableData.splice(index, 1)
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
                    placeholder: '根据编码规则自动生成',
                    disabled: true
                  },
                  {
                    label: '申请人',
                    type: 'text',
                    prop: 'applyMan',
                    placeholder: '默认当前登录用户',
                    disabled: true
                  },
                  {
                    label: '申请日期',
                    type: 'date',
                    prop: 'applyDate',
                    placeholder: '日期选择'
                  },
                  {
                    label: '状态',
                    type: 'select',
                    prop: 'allocateStatus',
                    disabled: true,
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
                    ]
                  },
                  {
                    label: '调入部门',
                    type: 'text',
                    prop: 'inDep',
                    placeholder: '默认当前登录用户部门',
                    disabled: true
                  },
                  {
                    label: '调出部门',
                    type: 'select',
                    prop: 'outDep',
                    placeholder: '',
                    options: this.mxDepartlist
                  }
                ],
                [
                  {
                    label: '备注',
                    type: 'textarea',
                    prop: 'note',
                    span: 12,
                    placeholder: '备注信息'
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
            editable: true
          },
          {
            prop: 'specification',
            label: '规格型号',
            editable: true
          },
          {
            prop: 'reqCount',
            label: '数量',
            editable: true
          },
          {
            prop: 'unit',
            label: '计量单位',
            editable: true
          },
          {
            prop: 'type',
            label: '资产类型',
            editable: true,
            type: 'select',
            options: this.mxAssetType
          }
        ]
      },
      tableConfirmConfig() {
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
          },
          {
            prop: 'userName',
            label: '使用人'
          }
        ]
      }
    },
    watch: {
      type() {
        this.disabled = this.type === 'detail'
        let status = this.$route.query.status
        this.tableHidden = status === 3 || status === 4 || status === 5 || status === 6
      }
    }
  }
</script>

<style scoped lang="less">

</style>
