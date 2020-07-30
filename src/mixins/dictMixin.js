import axios from '@/axios/index'
import { BASE_URL } from '@/axios/Global'
export const dictMixin = {
  data() {
    return {
      mxOpenStatus: [ // 启用状态1
        {
          label: '启用',
          value: true
        },
        {
          label: '停用',
          value: false
        }
      ],
      mxOpenStatus2: [ // 启用状态1 反状态
        {
          label: '启用',
          value: false
        },
        {
          label: '停用',
          value: true
        }
      ],
      mxOpenStatusNum: [ // 启用状态2
        {
          label: '启用',
          value: 1
        },
        {
          label: '停用',
          value: 2
        }
      ],
      mxDemandPlanStatus: [ // 需求计划状态
        {
          value: 0,
          label: '待申报'
        },
        {
          value: 1,
          label: '待单位审批'
        },
        {
          value: 2,
          label: '待教保处审批'
        },
        {
          value: 8,
          label: '已审批'
        },
        {
          value: 9,
          label: '教保处已驳回'
        },
        {
          value: 7,
          label: '单位已驳回'
        }
      ],
      mxPurchasePlanStatus: [ // 采购计划状态
        {
          value: 0,
          label: '待申报'
        },
        {
          value: 1,
          label: '待审核'
        },
        {
          value: 8,
          label: '已审核'
        },
        {
          value: 9,
          label: '已驳回'
        }
      ],
      mxApplyStatus: [ // 申领状态
        {
          value: 1,
          label: '待申报'
        },
        {
          value: 2,
          label: '待审核'
        },
        {
          value: 3,
          label: '已驳回'
        },
        {
          value: 4,
          label: '已审核'
        }
      ],
      mxPlanStatus: [
        {
          value: 0,
          label: '待审核'
        },
        {
          value: 1,
          label: '已驳回'
        },
        {
          value: 2,
          label: '已驳回'
        }
      ],
      mxConfirmStatus: [
        {
          label: '未确认',
          value: 1
        },
        {
          label: '已确认',
          value: 2
        }
      ],
      mxDepartment: [],
      mxAssetType: [],
      mxUnit: [],
      mxSupplier: [],
      mxAssetStatus: [
        {
          label: '闲置',
          value: 1
        },
        {
          label: '已报废',
          value: 2
        },
        {
          label: '使用中',
          value: 3
        }
      ],
      mxDepreciationFuc: [
        {
          label: '直线折旧',
          value: 1
        }
      ],
      mxLineStatus: [
        {
          label: '在线',
          value: 1
        },
        {
          label: '离线',
          value: 2
        }
      ],
      mxMenuType: [
        {
          label: '模块',
          value: 1
        },
        {
          label: '菜单',
          value: 2
        },
        {
          label: '组件',
          value: 3
        }
      ],
      mxYearList: [],
      mxDepartlist: [

      ],
      mxSelectWay: [
        {
          label: '外部采购',
          value: 1
        },
        {
          label: '内部采购',
          value: 2
        },
        {
          label: '集中印刷',
          value: 3
        },
        {
          label: '自行印刷',
          value: 4
        }
      ],
      mxTeachType: [
        // {
        //   label: '军队统编',
        //   value: 1
        // },
        // {
        //   label: '国内公开',
        //   value: 2
        // },
        // {
        //   label: '学院自编',
        //   value: 3
        // }
      ],
      mxPurchaseStatus: [
        {
          label: '正常采购',
          value: 1
        },
        {
          label: '异常采购',
          value: 2
        }
      ],
      mxStorangeStatus: [
        {
          label: '待确认',
          value: 1
        },
        {
          label: '已入库',
          value: 2
        }
      ],
      mxAuditStatue: [
        {
          label: '待申报',
          value: 6
        },
        {
          label: '待初审',
          value: 1
        },
        {
          label: '待核准',
          value: 2
        },
        {
          label: '待审批',
          value: 3
        },
        {
          label: '已审批',
          value: 4
        },
        {
          label: '已驳回',
          value: 5
        }
      ],
      mxUserOfRolelist: [],
      roleLists: [],
      mxconfidentialityLevel: []
    }
  },
  create() {

  },
  methods: {
    // 获取部门基础字典数据
    async getDepartDictList() {
      return new Promise((resolve, reject) => {
        axios.get(`${BASE_URL}/basic-dictionary/list?type=JB01BMBM`).then(result => {
          if (result.data) {
            let arr = []
            result.data.forEach((item) => {
              if (item.disable) {
                arr.push({
                  label: item.basicName,
                  value: item.id,
                  disable: item.disable
                })
              }
            })
            this.mxDepartment = arr
            resolve(arr);
          }
        })
      })
    },
    // 获取资产类型基础字典数据
    async getAssetTypeList() {
      return new Promise((resolve, reject) => {
        axios.get(`${BASE_URL}/basic-dictionary/list?type=JB01ZCLX`).then(result => {
          if (result.data) {
            let arr = []
            result.data.forEach((item) => {
              arr.push({
                label: item.basicName,
                value: item.id,
                disable: item.disable
              })
            })
            this.mxAssetType = arr
            resolve(arr);
          }
        })
      })
    },
    // 获取计量单位基础字典数据
    async getUnitList() {
      return new Promise((resolve, reject) => {
        axios.get(`${BASE_URL}/basic-dictionary/list?type=JB01JLDW`).then(result => {
          if (result.data) {
            let arr = []
            result.data.forEach((item) => {
              arr.push({
                label: item.basicName,
                value: item.id,
                disable: item.disable
              })
            })
            this.mxUnit = arr
            resolve(arr);
          }
        })
      })
    },
    // 获取保密级别字典数据
    async getConfidentialityLevel() {
      return new Promise((resolve, reject) => {
        axios.post(`${BASE_URL}/secret/secrecy-dict/v1/userlist`).then(result => {
          if (result.data) {
            let arr = []
            result.data.forEach((item) => {
              arr.push({
                label: item.secrecyName,
                value: item.id,
                disable: item.secrecyState
              })
            })
            this.mxconfidentialityLevel = arr
            resolve(arr);
          }
        })
      })
    },
    // 获取供应商基础字典数据
    getSupplierList() {
      return new Promise((resolve, reject) => {
        axios.get(`${BASE_URL}/assets/supplier/v1/select?pageNum=1&pageSize=9999999`).then(result => {
          if (result.data.list) {
            let arr = []
            result.data.list.forEach((item) => {
              arr.push({
                label: item.supplierName,
                value: item.id,
                disable: item.disable
              })
            })
            this.mxSupplier = arr
            resolve(arr);
          }
        })
      })
    },
    // 获取部门数据
    getDepartList() {
      return new Promise((resolve, reject) => {
        axios.post(`${BASE_URL}/sys/dept/treeList`).then(result => {
          if (result.data.length > 0) {
            this.mxDepartlist = []
            if (result.data[0].children.length > 0) {
              result.data[0].children.forEach(e => {
                if (e.status === 1) {
                  this.mxDepartlist.push({
                    label: e.deptName,
                    value: e.id
                  })
                }
              })
            }
          }
          resolve(this.mxDepartlist);
        })
      })
    },

    // 获取部门数据
    getRoleList() {
      return new Promise((resolve, reject) => {
        axios.post(`${BASE_URL}/sys/role/page?pageNum=1&pageSize=9999999&roleName=''`).then(result => {
          if (result.status) {
            if (result.data.length > 0) {
              this.mxRolelist = []
              if (result.data.length > 0) {
                result.data.forEach(e => {
                  this.mxRolelist.push({
                    label: e.deptName,
                    value: e.id
                  })
                })
              }
            }
            resolve(this.mxRolelist);
          }
        })
      })
    },
    // 获取用户关联部门数据
    userOfRoleList() {
      return new Promise((resolve, reject) => {
        axios.get(`${BASE_URL}/sys/access-user/current`).then(result => {
          if (result.data.sysDeptList.length > 0) {
            this.mxUserOfRolelist = []
            result.data.sysDeptList.forEach(e => {
              if (e.id) {
                e.label = e.deptName
                e.value = e.id
                return e
              }
            })
            this.mxUserOfRolelist = result.data.sysDeptList
            resolve(this.mxUserOfRolelist);
          }
        })
      })
    },
    // 根据条件查询所有角色列表
    roleList() {
      return new Promise((resolve, reject) => {
        axios.get(`${BASE_URL}/sys/role/page?pageNum=1&pageSize=999999`).then(result => {
          this.roleLists = []
          if (result.data.records.length > 0) {
            result.data.records.forEach(e => {
              e.value = e.id
              e.label = e.roleName
            })
          }
          this.roleLists = result.data.records
          resolve(this.roleLists)
        })
      })
    },
    // 根据条件查询所有学年列表
    baseList(type) {
      let opts = {
        pageNum: 1,
        pageSize: 999999,
        state: false,
        type
      }
      return new Promise((resolve, reject) => {
        axios.post(`${BASE_URL}/book/book-basic-dictionary/v1/list`, opts).then(result => {
          if (result.status) {
            let arr = []
            if (result.records && result.records.length > 0) {
              result.records.forEach(e => {
                e.label = e.basicName
                e.value = e.id
              })
              arr = [...result.records]
            }
            resolve(arr)
          } else {
            resolve(result)
          }
        })
      })
    }
  }
}
