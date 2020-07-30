<template>
  <div id="putStorageDetail" ref="putStorageDetail" class="com-detail-wrap">
    <div class="detail-item">
      <div class="detail-head">
        <div class="tit">基本信息</div>
        <div class="btns">
          <el-button class="com-btn" type="info" @click="cancel" plain>返回</el-button>
          <el-button class="com-btn" type="danger" v-if="$route.query.status == 1 " @click="del" plain>删除</el-button>
          <el-button class="com-btn" type="primary" v-if="$route.query.status == 1 || $route.query.type ==='add'" @click="save" plain>保存</el-button>
          <el-button class="com-btn" type="primary" v-if="$route.query.status != 2" @click="confirm" plain>确认</el-button>
          <el-button class="com-btn" type="primary" @click="derive" plain>导出</el-button>
        </div>
      </div>
      <div class="detail-content">
        <form-list
          :disabled="disabled"
          :datas="formData"
          :rules="listRules"
          ref="formList"
          :form-config="formConfig"
          @handle-btn-click="handleBtnClick"
        ></form-list>
      </div>
    </div>
    <div class="detail-item">
      <div class="detail-head">
        <div class="tit">表单信息</div>
        <div class="btns">
          <el-button  v-if="!disabled" class="com-btn" type="primary" @click="tableAdd" plain>新增</el-button>
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
                    <!-- 时间框 -->
                    <el-date-picker
                      v-else-if="item.type === 'date'"
                      v-model="scope.row[item.prop]"
                      value-format="yyyy-MM-dd"
                      type="date"
                      :placeholder="item.placeholder"
                      :disabled="item.disabled"
                    ></el-date-picker>
                    <!-- 数字文本框 -->
                    <el-input
                      v-model="scope.row[item.prop]"
                      @keyup.native="$limitInt(scope.row,item.prop)"
                      v-else-if="item.type === 'number'"
                    ></el-input>

                    <!-- 文本框 -->
                    <el-input v-model="scope.row[item.prop]" v-else></el-input>
                  </div>
                  <div v-else>
                    <div>{{scope.row[item.prop]}}</div>
                  </div>
                </template>
              </el-table-column>

              <el-table-column
                label="操作"
                width="150"
                align="center"
                fixed="right"
                v-if="operate!=='detail'&& $route.query.status !== 2 && formData.reqStatus !== 4 "
              >
                <template slot-scope="scope">
                  <div>
                    <el-button type="text" @click="tableDel(scope.row,scope.$index)">删除</el-button>
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
        <span>教材列表</span>
      </div>
      <teach-select-table :status="1" v-if="dialogVisibleSupples" @handle-select="handlePopSelect"></teach-select-table>
    </el-dialog>
  </div>
</template>

