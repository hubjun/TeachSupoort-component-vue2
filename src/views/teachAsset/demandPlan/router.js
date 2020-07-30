export const demandPlan = [
  {
    path: '/teachasset/demand-plan/demand-approve', // 教学资产需求申报
    name: 'demandapprove',
    component: resolve => require(['@/views/teachAsset/demandPlan/DemandApprove.vue'], resolve),
    meta: {
      breadcrumb: ['教学资产管理', '需求计划管理', '教学资产需求申报'],
      requireAuth: true
    }
  },
  {
    path: '/teachasset/demand-plan/demand-approve-detail', // 教学资产需求申报详情
    name: 'demandapprovedetail',
    component: resolve => require(['@/views/teachAsset/demandPlan/DemandApproveDetail.vue'], resolve),
    meta: {
      breadcrumb: ['教学资产管理', '需求计划管理', '教学资产需求申报详情'],
      requireAuth: true
    }
  },
  {
    path: '/teachasset/demand-plan/demand-audit', // 单位审批
    name: 'demandaudit',
    component: resolve => require(['@/views/teachAsset/demandPlan/DemandAudit.vue'], resolve),
    meta: {
      breadcrumb: ['教学资产管理', '需求计划管理', '单位审批'],
      requireAuth: true
    }
  },
  {
    path: '/teachasset/demand-plan/demand-audit-detail', // 单位审批详情
    name: 'demandauditdetail',
    component: resolve => require(['@/views/teachAsset/demandPlan/DemandAuditDetail.vue'], resolve),
    meta: {
      breadcrumb: ['教学资产管理', '需求计划管理', '单位审批详情'],
      requireAuth: true
    }
  },
  {
    path: '/teachasset/demand-plan/demand-declare', // 教保处审批
    name: 'demanddeclare',
    component: resolve => require(['@/views/teachAsset/demandPlan/DemandDeclare.vue'], resolve),
    meta: {
      breadcrumb: ['教学资产管理', '需求计划管理', '教保处审批'],
      requireAuth: true
    }
  },
  {
    path: '/teachasset/demand-plan/demand-declare-detail', // 教保处审批详情
    name: 'demanddeclaredetail',
    component: resolve => require(['@/views/teachAsset/demandPlan/DemandDeclareDetail.vue'], resolve),
    meta: {
      breadcrumb: ['教学资产管理', '需求计划管理', '教保处审批详情'],
      requireAuth: true
    }
  }
]
