export const assetCollect = [
    {
        path: '/teachasset/asset-collect/asset-collect-apply', // 资产领用申请
        name: 'asset-collect-apply',
        component: resolve => require(['@/views/teachAsset/assetCollect/assetCollectApply.vue'], resolve),
        meta: {
            breadcrumb: ['教学资产管理', '资产领用管理', '资产领用申请'],
            requireAuth: true
        }
    },
    {
        path: '/teachasset/asset-collect/asset-collect-apply-detail', // 资产领用申请信息
        name: 'asset-collect-apply-detail',
        component: resolve => require(['@/views/teachAsset/assetCollect/assetCollectApplyDetail.vue'], resolve),
        meta: {
            breadcrumb: ['教学资产管理', '资产领用管理', '资产领用申请', '资产领用申请信息'],
            requireAuth: true
        }
    },
    {
        path: '/teachasset/asset-collect/asset-collect-audit', // 资产领用审核
        name: 'asset-collect-audit',
        component: resolve => require(['@/views/teachAsset/assetCollect/assetCollectAudit.vue'], resolve),
        meta: {
            breadcrumb: ['教学资产管理', '资产领用管理', '资产领用审核'],
            requireAuth: true
        }
    },
    {
        path: '/teachasset/asset-collect/asset-collect-audit-detail', // 资产领用审核信息
        name: 'asset-collect-audit-detail',
        component: resolve => require(['@/views/teachAsset/assetCollect/assetCollectAuditDetail.vue'], resolve),
        meta: {
            breadcrumb: ['教学资产管理', '资产领用管理', '资产领用审核', '资产领用审核信息'],
            requireAuth: true
        }
    }
]
