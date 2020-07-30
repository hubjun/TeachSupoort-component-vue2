export const assetAllocation = [
  {
    path: '/teachasset/asset-allocation/allocation-apply', // 资产调拨申请单
    name: 'allocationapply',
    component: resolve => require(['@/views/teachAsset/assetAllocation/AllocationApply.vue'], resolve),
    meta: {
      breadcrumb: ['教学资产管理', '资产调拨管理', '资产调拨申请'],
      requireAuth: true
    }
  },
  {
    path: '/teachasset/asset-allocation/allocation-apply-detail', // 资产调拨申请单详情
    name: 'allocationapplydetail',
    component: resolve => require(['@/views/teachAsset/assetAllocation/AllocationApplyDetail.vue'], resolve),
    meta: {
      breadcrumb: ['教学资产管理', '资产调拨管理', '资产调拨申请详情'],
      requireAuth: true
    }
  },
  {
    path: '/teachasset/asset-allocation/allocation-confirm', // 资产调拨审核
    name: 'allocationconfirm',
    component: resolve => require(['@/views/teachAsset/assetAllocation/AllocationConfirm.vue'], resolve),
    meta: {
      breadcrumb: ['教学资产管理', '资产调拨管理', '资产调拨审核'],
      requireAuth: true
    }
  },
  {
    path: '/teachasset/asset-allocation/allocation-confirm-detail', // 资产调拨审核单详情
    name: 'allocationconfirmdetail',
    component: resolve => require(['@/views/teachAsset/assetAllocation/AllocationConfirmDetail.vue'], resolve),
    meta: {
      breadcrumb: ['教学资产管理', '资产调拨管理', '资产调拨审核详情'],
      requireAuth: true
    }
  },
  {
    path: '/teachasset/asset-allocation/allocation-exam', // 资产调拨审批
    name: 'allocationexam',
    component: resolve => require(['@/views/teachAsset/assetAllocation/AllocationExam.vue'], resolve),
    meta: {
      breadcrumb: ['教学资产管理', '资产调拨管理', '资产调拨审批'],
      requireAuth: true
    }
  },
  {
    path: '/teachasset/asset-allocation/allocation-exam-detail', // 资产调拨审批详情
    name: 'allocationexamdetail',
    component: resolve => require(['@/views/teachAsset/assetAllocation/AllocationExamDetail.vue'], resolve),
    meta: {
      breadcrumb: ['教学资产管理', '资产调拨管理', '资产调拨审批详情'],
      requireAuth: true
    }
  }
]
