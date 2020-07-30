export const purchasePlan = [
  {
    path: '/teachasset/purchase-plan/centralized-processing',
    name: 'centralizedprocessing',
    component: resolve => require(['@/views/teachAsset/purchasePlan/CentralizedProcessing.vue'], resolve),
    meta: {
      breadcrumb: ['教学资产管理', '采购计划管理', '集中处理需求计划'],
      requireAuth: true
    }
  },
  {
    path: '/teachasset/purchase-plan/purchase-plan',
    name: 'purchaseplan',
    component: resolve => require(['@/views/teachAsset/purchasePlan/PurchasePlan.vue'], resolve),
    meta: {
      breadcrumb: ['教学资产管理', '采购计划管理', '采购计划'],
      requireAuth: true
    }
  },
  {
    path: '/teachasset/purchase-plan/purchase-plan-detail',
    name: 'purchaseplandetail',
    component: resolve => require(['@/views/teachAsset/purchasePlan/PurchasePlanDetail.vue'], resolve),
    meta: {
      breadcrumb: ['教学资产管理', '采购计划管理', '采购计划详情'],
      requireAuth: true
    }
  },
  {
    path: '/teachasset/purchase-plan/purchase-plan-audit',
    name: 'purchaseplanaudit',
    component: resolve => require(['@/views/teachAsset/purchasePlan/PurchasePlanAudit.vue'], resolve),
    meta: {
      breadcrumb: ['教学资产管理', '采购计划管理', '采购计划审核'],
      requireAuth: true
    }
  },
  {
    path: '/teachasset/purchase-plan/purchase-plan-audit-detail',
    name: 'purchaseplanauditdetail',
    component: resolve => require(['@/views/teachAsset/purchasePlan/PurchasePlanAuditDetail.vue'], resolve),
    meta: {
      breadcrumb: ['教学资产管理', '采购计划管理', '采购计划审核详情'],
      requireAuth: true
    }
  }
]
