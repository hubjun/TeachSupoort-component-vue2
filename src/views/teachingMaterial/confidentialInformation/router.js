export const confidentialInformation = [
  {
    path: '/teachingmaterial/confidential-information/confidentiality-level', // 保密级别管理
    name: 'confidentialitylevel',
    component: resolve => require(['@/views/teachingMaterial/confidentialInformation/confidentialityLevel.vue'], resolve),
    meta: {
      breadcrumb: ['教材管理', '保密资料管理', '保密级别管理'],
      requireAuth: true
    }
  },
  {
    path: '/teachingmaterial/confidential-information/confidentiality-level-detail', // 保密级别管理详情
    name: 'confidentialityleveldetail',
    component: resolve => require(['@/views/teachingMaterial/confidentialInformation/confidentialityLevelDetail.vue'], resolve),
    meta: {
      breadcrumb: ['教材管理', '保密资料管理', '保密级别管理详情'],
      requireAuth: true
    }
  },
  {
    path: '/teachingmaterial/confidential-information/confidential-information-entry', // 保密资料录入
    name: 'confidentialinformationentry',
    component: resolve => require(['@/views/teachingMaterial/confidentialInformation/confidentialInformationEntry.vue'], resolve),
    meta: {
      breadcrumb: ['教材管理', '保密资料管理', '保密资料录入'],
      requireAuth: true
    }
  },
  {
    path: '/teachingmaterial/confidential-information/data-query', // 资料查询
    name: 'dataquery',
    component: resolve => require(['@/views/teachingMaterial/confidentialInformation/dataQuery.vue'], resolve),
    meta: {
      breadcrumb: ['教材管理', '保密资料管理', '资料查询'],
      requireAuth: true
    }
  },
  {
    path: '/teachingmaterial/confidential-information/confidential-information-ledger', // 资料查询
    name: 'confidentialinformationledger',
    component: resolve => require(['@/views/teachingMaterial/confidentialInformation/confidentialInformationLedger.vue'], resolve),
    meta: {
      breadcrumb: ['教材管理', '保密资料管理', '保密资料台账'],
      requireAuth: true
    }
  },
  {
    path: '/teachingmaterial/confidential-information/confidential-information-ledger-detail', // 资料查询
    name: 'confidentialinformationledgerdetail',
    component: resolve => require(['@/views/teachingMaterial/confidentialInformation/confidentialInformationLedgerDetail.vue'], resolve),
    meta: {
      breadcrumb: ['教材管理', '保密资料管理', '保密资料台账详情'],
      requireAuth: true
    }
  }
]
