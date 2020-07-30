export const assetStanding = [
    {
        path: '/teachasset/asset-standing/parameter-manage', // 资产台账管理（管理部门）
        name: 'parameterManage',
        component: resolve => require(['@/views/teachAsset/assetStanding/parameterManage.vue'], resolve),
        meta: {
            breadcrumb: ['教学资产管理', '资产台账管理', '资产台账管理（管理部门）'],
            requireAuth: true
        }
    },
    {
        path: '/teachasset/asset-standing/parameter-manage-detail', // 资产台账管理（管理部门）信息
        name: 'parameterManageDetail',
        component: resolve => require(['@/views/teachAsset/assetStanding/parameterManageDetail.vue'], resolve),
        meta: {
            breadcrumb: ['教学资产管理', '资产台账管理', '资产台账管理（管理部门）', '资产台账管理（管理部门）信息'],
            requireAuth: true
        }
    },
    {
        path: '/teachasset/asset-standing/parameter-use', // 资产台账管理（使用部门）
        name: 'parameterUse',
        component: resolve => require(['@/views/teachAsset/assetStanding/parameterUse.vue'], resolve),
        meta: {
            breadcrumb: ['教学资产管理', '资产台账管理', '资产台账管理（使用部门）'],
            requireAuth: true
        }
    },
    {
        path: '/teachasset/asset-standing/parameter-use-detail', // 资产台账管理（使用部门）信息
        name: 'parameterUseDetail',
        component: resolve => require(['@/views/teachAsset/assetStanding/parameterUseDetail.vue'], resolve),
        meta: {
            breadcrumb: ['教学资产管理', '资产台账管理', '资产台账管理（管理部门）', '资产台账管理（管理部门）信息', '资产台账管理（使用部门）信息'],
            requireAuth: true
        }
    },
]
