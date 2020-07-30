<template>
  <div id="assetCollectApplyDetail" ref="assetCollectApplyDetail" class="com-detail-wrap">
    <div class="detail-item">
      <div class="detail-head">
        <div class="tit">基本信息</div>
        <div class="btns">
          <el-button class="com-btn" type="info" @click="cancel" plain>返回</el-button>
          <el-button
            class="com-btn"
            v-show="formData.reqStatus === 2"
            type="success"
            @click="audit"
            plain
          >审核</el-button>
          <el-button
            class="com-btn"
            v-show="formData.reqStatus === 2"
            type="danger"
            @click="reject"
            plain
          >驳回</el-button>
          <el-button
              class="com-btn"
            type="primary"
            @click="derive"
            plain
          >导出</el-button>
        </div>
      </div>
      <div class="detail-content">
        <form-list
          :disabled="disabled"
          :datas="formData"
          :rules="listRules"
          :form-config="formConfig"
          @handle-btn-click="handleBtnClick"
        ></form-list>
      </div>
    </div>
    <div class="detail-item">
      <div class="detail-head">
        <div class="tit">表单信息</div>
      </div>
      <div class="detail-content">
        <edit-table :table-data="tableData" :table-height="tableHeight">
          <el-table-column label="序号" type="index" width="50px" align="center"></el-table-column>
          <el-table-column
            v-for="(item, index) in tableConfig"
            :prop="item.prop"
            :label="item.label"
            align="center"
            :width="item.width"
            :key="index"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <div v-if="!disabled && item.editable">
                <!-- 下拉框 -->
                <el-select v-model="scope.row[item.prop]" v-if="item.type === 'select'">
                  <el-option
                    :label="option.label"
                    :value="option.value"
                    :key="option.value"
                    v-for="option in item.options"
                  ></el-option>
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
import { dictMixin } from '../../../mixins/dictMixin'
import tableComponent from '@/components/table/table_2'
import EditTable from '@/components/table/EditTable.vue'
import tablePagination from '@/components/tableGroup/TablePagination'
import { getApplyDetail, rejectAssets, passAssets } from './api'
export default {
  components: {
    FormList,
    EditTable,
    tableComponent,
    tablePagination
  },
  mixins: [dictMixin],
  watch: {
    type() {
      this.disabled = this.type === 'detail'
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
                  prop: 'reqCode',
                  placeholder: '',
                  disabled: true
                },
                {
                  label: '领用日期',
                  type: 'date',
                  prop: 'reqDate',
                  placeholder: '',
                  disabled: true
                },
                {
                  label: '领用人',
                  type: 'text',
                  prop: 'reqMan',
                  placeholder: '',
                  disabled: true
                },
                {
                  label: '使用单位',
                  type: 'select',
                  prop: 'reqDepId',
                  placeholder: '',
                  disabled: true,
                  options: this.mxUserOfRolelist
                }
              ],
              [
                {
                  label: '计划状态',
                  type: 'select',
                  prop: 'reqStatus',
                  options: this.mxApplyStatus,
                  disabled: true
                },
                {
                  label: '审核人',
                  type: 'text',
                  prop: 'checkMan',
                  placeholder: '',
                  disabled: true
                },
                {
                  label: '审核时间',
                  type: 'date',
                  prop: 'checkDate',
                  placeholder: '',
                  disabled: true
                }
              ],
              [
                {
                  label: '备注',
                  type: 'textarea',
                  prop: 'note',
                  span: 12,
                  disabled: this.formData.reqStatus !== 2,
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
          label: '资产编号',
          editable: false // 是否可编辑
        },
        {
          prop: 'assetName',
          label: '资产名称',
          editable: false
        },
        {
          prop: 'specification',
          label: '规格型号',
          editable: false
        },
        {
          prop: 'unit',
          label: '计量单位',
          editable: false
        },
        {
          prop: 'type',
          label: '资产类型',
          editable: false
        }
      ]
    }
  },
  data() {
    return {
      operate: '',
      disabled: false,
      formData: {
        reqCode: '',
        reqDate: '',
        reqMan: '',
        reqDep: '',
        reqDepId: '',
        reqStatus: '',
        note: ''
      },
      // 表格数据
      tableData: [],
      // 表格高度
      tableHeight: 400,
      listRules: {}
    }
  },
  async created() {
    await this.userOfRoleList()
    // this.formData.reqDep = this.mxUserOfRolelist[0].value
    this.operate = this.$route.query.type
    this.getDetail(this.$route.query.id)
  },
  mounted() {},
  methods: {
    getFormData() {
      // console.log(this.formData.data)
    },
    handleBtnClick(res) {
      this[res] && this[res]()
    },
    audit() {
      passAssets(this.$route.query.id, this.formData.note).then(res => {
        if (res.status) {
          this.$success('领用审核')
          this.$router.go(-1)
        }
      })
    },
    reject() {
      rejectAssets(this.$route.query.id, this.formData.note).then(res => {
        if (res.status) {
          this.$success('领用驳回')
          this.$router.go(-1)
        }
      })
    },
    cancel() {
      this.$router.go(-1)
    },
    getDetail(id) {
      getApplyDetail(this.$route.query.id).then(res => {
        let { details, ...obj } = res.data
        this.tableData = details
        this.formData = obj
        this.formData.reqDepId = this.mxUserOfRolelist.filter(e => e.label === obj.reqDep)[0].value
      })
    },
    // 导出
    derive() {}
  }
}
</script>

<style  lang='less'>
#assetCollectApplyDetail {
  flex: 1;
}
</style>

