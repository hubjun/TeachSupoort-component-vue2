export const assetCheck = [
  {
    path: '/teachasset/asset-check/check-plan-create', // 资产清查计划生成
    name: 'checkPlanCreate',
    component: resolve => require(['@/views/teachAsset/assetCheck/CheckPlanCreate.vue'], resolve),
    meta: {
      breadcrumb: ['教学资产管理', '资产清查管理', '资产清查计划生成'],
      requireAuth: true
    }
  },
  {
    path: '/teachasset/asset-check/check-plan-form', // 资产盘点单
    name: 'checkPlanForm',
    component: resolve => require(['@/views/teachAsset/assetCheck/CheckPlanForm.vue'], resolve),
    meta: {
      breadcrumb: ['教学资产管理', '资产清查管理', '资产盘点单'],
      requireAuth: true
    }
  },
  {
    path: '/teachasset/asset-check/check-plan-form-detail', // 资产盘点单详情
    name: 'checkPlanFormDetail',
    component: resolve => require(['@/views/teachAsset/assetCheck/CheckPlanFormDetail.vue'], resolve),
    meta: {
      breadcrumb: ['教学资产管理', '资产清查管理', '资产盘点单详情'],
      requireAuth: true
    }
  }
]
