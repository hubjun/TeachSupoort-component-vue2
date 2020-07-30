export const login = [
    {
        path: '/login',   // 登录
        name: 'login',
        component: resolve => require(['@/views/login/Login.vue'], resolve)    // 路由懒加载
    }
]
