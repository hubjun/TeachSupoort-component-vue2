<template>
  <div id="adjustmentDetail" ref="adjustmentDetail" class="com-detail-wrap">
    <div class="detail-item">
      <div class="detail-head">
        <div class="tit">基本信息</div>
        <div class="btns">
          <el-button class="com-btn" type="info" @click="cancel" plain>返回</el-button>
          <el-button v-if="$route.query.type!='detail'" class="com-btn" type="primary" @click="save" plain>保存</el-button>
          <el-button v-if="$route.query.type=='edit'" class="com-btn" type="primary" @click="declare" plain>审核</el-button>
        </div>
      </div>
      <div class="detail-content">
        <form-list
          :datas="formData"
          ref="formList"
          :form-config="formConfig"
          @handle-btn-click="handleBtnClick"
        >
        </form-list>
      </div>



      <div class="detail-item">
        <div class="detail-head">
          <div class="tit">表单信息</div>
          <div class="btns">
<!--            <el-button v-if="this.$route.query.type !== 'detail'" class="com-btn" type="primary" @click="tableAdd" plain>新增</el-button>-->
          </div>
        </div>
        <div class="detail-content">
          <el-form :rules="rules" :model="Form" ref="Form">
            <el-form-item prop="table">
              <edit-table :table-data="Form.tableData" :table-height="Form.tableHeight">
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
                </el-table-column>
              </edit-table>
            </el-form-item>
          </el-form>
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
    getAdjustmentId,
    updateAdjustment,
    auditAdjustment
  } from './api';
  import EditTable from '../../../components/table/EditTable';
  import AssetSelectTable from '../../../components/pop/AssetSelectTable';
  import searchBtn from '@/components/button/searchBtn'
  import tableComponent from '@/components/table/table_2'
  import tablePagination from '@/components/tableGroup/TablePagination'

  export default {
    components: {
      FormList,
      EditTable,
      searchBtn,
      tableComponent,
      tablePagination,
      AssetSelectTable
    },
    mixins: [dictMixin],
    data() {
      let tableValidator = (rule, value, callback) => {
        if (!this.Form.tableData.length) {
          callback(new Error('请选择资产'))
        } else {
          callback()
        }
      }
      return {
        delectId: [],
        type: false,
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
        dialogVisibleSupples: false,
        rules: {
          table: [
            {
              validator: tableValidator,
              trigger: 'blur'
            }
          ]
        },
        Form: {
          // 表格数据
          tableData: [],
          // 表格高度
          tableHeight: 400
        },
        dialogVisibleSupples: false,
        SelectTable: {
          Data: [],
          SelectList: [],
          categoryName: '',
          categoryCode: '',
          bookNum: '',
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      }
    },
    created() {

      if(this.$route.query.type !== 'add') {
        getAdjustmentId(this.$route.query.id).then(res => {
          this.formData = res.data;
          this.Form.tableData = res.data.bookRepertoryAdjustmentDetails
        })
      }else {
        this.formData.inventoryDate = new Date().toISOString().slice(0, 10)
      }


    },
    async mounted() {



    },
    methods: {
      sc() {
        Adjustment(this.$route.query.id).then(res => {
          this.$message('生成成功')
          this.cancel()
        })
      },
      inventoryQuantity(scope) {
        if(parseInt(scope.row.inventoryQuantity) > scope.row.quantity) {
          this.$set(this.Form.tableData[scope.$index], 'inventoryProfit', parseInt(scope.row.inventoryQuantity) - scope.row.quantity )
          this.$set(this.Form.tableData[scope.$index], 'inventoryLosses', 0)
        }else if(parseInt(scope.row.inventoryQuantity) < scope.row.quantity) {
          this.$set(this.Form.tableData[scope.$index], 'inventoryLosses', scope.row.quantity - parseInt(scope.row.inventoryQuantity))
          this.$set(this.Form.tableData[scope.$index], 'inventoryProfit', 0)
        }else{
          this.$set(this.Form.tableData[scope.$index], 'inventoryLosses', 0)
          this.$set(this.Form.tableData[scope.$index], 'inventoryProfit', 0)
        }
        scope.row.inventoryQuantity = parseInt(scope.row.inventoryQuantity)
        let Number = scope.row.price * scope.row.quantity
        let batchNumber = scope.row.price * scope.row.inventoryQuantity
        this.$set(this.Form.tableData[scope.$index], 'differenceAmount', batchNumber - Number)
        this.$set(this.Form.tableData[scope.$index], 'batchNumber', batchNumber - Number)
      },
      tableAdd() {
        this.dialogVisibleSupples = true
        this.SelectTableGet();
      },
      SelectTableDetermine() {
        let e = this.SelectTable.SelectList;
        for(let t = 0; t < e.length; t++) {
          let doesItExist = false;
          for(let i = 0; i < this.Form.tableData.length; i++) {
            if(this.Form.tableData[i].categoryName === e[t].categoryName && this.Form.tableData[i].categoryCode === e[t].categoryCode) {
              doesItExist = true;
              continue;
            }
          }
          if(doesItExist) {
            e[t].CunZai = true;
          }else {
            e[t].CunZai = false;
          }
        }
        for(let w = 0; w < e.length; w++) {
          if(!e[w].CunZai) {
            // e[w].inventoryQuantity = e[w].quantity
            // e[w].inventoryLosses = 0
            // e[w].inventoryProfit = 0
            // e[w].batchNumber = 0
            delete e[w].id
            this.Form.tableData.push(e[w])
          }
        }
        this.dialogVisibleSupples = false
        for(let w = 0; w < e.length; w++) {
          if(e[w].CunZai) {
            this.$message('部分教材已存在，已自动过滤')
            return;
          }
        }
      },
      SelectTableChange(List) {
        this.SelectTable.SelectList = List
      },
      SelectTabledblclick(row) {
        for(let i = 0; i < this.Form.tableData.length; i++) {
          if(this.Form.tableData[i].categoryName === row.categoryName && this.Form.tableData[i].categoryCode === row.categoryCode) {
            this.$message('盘点单已存在此教材，请勿重复选择')
            return;
          }
        }
        // row.inventoryQuantity = row.quantity
        // row.inventoryLosses = 0
        // row.inventoryProfit = 0
        // row.batchNumber = 0
        delete row.id
        this.Form.tableData.push(row)
        this.dialogVisibleSupples = false
      },
      SelectTableSize(e) {
        this.SelectTable.pageSize = e
        this.SelectTableGet();
      },
      SelectTablePage(e) {
        this.SelectTable.currentPage = e
        this.SelectTableGet();
      },
      SelectTableGet() {
        let param = {
          author: '',
          bookNum: this.SelectTable.bookNum,
          categoryCode: this.SelectTable.categoryCode,
          categoryName: this.SelectTable.categoryName,
          publisher: '',
          trainLevelId: '',
          pageNum: this.SelectTable.currentPage,
          pageSize: this.SelectTable.pageSize
        };
        getInventoryInquireList(param).then(res => {
          this.SelectTable.Data = res.data.records
          this.SelectTable.total = res.total
        })
      },
      tableDel(i) {
        if(this.Form.tableData.length === 1) {
          this.$message('至少需要保留一条明细，想替换请先添加一条然后删除');
          return;
        }
        if(this.Form.tableData[i].id !== undefined) {
          this.delectId.push(this.Form.tableData[i].id)
        }
        this.Form.tableData.splice(i, 1)
      },
      deleteClick() {
        deleteInventory(this.$route.query.id).then(res => {
          if(res.status) {
            this.$message('删除成功')
            this.cancel();
          }
        })
      },
      removeClick(value) {
        if(typeof value.row.id !== 'undefined') {
          this.removeList.push(value.row.id)
        }
        this.tableData.splice(value.$index, 1)
      },
      getFormData() {
        console.log(this.formData.data)
      },
      handleBtnClick(res) {
        this[res] && this[res]()
      },
      declare() {

        auditAdjustment(this.$route.query.id).then(res => {
          this.$message('审核成功');
          this.cancel();
        })

      },
      async save() {




        var PostData = {
          'bookRepertoryadjustmentDetailDTOS': this.Form.tableData,
          'inventoryChecker': this.formData.inventoryChecker,
          'adjustmentDate': this.formData.adjustmentDate,
          'remark': this.formData.remark,
          'state': 1,
          'id': this.$route.query.id,
          'useFlag': 1
        }
        updateAdjustment(PostData).then(() => {
          this.$message('修改成功');
          this.cancel();
        });
      },
      cancel() {
        this.$router.push({ path: '/teachingmaterial/teaching-material-inventory/adjustment' });
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
          postHeaders: {
            Authorization: ''
          },
          labelWidth: '100px',
          config: [
            {
              label: ' 基本信息',
              props: [
                [
                  {
                    label: '调整单编码',
                    type: 'text',
                    prop: 'repertoryAdjustmentCode',
                    disabled: true,
                    placeholder: '系统自动生成'
                  },
                  {
                    label: '调整日期',
                    type: 'date',
                    prop: 'adjustmentDate',
                    // disabled: true,
                    placeholder: '系统自动生成'
                  },
                  {
                    label: '盘点单编码',
                    type: 'text',
                    prop: 'repertoryInventoryCode',
                    disabled: true,
                    placeholder: '系统自动生成'
                  },
                  {
                    label: '计划状态',
                    prop: 'state',
                    disabled: true,
                    placeholder: '系统自动生成',
                    type: 'select',
                    options: [
                      {
                        label: '待审核',
                        value: 1
                      },
                      {
                        label: '已审核',
                        value: 2
                      }
                    ]
                  }
                ],
                [
                  {
                    label: '备注',
                    span: 12,
                    type: 'textarea',
                    prop: 'remark',
                    placeholder: '请输入备注',
                    disabled: this.$route.query.type === 'detail'
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
            prop: 'categoryName',
            label: '教材名称'
          },
          {
            prop: 'categoryCode',
            label: '教材编码',
            editable: true
          },
          {
            prop: 'inventoryLosses',
            label: '盘亏数量'
          },
          {
            prop: 'inventoryProfit',
            label: '盘盈数量'
          },
          {
            prop: 'unit',
            label: '计量单位'
          },
          {
            prop: 'price',
            label: '单价'
          },
          {
            prop: 'differenceAmount',
            label: '差异金额'
          }
        ]
      }
    }
  }
</script>

<style lang='less'>
  @import '../../../assets/css/variable.less';
  @import '../../../assets/css/style.less';
  #adjustmentDetail {
    flex: 1;
  }
</style>
