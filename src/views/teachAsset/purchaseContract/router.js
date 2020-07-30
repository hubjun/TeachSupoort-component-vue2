export const purchaseContract = [
  {
    path: '/teachasset/purchase-contract/supplier',
    name: 'supplier',
    component: resolve => require(['@/views/teachAsset/purchaseContract/Supplier.vue'], resolve),
    meta: {
      breadcrumb: ['教学资产管理', '采购合同管理', '供应商管理'],
      requireAuth: true
    }
  },
  {
    path: '/teachasset/purchase-contract/supplier-detail',
    name: 'supplierdetail',
    component: resolve => require(['@/views/teachAsset/purchaseContract/SupplierDetail.vue'], resolve),
    meta: {
      breadcrumb: ['教学资产管理', '采购合同管理', '供应商管理详情'],
      requireAuth: true
    }
  },
  {
    path: '/teachasset/purchase-contract/purchase-contract',
    name: 'purchasecontract',
    component: resolve => require(['@/views/teachAsset/purchaseContract/PurchaseContract.vue'], resolve),
    meta: {
      breadcrumb: ['教学资产管理', '采购合同管理', '采购合同'],
      requireAuth: true
    }
  },
  {
    path: '/teachasset/purchase-contract/purchase-contract-detail',
    name: 'purchasecontractdetail',
    component: resolve => require(['@/views/teachAsset/purchaseContract/PurchaseContractDetail.vue'], resolve),
    meta: {
      breadcrumb: ['教学资产管理', '采购合同管理', '采购合同详情'],
      requireAuth: true
    }
  }
]
