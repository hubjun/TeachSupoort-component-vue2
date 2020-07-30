export const assetDepreciation = [
  {
    path: '/teachasset/asset-depreciation/depreciation-way', // 折旧方法
    name: 'depreciationway',
    component: resolve => require(['@/views/teachAsset/assetDepreciation/DepreciationWay.vue'], resolve),
    meta: {
      breadcrumb: ['教学资产管理', '资产折旧管理', '折旧方法'],
      requireAuth: true
    }
  },
  {
    path: '/teachasset/asset-depreciation/depreciation-way-detail', // 折旧方法详情
    name: 'depreciationwaydetail',
    component: resolve => require(['@/views/teachAsset/assetDepreciation/DepreciationWayDetail.vue'], resolve),
    meta: {
      breadcrumb: ['教学资产管理', '资产折旧管理', '折旧方法详情'],
      requireAuth: true
    }
  },
  {
    path: '/teachasset/asset-depreciation/provision-depreciation', // 计提折旧
    name: 'provisiondepreciation',
    component: resolve => require(['@/views/teachAsset/assetDepreciation/ProvisionDepreciation.vue'], resolve),
    meta: {
      breadcrumb: ['教学资产管理', '资产折旧管理', '计提折旧'],
      requireAuth: true
    }
  }
]
