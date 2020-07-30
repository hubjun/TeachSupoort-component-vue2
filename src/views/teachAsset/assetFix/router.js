export const assetFix = [
  {
    path: '/teachasset/asset-fix/asset-fix', // 资产维修记录
    name: 'AssetFix',
    component: resolve => require(['@/views/teachAsset/assetFix/AssetFix.vue'], resolve),
    meta: {
      breadcrumb: ['教学资产管理', '资产维修保养管理', '资产维修记录'],
      requireAuth: true
    }
  },
  {
    path: '/teachasset/asset-fix/asset-fix-detail', // 资产维修记录详情
    name: 'AssetFixDetail',
    component: resolve => require(['@/views/teachAsset/assetFix/AssetFixDetail.vue'], resolve),
    meta: {
      breadcrumb: ['教学资产管理', '资产维修保养管理', '资产维修记录详情'],
      requireAuth: true
    }
  }
]
