const menus = {
  // 教材资产管理
  teachasset: [
    {
      id: 'baseDict',
      label: '基础字典管理',
      icon: '&#xe646;',
      children: [
        {
          id: '/teachasset/base-dict/asset-type',
          label: '资产类型',
          path: '/teachasset/base-dict/asset-type'
        },
        {
          id: '/teachasset/base-dict/unit-measure',
          label: '计量单位',
          path: '/teachasset/base-dict/unit-measure'
        },
        {
          id: '/teachasset/base-dict/depart',
          label: '部门',
          path: '/teachasset/base-dict/depart'
        },
        {
          id: '/teachasset/base-dict/asset-status',
          label: '资产状态',
          path: '/teachasset/base-dict/asset-status'
        },
        {
          id: '/teachasset/base-dict/asset-source',
          label: '资金来源',
          path: '/teachasset/base-dict/asset-source'
        }
      ]
    },
    {
      id: 'demandplan',
      label: '需求计划管理',
      icon: '&#xe61a;',
      children: [
        {
          id: '/teachasset/demand-plan/demand-approve',
          label: '教学资产需求申报',
          path: '/teachasset/demand-plan/demand-approve'
        },
        {
          id: '/teachasset/demand-plan/demand-audit',
          label: '单位审核',
          path: '/teachasset/demand-plan/demand-audit'
        },
        {
          id: '/teachasset/demand-plan/demand-declare',
          label: '教保处审批',
          path: '/teachasset/demand-plan/demand-declare'
        }
      ]
    },
    {
      id: 'purchaseplan',
      label: '采购计划管理',
      icon: '&#xe660;',
      children: [
        {
          id: '/teachasset/purchase-plan/centralized-processing',
          label: '集中处理需求计划',
          path: '/teachasset/purchase-plan/centralized-processing'
        },
        {
          id: '/teachasset/purchase-plan/purchase-plan',
          label: '采购计划',
          path: '/teachasset/purchase-plan/purchase-plan'
        },
        {
          id: '/teachasset/purchase-plan/purchase-plan-audit',
          label: '采购计划审核',
          path: '/teachasset/purchase-plan/purchase-plan-audit'
        }
      ]
    },
    {
      id: 'purchasecontract',
      label: '采购合同管理',
      icon: '&#xe661;',
      children: [
        {
          id: '/teachasset/purchase-contract/supplier',
          label: '供应商管理',
          path: '/teachasset/purchase-contract/supplier'
        },
        {
          id: '/teachasset/purchase-contract/purchase-contract',
          label: '采购合同',
          path: '/teachasset/purchase-contract/purchase-contract'
        }
      ]
    },
    {
      id: 'checkacceptIn',
      label: '验收入账管理',
      icon: '&#xe65f;',
      children: [
        {
          id: '/teachasset/check-accept-in/asset-accept',
          label: '资产验收建账',
          path: '/teachasset/check-accept-in/asset-accept'
        }
      ]
    },
    {
      id: 'assetstanding',
      label: '资产台账管理',
      icon: '&#xe659;',
      children: [
        {
          id: '/teachasset/asset-standing/parameter-manage',
          label: '资产台账管理（管理部门）',
          path: '/teachasset/asset-standing/parameter-manage'
        },
        {
          id: '/teachasset/asset-standing/parameter-use',
          label: '资产台账管理（使用部门）',
          path: '/teachasset/asset-standing/parameter-use'
        }
      ]
    },
    {
      id: 'assetcollect',
      label: '资产领用管理',
      icon: '&#xe648;',
      children: [
        {
          id: '/teachasset/asset-collect/asset-collect-apply',
          label: '资产领用申请',
          path: '/teachasset/asset-collect/asset-collect-apply'
        },
        {
          id: '/teachasset/asset-collect/asset-collect-audit',
          label: '资产领用审核',
          path: '/teachasset/asset-collect/asset-collect-audit'
        }
      ]
    },
    {
      id: 'assettransfer',
      label: '资产移交管理',
      icon: '&#xe64a;',
      children: [
        {
          id: '/teachasset/asset-transfer/asset-hand-over',
          label: '资产移交',
          path: '/teachasset/asset-transfer/asset-hand-over'
        }
      ]
    },

    {
      id: 'assetAllocation',
      label: '资产调拨管理',
      icon: '&#xe65e;',
      children: [
        {
          id: '/teachasset/asset-allocation/allocation-apply',
          label: '资产调拨申请',
          path: '/teachasset/asset-allocation/allocation-apply'
        },
        {
          id: '/teachasset/asset-allocation/allocation-confirm',
          label: '资产调拨审核',
          path: '/teachasset/asset-allocation/allocation-confirm'
        },
        {
          id: '/teachasset/asset-allocation/allocation-exam',
          label: '资产调拨审批',
          path: '/teachasset/asset-allocation/allocation-exam'
        }
      ]
    },
    {
      id: 'assetDepreciation',
      label: '资产折旧管理',
      icon: '&#xe663;',
      children: [
        {
          id: '/teachasset/asset-depreciation/depreciation-way',
          label: '折旧方法',
          path: '/teachasset/asset-depreciation/depreciation-way'
        },
        {
          id: '/teachasset/asset-depreciation/provision-depreciation',
          label: '计提折旧',
          path: '/teachasset/asset-depreciation/provision-depreciation'
        }
      ]
    },
    {
      id: 'assetFix',
      label: '资产维修保养管理',
      icon: '&#xe652;',
      children: [
        {
          id: '/teachasset/asset-fix/asset-fix',
          label: '资产维修记录',
          path: '/teachasset/asset-fix/asset-fix'
        }
      ]
    },
    {
      id: 'assetCheck',
      label: '资产清查管理',
      icon: '&#xe66e;',
      children: [
        {
          id: '/teachasset/asset-check/check-plan-create',
          label: '资产清查计划生成',
          path: '/teachasset/asset-check/check-plan-create'
        },
        {
          id: '/teachasset/asset-check/check-plan-form',
          label: '资产盘点单',
          path: '/teachasset/asset-check/check-plan-form'
        }
      ]
    },
    {
      id: 'assetHandle',
      label: '资产处置管理',
      icon: '&#xe670;',
      children: [
        {
          id: '/teachasset/asset-handle/asset-scrap-apply',
          label: '资产报废申请',
          path: '/teachasset/asset-handle/asset-scrap-apply'
        },
        {
          id: '/teachasset/asset-handle/asset-scrap-exam',
          label: '资产报废审核',
          path: '/teachasset/asset-handle/asset-scrap-exam'
        },
        {
          id: '/teachasset/asset-handle/asset-scrap-register',
          label: '资产报废登记',
          path: '/teachasset/asset-handle/asset-scrap-register'
        },
        {
          id: '/teachasset/asset-handle/asset-abort-handle',
          label: '异常处置',
          path: '/teachasset/asset-handle/asset-abort-handle'
        }
      ]
    }
  ],
  // 项目建设管理
  projectconstruct: [
    {
      id: 'construct',
      label: '项目建设管理',
      icon: '&#xe669;',
      children: [
        {
          id: '/projectconstruct/construct/construct',
          label: '项目建设',
          path: '/projectconstruct/construct/construct'
        }
      ]
    }
  ],
  // 标准经费管理
  standardexpenses: [
    {
      id: 'standard',
      label: '标准经费',
      icon: '&#xe665;',
      children: [
        {
          id: '/standardexpenses/standard/standard',
          label: '标准经费管理',
          path: '/standardexpenses/standard/standard'
        }
      ]
    }
  ],
   // 标准经费管理
   system: [
    {
      id: 'system',
      label: '系统管理',
      icon: '&#xe671;',
      children: [
        {
          id: '/system/user',
          label: '用户管理',
          path: '/system/user'
        },
        {
          id: '/system/role',
          label: '角色权限',
          path: '/system/role'
        },
        {
          id: '/system/menu',
          label: '菜单管理',
          path: '/system/menu'
        },
        {
          id: '/system/depart',
          label: '部门管理',
          path: '/system/depart'
        },
        {
          id: '/system/loginManage',
          label: '登录管理',
          path: '/system/loginManage'
        },
        {
          id: '/system/logManage',
          label: '系统日志',
          path: '/system/logManage'
        }
      ]
    }
  ],
  // 教材管理
  teachingmaterial: [
    {
      id: 'basicDict',
      label: '基本字典管理',
      icon: '&#xe646;',
      children: [
        {
          id: '/teachingMaterial/basic-dict/asset-type',
          label: '选用方式',
          path: '/teachingMaterial/basic-dict/asset-type'
        },{
          id: '/teachingMaterial/basic-dict/course-dict',
          label: '课程字典',
          path: '/teachingMaterial/basic-dict/course-dict'
        },{
          id: '/teachingMaterial/basic-dict/unit-year',
          label: '学年',
          path: '/teachingMaterial/basic-dict/unit-year'
        },{
          id: '/teachingMaterial/basic-dict/course-type',
          label: '课程类型',
          path: '/teachingMaterial/basic-dict/course-type'
        },{
          id: '/teachingMaterial/basic-dict/training-level',
          label: '培养层次',
          path: '/teachingMaterial/basic-dict/training-level'
        },{
          id: '/teachingMaterial/basic-dict/teaching-type',
          label: '教材类型',
          path: '/teachingMaterial/basic-dict/teaching-type'
        }
      ]
    },
    {
      id: 'teachPurchase',
      label: '教材采购管理',
      icon: '&#xe66b;',
      children: [
        {
          id: '/teachingmaterial/teach-purchase/create-purchase',
          label: '生成采购计划',
          path: '/teachingmaterial/teach-purchase/create-purchase'
        },
        {
          id: '/teachingmaterial/teach-purchase/purchase-manage',
          label: '采购管理',
          path: '/teachingmaterial/teach-purchase/purchase-manage'
        }
      ]
    },
    {
      id: 'teachPutStorage',
      label: '教材入库管理',
      icon: '&#xe665;',
      children: [
        {
          id: '/teachingmaterial/teach-put-storage/put-storage',
          label: '入库管理',
          path: '/teachingmaterial/teach-put-storage/put-storage'
        }
      ]
    },
    {
      id: 'teachIssue',
      label: '教材发放管理',
      icon: '&#xe665;',
      children: [
        {
          id: '/teachingmaterial/teach-issue/alone-apply',
          label: '单独申报',
          path: '/teachingmaterial/teach-issue/alone-apply'
        },
        {
          id: '/teachingmaterial/teach-issue/teach-audit',
          label: '部门审核',
          path: '/teachingmaterial/teach-issue/teach-audit'
        },
        {
          id: '/teachingmaterial/teach-issue/many-audit',
          label: '多级申请审批',
          path: '/teachingmaterial/teach-issue/many-audit'
        },
        {
          id: '/teachingmaterial/teach-issue/put-report',
          label: '教务处报备',
          path: '/teachingmaterial/teach-issue/put-report'
        },
        {
          id: '/teachingmaterial/teach-issue/teach-issue',
          label: '教材发放',
          path: '/teachingmaterial/teach-issue/teach-issue'
        },
        {
          id: '/teachingmaterial/teach-issue/issue-list',
          label: '教材发放清单',
          path: '/teachingmaterial/teach-issue/issue-list'
        }
      ]
    },
    {
      id: 'teachingmaterial',
      label: '教材管理库存管理',
      icon: '&#xe641;',
      children: [
        {
          id: '/teachingmaterial/teaching-material-inventory/inventory-inquire',
          label: '教材库存查询',
          path: '/teachingmaterial/teaching-material-inventory/inventory-inquire'
        },
        {
          id: '/teachingmaterial/teaching-material-inventory/inventory',
          label: '教材库存盘点单',
          path: '/teachingmaterial/teaching-material-inventory/inventory'
        },
        {
          id: '/teachingmaterial/teaching-material-inventory/adjustment',
          label: '教材库存调整单',
          path: '/teachingmaterial/teaching-material-inventory/adjustment'
        }
      ]
    },
    {
      id: 'confidentialInformation',
      label: '保密资料管理',
      icon: '&#xe66d;',
      children: [
        {
          id: '/teachingmaterial/confidential-information/confidentiality-level',
          label: '保密级别管理',
          path: '/teachingmaterial/confidential-information/confidentiality-level'
        },
        {
          id: '/teachingmaterial/confidential-information/confidential-information-entry',
          label: '保密资料录入',
          path: '/teachingmaterial/confidential-information/confidential-information-entry'
        },
        {
          id: '/teachingmaterial/confidential-information/data-query',
          label: '资料查询',
          path: '/teachingmaterial/confidential-information/data-query'
        },
        {
          id: '/teachingmaterial/confidential-information/confidential-information-ledger',
          label: '保密资料台账',
          path: '/teachingmaterial/confidential-information/confidential-information-ledger'
        }
      ]
    }
  ]
}
export default menus
