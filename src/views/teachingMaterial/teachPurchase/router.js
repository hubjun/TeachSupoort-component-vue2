export const teachPurchase = [
    {
        path: '/teachingmaterial/teach-purchase/create-purchase', // 采购计划
        name: 'create-purchase',
        component: resolve => require(['@/views/teachingMaterial/teachPurchase/createPurchase.vue'], resolve),
        meta: {
            breadcrumb: ['教材管理', '教材采购管理', '采购计划'],
            requireAuth: true
        }
    },
    {
        path: '/teachingmaterial/teach-purchase/purchase-manage', // 采购管理
        name: 'purchase-manage',
        component: resolve => require(['@/views/teachingMaterial/teachPurchase/purchaseManage.vue'], resolve),
        meta: {
            breadcrumb: ['教材管理', '教材采购管理', '采购管理'],
            requireAuth: true
        }
    },
    {
        path: '/teachingmaterial/teach-purchase/purchase-manage-detail', // 采购信息
        name: 'purchase-manage-detail',
        component: resolve => require(['@/views/teachingMaterial/teachPurchase/purchaseManageDetail.vue'], resolve),
        meta: {
            breadcrumb: ['教材管理', '教材采购管理', '采购管理', '采购信息'],
            requireAuth: true
        }
    }
]
