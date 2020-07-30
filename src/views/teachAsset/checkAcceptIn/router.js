export const checkAcceptIn = [
    {
        path: '/teachasset/check-accept-in/asset-accept', // 资产验收建账
        name: 'asset-accept',
        component: resolve => require(['@/views/teachAsset/checkAcceptIn/assetAccept.vue'], resolve),
        meta: {
            breadcrumb: ['教学资产管理', '验收入账管理', '资产验收建账'],
            requireAuth: true
        }
    },
    {
        path: '/teachasset/check-accept-in/asset-accept-detail', // 资产验收建账
        name: 'asset-accept-detail',
        component: resolve => require(['@/views/teachAsset/checkAcceptIn/assetacceptDetail.vue'], resolve),
        meta: {
            breadcrumb: ['教学资产管理', '验收入账管理', '资产验收建账'],
            requireAuth: true
        }
    }
]
