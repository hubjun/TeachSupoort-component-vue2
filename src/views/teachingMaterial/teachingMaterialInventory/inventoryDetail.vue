<template>
  <div id="inventoryDetail" ref="inventoryDetail" class="com-detail-wrap">
    <div class="detail-item">
      <div class="detail-head">
        <div class="tit">基本信息</div>
        <div class="btns">
          <el-button class="com-btn" type="info" @click="cancel" plain>返回</el-button>
          <el-button v-if="$route.query.type=='edit'" class="com-btn" type="danger" @click="deleteClick" plain>删除</el-button>
          <el-button v-if="$route.query.type!='detail'" class="com-btn" type="primary" @click="save" plain>保存</el-button>
          <el-button v-if="$route.query.type=='edit'" class="com-btn" type="primary" @click="declare" plain>确认</el-button>
          <el-button v-if="$route.query.type=='detail'" class="com-btn" type="primary" @click="sc" plain>生成盘点单</el-button>
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
              <el-button v-if="this.$route.query.type !== 'detail'" class="com-btn" type="primary" @click="tableAdd" plain>新增</el-button>
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
                  <template slot-scope="scope">
<!--                    <el-input-number controls-position="right" :disabled="$route.query.type === 'detail'" v-model="scope.row.inventoryQuantity" @change="handleChange" :min="0" label="描述文字" v-if="item.prop === 'inventoryQuantity'"></el-input-number>-->
                    <el-input type="number" :disabled="$route.query.type === 'detail'" v-model="scope.row.inventoryQuantity"  @change="inventoryQuantity(scope)" v-if="item.prop === 'inventoryQuantity'"></el-input>
                    <el-input :disabled="$route.query.type === 'detail'" placeholder="请输入" v-model="scope.row.unit" v-else-if="item.prop === 'unit'"></el-input>
                    <div v-else>{{scope.row[item.prop]}}</div>
                  </template>
                </el-table-column>
                <el-table-column  v-if="$route.query.type !== 'detail'" label="操作" width="150" align="center" fixed="right">
                  <template slot-scope="scope">
                    <div>
                      <el-button type="text" @click="tableDel(scope.$index)">删除</el-button>
                    </div>
                  </template>
                </el-table-column>
              </edit-table>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <el-dialog
        :visible.sync="dialogVisibleSupples"
        :close-on-click-modal="false"
        width="1200px"
        :center="true"
      >
        <div slot="title" class="dialog-title">
          <span>教材库存</span>
        </div>

        <div class="query-box">
          <div class="query-item">
            <div class="query-label">教材名称</div>
            <div class="query-input">
              <el-input v-model="SelectTable.categoryName" placeholder="请输入教材名称" clearable></el-input>
            </div>
          </div>
          <div class="query-item">
            <div class="query-label">教材编码</div>
            <div class="query-input">
              <el-input v-model="SelectTable.categoryCode" placeholder="请输入教材编码" clearable></el-input>
            </div>
          </div>
          <div class="query-item">
            <div class="query-label">书号</div>
            <div class="query-input">
              <el-input v-model="SelectTable.bookNum" placeholder="请输入书号" clearable></el-input>
            </div>
          </div>
          <div class="query-btn">
            <search-btn @clickBtn="SelectTableGet"></search-btn>
            <el-button class="com-btn" type="primary" @click="SelectTableDetermine" plain>确认</el-button>
          </div>
        </div>
        <table-component :tableData="SelectTable.Data" :tableHeight="400" @select="SelectTableChange" @dblclick="SelectTabledblclick">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
          <el-table-column prop="categoryCode" label="教材编码" align="center" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="categoryName" label="教材名称" align="center" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="materialTypeName" label="教材类型" align="center" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="storagePlace" label="存放地点" align="center" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="bookcase" label="书架号" align="center" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="quantity" label="库存" align="center" :show-overflow-tooltip="true"></el-table-column>
        </table-component>

        <table-pagination
          @size-change="SelectTableSize"
          @page-change="SelectTablePage"
          :currentPage="SelectTable.currentPage"
          :pageSize="SelectTable.pageSize"
          :total="SelectTable.total"
        ></table-pagination>


