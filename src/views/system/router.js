export const system = [
    {
        path: '/system/user', // 用户管理
        name: 'user',
        component: resolve => require(['@/views/system/user.vue'], resolve),
        meta: {
            breadcrumb: ['系统管理', '用户管理'],
            requireAuth: true
        }
    },
    {
        path: '/system/role', // 角色权限
        name: 'role',
        component: resolve => require(['@/views/system/role.vue'], resolve),
        meta: {
            breadcrumb: ['系统管理', '角色权限'],
            requireAuth: true
        }
    },
    {
        path: '/system/menu', // 菜单管理
        name: 'role',
        component: resolve => require(['@/views/system/menu.vue'], resolve),
        meta: {
            breadcrumb: ['系统管理', '菜单管理'],
            requireAuth: true
        }
    },
    {
        path: '/system/logManage', // 系统日志
        name: 'logManage',
        component: resolve => require(['@/views/system/logManage.vue'], resolve),
        meta: {
            breadcrumb: ['系统管理', '系统日志'],
            requireAuth: true
        }
    },
    {
        path: '/system/depart', // 部门管理
        name: 'log',
        component: resolve => require(['@/views/system/depart.vue'], resolve),
        meta: {
            breadcrumb: ['系统管理', '部门管理'],
            requireAuth: true
        }
    },
    {
        path: '/system/loginManage', // 登录管理
        name: 'loginManage',
        component: resolve => require(['@/views/system/loginManage.vue'], resolve),
        meta: {
            breadcrumb: ['系统管理', '登录管理'],
            requireAuth: true
        }
    }
]
