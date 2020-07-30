export const construct = [
  {
    path: '/projectconstruct/construct/construct', // 项目建设
    name: 'construct',
    component: resolve => require(['@/views/projectConstruct/construct/Construct.vue'], resolve),
    meta: {
      breadcrumb: ['项目建设管理', '项目建设管理', '项目建设'],
      requireAuth: true
    }
  },
  {
    path: '/projectconstruct/construct/construct-detail', // 项目建设详情
    name: 'constructdetail',
    component: resolve => require(['@/views/projectConstruct/construct/ConstructDetail.vue'], resolve),
    meta: {
      breadcrumb: ['项目建设管理', '项目建设管理', '项目建设详情'],
      requireAuth: true
    }
  },
  {
    path: '/projectconstruct/construct/construct-edit-detail', // 项目建设编辑
    name: 'constructeditdetail',
    component: resolve => require(['@/views/projectConstruct/construct/ConstructEditDetail.vue'], resolve),
    meta: {
      breadcrumb: ['项目建设管理', '项目建设管理', '项目建设编辑'],
      requireAuth: true
    }
  }
]
