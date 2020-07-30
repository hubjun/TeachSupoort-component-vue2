export const baseDict = [
  {
    path: '/teachasset/base-dict/asset-type', // 资产类型
    name: 'assettype',
    component: resolve => require(['@/views/teachAsset/baseDict/AssetType.vue'], resolve),
    meta: {
      breadcrumb: ['教学资产管理', '基础字典管理', '资产类型'],
      requireAuth: true
    }
  },
  {
    path: '/teachasset/base-dict/asset-type-detail', // 资产类型详情
    name: 'assettypedetail',
    component: resolve => require(['@/views/teachAsset/baseDict/AssetTypeDetail.vue'], resolve),
    meta: {
      breadcrumb: ['教学资产管理', '基础字典管理', '资产类型详情'],
      requireAuth: true
    }
  },
  {
    path: '/teachasset/base-dict/unit-measure', // 计量单位
    name: 'unitmeasure',
    component: resolve => require(['@/views/teachAsset/baseDict/UnitMeasure.vue'], resolve),
    meta: {
      breadcrumb: ['教学资产管理', '基础字典管理', '计量单位'],
      requireAuth: true
    }
  },
  {
    path: '/teachasset/base-dict/unit-measure-detail', // 计量单位详情
    name: 'unitmeasuredetail',
    component: resolve => require(['@/views/teachAsset/baseDict/UnitMeasureDetail.vue'], resolve),
    meta: {
      breadcrumb: ['教学资产管理', '基础字典管理', '计量单位详情'],
      requireAuth: true
    }
  },
  {
    path: '/teachasset/base-dict/depart', // 部门
    name: 'depart',
    component: resolve => require(['@/views/teachAsset/baseDict/Depart.vue'], resolve),
    meta: {
      breadcrumb: ['教学资产管理', '基础字典管理', '部门'],
      requireAuth: true
    }
  },
  {
    path: '/teachasset/base-dict/depart-detail', // 部门详情
    name: 'departdetail',
    component: resolve => require(['@/views/teachAsset/baseDict/DepartDetail.vue'], resolve),
    meta: {
      breadcrumb: ['教学资产管理', '基础字典管理', '部门详情'],
      requireAuth: true
    }
  },
  {
    path: '/teachasset/base-dict/asset-status', // 资产状态
    name: 'assetstatus',
    component: resolve => require(['@/views/teachAsset/baseDict/AssetStatus.vue'], resolve),
    meta: {
      breadcrumb: ['教学资产管理', '基础字典管理', '资产状态'],
      requireAuth: true
    }
  },
  {
    path: '/teachasset/base-dict/asset-status-detail', // 资产状态详情
    name: 'assetstatusdetail',
    component: resolve => require(['@/views/teachAsset/baseDict/AssetStatusDetail.vue'], resolve),
    meta: {
      breadcrumb: ['教学资产管理', '基础字典管理', '资产状态详情'],
      requireAuth: true
    }
  },
  {
    path: '/teachasset/base-dict/asset-source', // 资产来源
    name: 'assetsource',
    component: resolve => require(['@/views/teachAsset/baseDict/AssetSource.vue'], resolve),
    meta: {
      breadcrumb: ['教学资产管理', '基础字典管理', '资产来源'],
      requireAuth: true
    }
  },
  {
    path: '/teachasset/base-dict/asset-source-detail', // 资产来源详情
    name: 'assetsourcedetail',
    component: resolve => require(['@/views/teachAsset/baseDict/AssetSourceDetail.vue'], resolve),
    meta: {
      breadcrumb: ['教学资产管理', '基础字典管理', '资产来源详情'],
      requireAuth: true
    }
  }
]
