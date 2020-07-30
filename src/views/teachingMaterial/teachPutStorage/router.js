export const teachPutStorage = [
    {
        path: '/teachingmaterial/teach-put-storage/put-storage', // 入库管理
        name: 'put-storage',
        component: resolve => require(['@/views/teachingMaterial/teachPutStorage/putStorage.vue'], resolve),
        meta: {
            breadcrumb: ['教材管理', '教材入库管理', '入库管理'],
            requireAuth: true
        }
    },
    {
        path: '/teachingmaterial/teach-put-storage/put-storage-detail', // 入库管理信息
        name: 'put-storage-detail',
        component: resolve => require(['@/views/teachingMaterial/teachPutStorage/putStorageDetail.vue'], resolve),
        meta: {
            breadcrumb: ['教材管理', '教材入库管理', '入库管理', '入库管理信息'],
            requireAuth: true
        }
    }
]
