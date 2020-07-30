export const standard = [
  {
    path: '/standardexpenses/standard/standard', // 标准经费管理
    name: 'standard',
    component: resolve => require(['@/views/standardExpenses/standard/Standard.vue'], resolve),
    meta: {
      breadcrumb: ['标准经费管理', '标准经费管理', '标准经费'],
      requireAuth: true
    }
  },
  {
    path: '/standardexpenses/standard/Standard-detail', // 标准经费管理详情
    name: 'Standarddetail',
    component: resolve => require(['@/views/standardExpenses/standard/StandardDetail.vue'], resolve),
    meta: {
      breadcrumb: ['标准经费管理', '标准经费管理', '标准经费管理详情'],
      requireAuth: true
    }
  }
]