<!--        <asset-select-table  v-if="dialogVisibleSupples"  @handle-select="handlePopSelect"></asset-select-table>-->
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import FormList from '@/components/form/FormList'
  import { dictMixin } from '@/mixins/dictMixin'
  import { uploadUrl, uploadCert } from '@/axios/common'
  import { BASE_URL } from '@/axios/Global'
  import {
    getInventoryId,
    updateInventory,
    getInventoryInquireList,
    qrInventory,
    deleteInventorymx,
    deleteInventory,
    Adjustment,
    addInventory
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
        getInventoryId(this.$route.query.id).then(res => {
          this.formData = res.data;
          this.Form.tableData = res.data.bookRepertoryInventoryDetails
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
        for(let i = 0; i < this.Form.tableData.length; i++) {
          if(this.Form.tableData[i].inventoryQuantity === undefined || this.Form.tableData[i].inventoryQuantity === '') {
            this.$message.error('请填写所有盘点数量')
            return;
          }
        }

        qrInventory(this.$route.query.id).then(res => {
          this.$message('确认成功');
          this.cancel();
        })

      },
      async save() {

        if(this.Form.tableData.length === 0) {
          this.$message('至少需要添加一条明细');
          return;
        }

        for(let i = 0; i < this.Form.tableData.length; i++) {
          if(this.Form.tableData[i].inventoryQuantity === undefined || this.Form.tableData[i].inventoryQuantity === '') {
            this.$message.error('请填写所有盘点数量')
            return;
          }
        }




        var PostData = {
          'bookRepertoryInventoryDetailDTOS': this.Form.tableData,
          'inventoryChecker': this.formData.inventoryChecker,
          'inventoryDate': this.formData.inventoryDate,
          'remark': this.formData.remark,
          'state': 1,
          'useFlag': 1
        }

        var _this = this;
        if (this.$route.query.type === 'add') {
          addInventory(PostData).then(() => {
            this.$message('新增盘点单成功');
            this.cancel();
          });
        } else {
          PostData.id = this.$route.query.id

          if(this.delectId.length > 0) {
            deleteInventorymx(this.delectId.join(','))
          }



          updateInventory(PostData).then(() => {
            this.$message('修改成功');
            this.cancel();
          });
        }
      },
      cancel() {
        this.$router.push({ path: '/teachingmaterial/teaching-material-inventory/inventory' });
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
                    label: '盘点单编码',
                    type: 'text',
                    prop: 'repertoryInventoryCode',
                    disabled: true,
                    placeholder: '系统自动生成'
                  },
                  {
                    label: '盘点日期',
                    type: 'date',
                    prop: 'inventoryDate',
                    disabled: true,
                    placeholder: '系统自动生成'
                  },
                  {
                    label: '盘点人',
                    type: 'select',
                    prop: 'inventoryChecker',
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
                        label: '待确认',
                        value: 1
                      },
                      {
                        label: '已盘点',
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
            prop: 'quantity',
            label: '数量'
          },
          {
            prop: 'inventoryQuantity',
            label: '盘点数量'
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
            prop: 'price',
            label: '单价'
          },
          {
            prop: 'differenceAmount',
            label: '差异金额'
          },
          {
            prop: 'unit',
            label: '计量单位'
          },
          {
            prop: 'storagePlace',
            label: '存放地点'
          },
          {
            prop: 'bookcase',
            label: '书架号'
          }
        ]
      }
    }
  }
</script>

<style lang='less'>
  @import '../../../assets/css/variable.less';
  @import '../../../assets/css/style.less';
  #inventoryDetail {
    flex: 1;
  }
</style>