<script>
import FormList from '@/components/form/FormList'
import EditTable from '@/components/table/EditTable.vue'
import TeachSelectTable from '@/components/pop/TeachSelectTable.vue'
import { dictMixin } from '../../../mixins/dictMixin'
import { addBookStorage, getStorage, delStorage, delDetailStorage, updateBookStorage } from './api'
export default {
  components: {
    FormList,
    EditTable,
    TeachSelectTable
  },
  mixins: [dictMixin],
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
                  prop: 'bookStorageCode',
                  placeholder: '自动生成',
                  disabled: true
                },
                {
                  label: '入库日期',
                  type: 'date',
                  prop: 'storageDate',
                  placeholder: '请选择日期',
                  disabled: false
                },
                {
                  label: '制单人',
                  type: 'text',
                  prop: 'preparedBy',
                  placeholder: '',
                  disabled: true
                },
                {
                  label: '计划状态',
                  type: 'select',
                  prop: 'state',
                  disabled: true,
                  placeholder: '请选择计划状态',
                  options: this.mxStorangeStatus
                }
              ],
              [
                {
                  label: '备注',
                  type: 'textarea',
                  prop: 'remark',
                  span: 12,
                  disabled: false,
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
          prop: 'purchasePlanCode',
          label: '采购计划编码',
          editable: false // 是否可编辑
        },
        {
          prop: 'categoryName',
          label: '教材名称',
          editable: false
        },
        {
          prop: 'materialTypeName',
          label: '教材类型',
          editable: false
        },
        {
          prop: 'trainLevelName',
          label: '培养层次',
          editable: false
        },
        {
          prop: 'bookNum',
          label: '书号',
          editable: false
        },
        {
          prop: 'price',
          label: '单价',
          editable: true,
          type: 'number'
        },
        {
          prop: 'author',
          label: '作者',
          editable: false
        },
        {
          prop: 'press',
          label: '出版社',
          editable: false
        },
        {
          prop: 'publishDate',
          label: '出版时间',
          editable: false
        },
        {
          prop: 'bookcase',
          label: '书架号',
          editable: true
        },
        {
          prop: 'storagePlace',
          label: '存放地点',
          editable: true
        },
        {
          prop: 'quantity',
          label: '数量',
          editable: true,
          type: 'number'
        }
      ]
    }
  },
  data() {
    let tableValidator = (rule, value, callback) => {
      if (!this.Form.tableData.length) {
        callback(new Error('请选择教材'))
      } else {
        callback()
      }
    }
    return {
      disabled: false,
      operate: '',
      formData: {
        bookStorageCode: '',
        storageDate: '',
        preparedBy: '',
        state: '',
        reqStatus: '',
        remark: '',
        id: null
      },
      listRules: {},
      rules: {
        table: [
          {
            required: true,
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
      dialogVisibleSupples: false
    }
  },
  created() {
    this.operate = this.$route.query.type
    this.formData.preparedBy = sessionStorage.getItem('user') || ''
    this.formData.state = this.operate === 'add' ? 1 : ''
    this.formData.storageDate = this.$formatDate(new Date(), true)
    this.operate === 'edit' && this.getDetail(this.$route.query.id)
  },
  mounted() {},
  methods: {
    handleBtnClick(res) {
      this[res] && this[res]()
    },
    cancel() {
      this.$router.go(-1)
    },
    getDetail(id) {
      getStorage(id).then(res => {
        if (res.status) {
          let { bookStorageDetails, ...obj } = res.data
          Object.keys(this.formData).forEach(e => {
            if (obj.hasOwnProperty(e)) {
              this.formData[e] = obj[e]
            }
          })
          bookStorageDetails.forEach(e => {
            e.press = e.publisher
          })
          this.Form.tableData = bookStorageDetails
          this.disabled = this.formData.state === 2
        }
      })
    },
    save() {
      this.$refs.formList.validFormList(valid => {
        if (valid) {
          this.$refs.Form.validate(Valid => {
            if (Valid) {
              this.saveForm()
            }
          })
        }
      })
    },
    saveForm() {
      let bookStorageDetailDTOS = []
      this.Form.tableData.forEach(e => {
        let obj = {}
        obj.bookcase = e.bookcase
        obj.price = e.price
        obj.purchasePlanId = e.purchasePlanId
        obj.quantity = e.quantity
        obj.storagePlace = e.storagePlace
        obj.id = e.id ? e.id : null
        bookStorageDetailDTOS.push(obj)
      })
      let params = {
        categoryName: this.formData.categoryName,
        preparedBy: this.formData.preparedBy,
        remark: this.formData.remark,
        state: this.formData.state,
        storageDate: this.formData.storageDate,
        bookStorageDetailDTOS
      }
      if (this.operate === 'add') {
        addBookStorage(params).then(res => {
          if (res.status) {
            this.$success('新增入库信息')
            this.$router.go(-1)
          }
        })
      }else if (this.operate === 'edit') {
        params.id = this.formData.id
        updateBookStorage(params).then(res => {
          if (res.status) {
            this.$success('修改入库信息')
            this.$router.go(-1)
          }
        })
      }
    },
    confirm() {
      let bookStorageDetailDTOS = []
      this.Form.tableData.forEach(e => {
        let obj = {}
        obj.author = e.author
        obj.bookcase = e.bookcase
        obj.press = e.press
        obj.price = e.price
        obj.publishDate = e.publishDate
        obj.purchasePlanId = e.purchasePlanId
        obj.quantity = e.quantity
        obj.storagePlace = e.storagePlace
        obj.id = e.id ? e.id : null
        bookStorageDetailDTOS.push(obj)
      })
      let params = {
        categoryName: this.formData.categoryName,
        preparedBy: this.formData.preparedBy,
        remark: this.formData.remark,
        state: 2,
        storageDate: this.formData.storageDate,
        bookStorageDetailDTOS
      }
      addBookStorage(params).then(res => {
          if (res.status) {
            this.$success('入库信息确认')
            this.$router.go(-1)
          }
        })
    },
    derive() {
      
    },
    del() {
      delStorage(this.$route.query.id).then(res => {
        if(res.status) {
          this.$success('删除入库信息')
          this.$router.go(-1)
        }
      })
    },
    tableAdd() {
      this.dialogVisibleSupples = true
    },
    // 删除表格某一行
    tableDel(row, index) {
      if(row.id) {
        delDetailStorage(row.id).then(res => {
          if(res.status) {
            this.$success('删除入库单信息')
          }
        })
      }
      this.Form.tableData.splice(index, 1)
    },
    handlePopSelect(res) {
      let flag = false
      if (this.Form.tableData.length > 0) {
        flag = this.Form.tableData.some(e => e.assetCode === res.assetCode)
      }
      if (flag) {
        this.$info('重复选中，请重新勾选')
        return false
      }
      // res['press'] = res.publisher
      this.dialogVisibleSupples = false
      this.Form.tableData.push(res)
      setTimeout(() => {
        document.querySelector(
          '.detail-content .el-table__body-wrapper'
        ).scrollTop = document.querySelector(
          '.detail-content .el-table__body-wrapper'
        ).scrollHeight
      }, 50)
    }
  }
}
</script>

<style>
</style>
