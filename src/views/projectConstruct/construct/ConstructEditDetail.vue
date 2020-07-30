<template>
  <div id="ConstructEditDetail" ref="ConstructEditDetail" class="com-detail-wrap">
    <div class="detail-item">
      <div class="detail-head">
        <div class="tit">基本信息</div>
        <div class="btns">
          <el-button class="com-btn" type="info" @click="cancel" plain>返回</el-button>
          <el-button class="com-btn" type="primary" @click="save" plain>保存</el-button>
        </div>
      </div>
      <div class="detail-content">
        <form-list :disabled="formListDisabled" :datas="formData" :form-config="formConfig"></form-list>
      </div>
    </div>

    <div class="detail-item">
      <div class="detail-head">
        <div class="tit">表单信息</div>
        <div class="btns">
          <el-button class="com-btn" type="primary" @click="tableAdd" plain>新增</el-button>
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

    <div class="detail-item">
      <div class="detail-head">
        <div class="tit">项目进展</div>
      </div>
      <div class="detail-content">
        <div class="com-process-list">
          <div class="process-item" :class="{done: currentStep.indexOf(index) > -1, selected: selectStep === index}" v-for="(item, index) in steps" :key="index" @click="changeStep(index)">
          <!-- <div class="icon-active"></div>-->
            <div class="icon">{{index+1}}</div>
            <div class="tit">{{item}}</div>
          </div>
        </div>

        <div class="com-custom-form" v-if="selectStep === 0">
          <el-row>
            <el-col :span="6">
              <div class="form-item">
                <form-list
                  ref="formList"
                  :disabled="disabled"
                  :datas="formData"
                  @handle-cert-error="handleCertError"
                  @handle-cert-remove="handleCertRemove"
                  @handle-cert-change="handleCertChange"
                  @handle-cert-success="handleCertSuccess"
                  @handle-cert-preview="handleCertPreview"
                  :form-config="uploadConfig"></form-list>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <div class="form-item">
                <div class="form-label" style="width: 120px;text-align: right;">批复文件：</div>
                <div class="form-content">
                  <el-upload
                      class="upload-demo"
                      action="https://jsonplaceholder.typicode.com/posts/"
                      multiple
                      :limit="3"
                      :file-list="[]">
                    <el-button size="small" class="com-btn" type="primary" plain>附件上传</el-button>
                  </el-upload>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <div class="form-item">
                <div class="form-label" style="width: 120px;text-align: right;">建设方案呈批件：</div>
                <div class="form-content">
                  <el-upload
                      class="upload-demo"
                      action="https://jsonplaceholder.typicode.com/posts/"
                      multiple
                      :limit="3"
                      :file-list="[]">
                    <el-button size="small" class="com-btn" type="primary" plain>附件上传</el-button>
                  </el-upload>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="form-item">
                <form-list :disabled="false" :datas="formStep1" :form-config="formStep1Config"></form-list>
              </div>
            </el-col>
          </el-row>
        </div>
        
        <div class="com-custom-form" v-if="selectStep === 1">
          <el-row>
            <el-col :span="6">
              <div class="form-item">
                <div class="form-label" style="width: 120px;text-align: right;">采购需求计划表：</div>
                <div class="form-content">
                  <el-upload
                      class="upload-demo"
                      action="https://jsonplaceholder.typicode.com/posts/"
                      multiple
                      :limit="3"
                      :file-list="[]">
                    <el-button size="small" class="com-btn" type="primary" plain>附件上传</el-button>
                  </el-upload>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <div class="form-item">
                <div class="form-label" style="width: 120px;text-align: right;">成交通知书：</div>
                <div class="form-content">
                  <el-upload
                      class="upload-demo"
                      action="https://jsonplaceholder.typicode.com/posts/"
                      multiple
                      :limit="3"
                      :file-list="[]">
                    <el-button size="small" class="com-btn" type="primary" plain>附件上传</el-button>
                  </el-upload>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <div class="form-item">
                <div class="form-label" style="width: 120px;text-align: right;">建设方案呈批件：</div>
                <div class="form-content">
                  <el-upload
                      class="upload-demo"
                      action="https://jsonplaceholder.typicode.com/posts/"
                      multiple
                      :limit="3"
                      :file-list="[]">
                    <el-button size="small" class="com-btn" type="primary" plain>附件上传</el-button>
                  </el-upload>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="form-item">
                <form-list :disabled="false" :datas="formStep2" :form-config="formStep2Config"></form-list>
              </div>
            </el-col>
          </el-row>
        </div>

        <div class="com-custom-form" v-if="selectStep === 2">
          <el-row>
            <el-col :span="6">
              <div class="form-item">
                <div class="form-label" style="width: 120px;text-align: right;">立项申报书：</div>
                <div class="form-content">
                  <el-upload
                      class="upload-demo"
                      action="https://jsonplaceholder.typicode.com/posts/"
                      multiple
                      :limit="3"
                      :file-list="[]">
                    <el-button size="small" class="com-btn" type="primary" plain>附件上传</el-button>
                  </el-upload>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <div class="form-item">
                <div class="form-label" style="width: 120px;text-align: right;">批复文件：</div>
                <div class="form-content">
                  <el-upload
                      class="upload-demo"
                      action="https://jsonplaceholder.typicode.com/posts/"
                      multiple
                      :limit="3"
                      :file-list="[]">
                    <el-button size="small" class="com-btn" type="primary" plain>附件上传</el-button>
                  </el-upload>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <div class="form-item">
                <div class="form-label" style="width: 120px;text-align: right;">建设方案呈批件：</div>
                <div class="form-content">
                  <el-upload
                      class="upload-demo"
                      action="https://jsonplaceholder.typicode.com/posts/"
                      multiple
                      :limit="3"
                      :file-list="[]">
                    <el-button size="small" class="com-btn" type="primary" plain>附件上传</el-button>
                  </el-upload>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="form-item">
                <form-list :disabled="false" :datas="formStep3" :form-config="formStep3Config"></form-list>
              </div>
            </el-col>
          </el-row>
        </div>

        <div class="com-custom-form" v-if="selectStep === 3">
          <el-row>
            <el-col :span="6">
              <div class="form-item">
                <div class="form-label" style="width: 120px;text-align: right;">合 同：</div>
                <div class="form-content">
                  <el-upload
                      class="upload-demo"
                      action="https://jsonplaceholder.typicode.com/posts/"
                      multiple
                      :limit="3"
                      :file-list="[]">
                    <el-button size="small" class="com-btn" type="primary" plain>附件上传</el-button>
                  </el-upload>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <div class="form-item">
                <div class="form-label" style="width: 120px;text-align: right;">采购项目调整审批表：</div>
                <div class="form-content">
                  <el-upload
                      class="upload-demo"
                      action="https://jsonplaceholder.typicode.com/posts/"
                      multiple
                      :limit="3"
                      :file-list="[]">
                    <el-button size="small" class="com-btn" type="primary" plain>附件上传</el-button>
                  </el-upload>
                </div>
              </div>
            </el-col>
          </el-row>
            <el-col :span="24">
              <div class="form-item">
                <form-list :disabled="false" :datas="formStep4" :form-config="formStep4Config"></form-list>
              </div>
            </el-col>
          </el-row>
        </div>

        <div class="com-custom-form" v-if="selectStep === 4">
          <el-row>
            <el-col :span="6">
              <div class="form-item">
                <div class="form-label" style="width: 120px;text-align: right;">实施方案书：</div>
                <div class="form-content">
                  <el-upload
                      class="upload-demo"
                      action="https://jsonplaceholder.typicode.com/posts/"
                      multiple
                      :limit="3"
                      :file-list="[]">
                    <el-button size="small" class="com-btn" type="primary" plain>附件上传</el-button>
                  </el-upload>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <div class="form-item">
                <div class="form-label" style="width: 120px;text-align: right;">详细设计方案：</div>
                <div class="form-content">
                  <el-upload
                      class="upload-demo"
                      action="https://jsonplaceholder.typicode.com/posts/"
                      multiple
                      :limit="3"
                      :file-list="[]">
                    <el-button size="small" class="com-btn" type="primary" plain>附件上传</el-button>
                  </el-upload>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <div class="form-item">
                <div class="form-label" style="width: 120px;text-align: right;">项目施工图：</div>
                <div class="form-content">
                  <el-upload
                      class="upload-demo"
                      action="https://jsonplaceholder.typicode.com/posts/"
                      multiple
                      :limit="3"
                      :file-list="[]">
                    <el-button size="small" class="com-btn" type="primary" plain>附件上传</el-button>
                  </el-upload>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="form-item">
                <form-list :disabled="false" :datas="formStep5" :form-config="formStep5Config"></form-list>
              </div>
            </el-col>
          </el-row>
        </div>

        <div class="com-custom-form" v-if="selectStep === 5">
          <el-row>
            <el-col :span="6">
              <div class="form-item">
                <div class="form-label" style="width: 120px;text-align: right;">结算凭证：</div>
                <div class="form-content">
                  <el-upload
                      class="upload-demo"
                      action="https://jsonplaceholder.typicode.com/posts/"
                      multiple
                      :limit="3"
                      :file-list="[]">
                    <el-button size="small" class="com-btn" type="primary" plain>附件上传</el-button>
                  </el-upload>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <div class="form-item">
                <div class="form-label" style="width: 120px;text-align: right;">会议记要：</div>
                <div class="form-content">
                  <el-upload
                      class="upload-demo"
                      action="https://jsonplaceholder.typicode.com/posts/"
                      multiple
                      :limit="3"
                      :file-list="[]">
                    <el-button size="small" class="com-btn" type="primary" plain>附件上传</el-button>
                  </el-upload>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <div class="form-item">
                <div class="form-label" style="width: 120px;text-align: right;">结算审记：</div>
                <div class="form-content">
                  <el-upload
                      class="upload-demo"
                      action="https://jsonplaceholder.typicode.com/posts/"
                      multiple
                      :limit="3"
                      :file-list="[]">
                    <el-button size="small" class="com-btn" type="primary" plain>附件上传</el-button>
                  </el-upload>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <!-- <el-col :span="24">
              <div class="form-item">
                <form-list :disabled="false" :datas="formStep6" :form-config="formStep6Config"></form-list>
              </div>
            </el-col> -->
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import FormList from '@/components/form/FormList'
  import { dictMixin } from '../../../mixins/dictMixin';
  import EditTable from '@/components/table/EditTable.vue';
  import {editConstructRecord, getProjectList} from '../api'

  export default {
    name: 'ConstructEditDetail',
    components: {
      FormList,
      EditTable
    },
    mixins: [dictMixin],
    data() {
      return {
        listPath: '/projectconstruct/construct/construct',
        // 页面类型
        type: '',
        // 基础表单是否禁用
        disabled: false,
        formListDisabled: true,
        // 基础表单数据
        formData: {
          recordContent: ''
        },
        // 项目进展记录
        formStep1: {
          remark: ''
        },
        formStep2: {
          purchasingOrganizationUnit: '',
          constructionUnit: '',
          remark: ''
        },
        formStep3: {
          plannedCompletionTime: '',
          remark: ''
        },
        formStep4: {
          remark: ''
        },
        formStep5: {
          projectAcceptance: [],
          remark: ''
        },
        formStep6: {

        },
        // 表格数据
        tableData: [],
        // 表格高度
        tableHeight: 300,
        steps: ['立项论证', '采购招标', '合同签订', '项目建设', '项目验收', '项目结算'],
        currentStep: [0, 1, 2, 3, 5],
        selectStep: 0
      }
    },
    created() {
      // 初始化判断当前页面类型
      this.type = this.$route.query.type || 'add';
      let progressId = this.$route.query.eid;
      this.getProjectSheet(progressId);
    },
    mounted() {
      if (this.$route.query.type === 'edit') {
        let queryId = this.$route.query.eid;
        let content = this.$route.query.txtContent;
        this.formData.recordContent = content;
        editConstructRecord(queryId).then(res => {
          if (res.status) {
            this.tableData = res.data;
            console.log(this.tableData)
          }
        }).catch(() => {
          this.$message.error(res.msg)
        })
      }
    },
    methods: {
      // 获取表单数据
      getFormData() {
        return this.formData
      },
      // 获取表格数据
      getTableData() {
        return this.tableData
      },
      // 保存
      save() {
        this.$message('保存')
        this.$router.push(this.listPath)
      },
      // 取消，返回列表
      cancel() {
        this.$router.push(this.listPath)
      },
      // 表格新增
      tableAdd() {
        this.tableData.push({
          recordDate: '',
          recordMan: '',
          recordContent: ''
        })
        // 延时滚动到底部。
        setTimeout(() => {
          document.querySelector('.detail-content .el-table__body-wrapper').scrollTop = document.querySelector('.detail-content .el-table__body-wrapper').scrollHeight
        }, 50)
      },
      // 表格删除
      tableDel(index) {
        this.tableData.splice(index, 1)
      },
      changeStep(index) {
        this.selectStep = index
      },
      getProjectSheet(progressId) {
        getProjectList(progressId).then(res => {
          if (res.status) {
            //
          }
        })
      }
    },
    computed: {
      uploadConfig() {
        return {
          cert: {
            show: true, //
            certLabel: '附件信息',
            certFileList: [], //上肢列表
            uploadCertUrl: `${uploadCert}`,
            acceptCertType: '', //接收格式类型
            detailCertList: [], //
            multiple: false, //
            uploadCertNum: 0,
            uploadedCertNum: 0, //详情 已上传个数
            uploadSuccessCertNum: 0,
            uploadCert: false,
            submitCert: false, 
            addCertList: []
          }
        }
      },
      formConfig() {
        return {
          labelWidth: '100px',
          config: [
            {
              label: ' 基本信息',
              props: [
                [
                  {
                    label: '建设内容',
                    type: 'textarea',
                    prop: 'recordContent',
                    span: 24,
                    placeholder: ''
                  }
                ]
              ]
            }
          ]
        }
      },
      formStep1Config() {
        return {
          labelWidth: '120px',
          config: [
            {
              // label: '基本信息',
              props: [
                [
                  {
                    label: '备 注',
                    type: 'textarea',
                    prop: 'remark',
                    span: 24,
                    placeholder: '请输入项目立项论证备注信息'
                  }
                ]
              ]
            }
          ]
        }
      },
      formStep2Config() {
        return {
          labelWidth: '150px',
          config: [
            {
              props: [
                [
                  {
                    label: '采购组织单位',
                    type: 'text',
                    width: '200',
                    prop: 'purchasingOrganizationUnit',
                    span: 24,
                    placeholder: '请输入采购组织单位'
                  },
                  {
                    label: '承建（中标）单位',
                    type: 'text',
                    width: '200',
                    prop: 'constructionUnit',
                    span: 24,
                    placeholder: '请输入承建（中标）单位'
                  },
                  {
                    label: '备 注',
                    type: 'textarea',
                    prop: 'remark',
                    span: 24,
                    placeholder: '请输入项目采购备注信息'
                  }
                ]
              ]
            }
          ]
        }
      },
      formStep3Config() {
        return {
          labelWidth: '150px',
          config: [
            {
              props: [
                [
                  {
                    label: '计划竣工时间',
                    type: 'date',
                    width: '200',
                    prop: 'plannedCompletionTime',
                    span: 24,
                    placeholder: '请选择计划竣工时间'
                  },
                  {
                    label: '备 注',
                    type: 'textarea',
                    prop: 'remark',
                    span: 24,
                    placeholder: '请输入项目合同备注信息'
                  }
                ]
              ]
            }
          ]
        }
      },
      formStep4Config() {
        return {
          labelWidth: '120px',
          config: [
            {
              props: [
                [
                  {
                    label: '备 注',
                    type: 'textarea',
                    prop: 'remark',
                    span: 24,
                    placeholder: '请输入项目备注信息'
                  }
                ]
              ]
            }
          ]
        }
      },
      formStep5Config() {
        return {
          labelWidth: '120px',
          config: [
            {
              props: [
                [
                  {
                    label: '项目验收',
                    type:　'checkbox',
                    prop: 'projectAcceptance',
                    span: 24,
                    options: [
                      {
                        label: '产品进场验收',
                        value: 1                      
                      },{
                        label: '项目组验收',
                        value: 2  
                      },{
                        label: '专家验收',
                        value: 3  
                      }
                    ]
                  },
                  {
                    label: '备 注',
                    type: 'textarea',
                    prop: 'remark',
                    span: 24,
                    placeholder: '请输入项目验收备注信息'
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
            prop: 'recordDate',
            type: 'date',
            label: '日期',
            editable: true // 是否可编辑
          },
          {
            prop: 'recordMan',
            label: '记录人',
            editable: true
          },
          {
            prop: 'recordContent',
            label: '进展情况',
            editable: true
          }
        ]
      }
    },
    watch: {
      type() {
        this.disabled = this.type === 'detail'
        this.formListDisabled = this.type === 'detail' || this.type === 'edit'
      }
    }
  }
</script>

<style scoped lang="less">
  @import '../../../assets/css/variable.less';
  .com-process-list{
    display: flex;
    margin-top: 10px;
    .process-item{
      margin-right: 100px;
      width: 50px;
      cursor: pointer;
      &.selected{
        .tit{
          color: @m-color;
        }
      }
      &:last-child {
        .icon:after{
          display: none;
          margin-right: 0;
        }
      }
      .icon{
        width: 50px;
        height: 50px;
        line-height: 50px;
        border-radius: 50%;
        border: 2px solid rgba(156,157,159,1);
        color: rgba(156,157,159,1);
        text-align: center;
        font-size: 22px;
        position: relative;
        margin-bottom: 20px;
        &:after{
          content: '';
          position: absolute;
          width: 100px;
          height: 4px;
          background-color: rgba(156,157,159,1);
          left: 100%;
          top: 50%;
          margin-top: -2px;
        }
      }
      .tit{
        white-space: nowrap;
        font-size: 16px;
        text-align: center;
        width: 64px;
        margin-left: -7px;
        color: rgba(102,102,102,1);
      }
    }
  }
  .com-custom-form{
    .form-item{
      display: flex;
      align-items: center;
      margin-top: 30px;
      .form-label{

      }
      .form-content{
        flex: 1;
      }
    }
  }
</style>
<style lang="less">
  .com-custom-form{
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner,
    .el-select {
      width: 100%;
    }
  }
</style>
