export const teachingMaterialInventory = [
  {
    path: '/teachingmaterial/teaching-material-inventory/inventory-inquire', // 教材库存
    name: 'inventoryinquire',
    component: resolve => require(['@/views/teachingMaterial/teachingMaterialInventory/inventoryInquire.vue'], resolve),
    meta: {
      breadcrumb: ['教材管理', '教材库存管理', '教材库存查询'],
      requireAuth: true
    }
  },
  {
    path: '/teachingmaterial/teaching-material-inventory/inventory', // 教材盘点单
    name: 'inventory',
    component: resolve => require(['@/views/teachingMaterial/teachingMaterialInventory/inventory.vue'], resolve),
    meta: {
      breadcrumb: ['教材管理', '教材库存管理', '教材库存盘点单'],
      requireAuth: true
    }
  },
  {
    path: '/teachingmaterial/teaching-material-inventory/inventory-detail', // 教材盘点单详情
    name: 'inventorydetail',
    component: resolve => require(['@/views/teachingMaterial/teachingMaterialInventory/inventoryDetail.vue'], resolve),
    meta: {
      breadcrumb: ['教材管理', '教材库存管理', '教材库存盘点单详情'],
      requireAuth: true
    }
  },
  {
    path: '/teachingmaterial/teaching-material-inventory/adjustment', // 教材库存调整单
    name: 'adjustment',
    component: resolve => require(['@/views/teachingMaterial/teachingMaterialInventory/adjustment.vue'], resolve),
    meta: {
      breadcrumb: ['教材管理', '教材库存管理', '教材库存调整单'],
      requireAuth: true
    }
  },
  {
    path: '/teachingmaterial/teaching-material-inventory/adjustment-detail', // 教材库存调整单详情
    name: 'adjustmentdetail',
    component: resolve => require(['@/views/teachingMaterial/teachingMaterialInventory/adjustmentDetail.vue'], resolve),
    meta: {
      breadcrumb: ['教材管理', '教材库存管理', '教材库存调整单详情'],
      requireAuth: true
    }
  }
]
