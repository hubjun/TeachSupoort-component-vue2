export const assetHandle = [
  {
    path: '/teachasset/asset-handle/asset-scrap-apply', // 资产报废申请
    name: 'AssetScrapApply',
    component: resolve => require(['@/views/teachAsset/assetHandle/AssetScrapApply.vue'], resolve),
    meta: {
      breadcrumb: ['教学资产管理', '资产处置管理', '资产报废申请'],
      requireAuth: true
    }
  },
  {
    path: '/teachasset/asset-handle/asset-scrap-apply-detail', // 资产报废申请详情
    name: 'AssetScrapApplyDetail',
    component: resolve => require(['@/views/teachAsset/assetHandle/AssetScrapApplyDetail.vue'], resolve),
    meta: {
      breadcrumb: ['教学资产管理', '资产处置管理', '资产报废申请详情'],
      requireAuth: true
    }
  },
  {
    path: '/teachasset/asset-handle/asset-scrap-exam', // 资产报废审批
    name: 'AssetScrapExam',
    component: resolve => require(['@/views/teachAsset/assetHandle/AssetScrapExam.vue'], resolve),
    meta: {
      breadcrumb: ['教学资产管理', '资产处置管理', '资产报废审核'],
      requireAuth: true
    }
  },
  {
    path: '/teachasset/asset-handle/asset-scrap-exam-detail', // 资产报废审批详情
    name: 'AssetScrapExamDetail',
    component: resolve => require(['@/views/teachAsset/assetHandle/AssetScrapExamDetail.vue'], resolve),
    meta: {
      breadcrumb: ['教学资产管理', '资产处置管理', '资产报废审核详情'],
      requireAuth: true
    }
  },
  {
    path: '/teachasset/asset-handle/asset-scrap-register', // 资产报废登记
    name: 'AssetScrapRegister',
    component: resolve => require(['@/views/teachAsset/assetHandle/AssetScrapRegister.vue'], resolve),
    meta: {
      breadcrumb: ['教学资产管理', '资产处置管理', '资产报废登记'],
      requireAuth: true
    }
  },
  {
    path: '/teachasset/asset-handle/asset-scrap-register-detail', // 资产报废登记详情
    name: 'AssetScrapRegisterDetail',
    component: resolve => require(['@/views/teachAsset/assetHandle/AssetScrapRegisterDetail.vue'], resolve),
    meta: {
      breadcrumb: ['教学资产管理', '资产处置管理', '资产报废登记详情'],
      requireAuth: true
    }
  },
  {
    path: '/teachasset/asset-handle/asset-abort-handle', // 异常处置
    name: 'AssetAbortHandle',
    component: resolve => require(['@/views/teachAsset/assetHandle/AssetAbortHandle.vue'], resolve),
    meta: {
      breadcrumb: ['教学资产管理', '资产处置管理', '异常处置'],
      requireAuth: true
    }
  },
  {
    path: '/teachasset/asset-handle/asset-abort-handle-detail', // 异常处置详情
    name: 'AssetAbortHandleDetail',
    component: resolve => require(['@/views/teachAsset/assetHandle/AssetAbortHandleDetail.vue'], resolve),
    meta: {
      breadcrumb: ['教学资产管理', '资产处置管理', '异常处置详情'],
      requireAuth: true
    }
  }
]
