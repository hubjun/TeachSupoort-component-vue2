export const assetTransfer = [
    {
        path: '/teachasset/asset-transfer/asset-hand-over', // 资产移交
        name: 'parameterManage',
        component: resolve => require(['@/views/teachAsset/assetTransfer/assetHandOver.vue'], resolve),
        meta: {
            breadcrumb: ['教学资产管理', '资产移交管理', '资产移交'],
            requireAuth: true
        }
    },
    {
        path: '/teachasset/asset-transfer/asset-hand-over-detail', // 资产移交信息
        name: 'parameterManage',
        component: resolve => require(['@/views/teachAsset/assetTransfer/assetHandOverDetail.vue'], resolve),
        meta: {
            breadcrumb: ['教学资产管理', '资产移交管理', '资产移交', '资产移交信息'],
            requireAuth: true
        }
    }
]
