export const teachIssue = [
    {
        path: '/teachingmaterial/teach-issue/alone-apply', // 单独申报
        name: 'alone-apply',
        component: resolve => require(['@/views/teachingMaterial/teachIssue/aloneApply.vue'], resolve),
        meta: {
            breadcrumb: ['教材管理', '教材发放管理', '单独申报'],
            requireAuth: true
        }
    },
    {
        path: '/teachingmaterial/teach-issue/alone-apply-detail', // 单独申报信息
        name: 'alone-apply-detail',
        component: resolve => require(['@/views/teachingMaterial/teachIssue/aloneApplyDetail.vue'], resolve),
        meta: {
            breadcrumb: ['教材管理', '教材发放管理', '单独申报信息'],
            requireAuth: true
        }
    },
    {
        path: '/teachingmaterial/teach-issue/teach-audit', // 部门审核
        name: 'teach-audit',
        component: resolve => require(['@/views/teachingMaterial/teachIssue/teachAudit.vue'], resolve),
        meta: {
            breadcrumb: ['教材管理', '教材发放管理', '部门审核'],
            requireAuth: true
        }
    },
    {
        path: '/teachingmaterial/teach-issue/teach-audit-detail', // 部门审核信息
        name: 'teach-audit-detail',
        component: resolve => require(['@/views/teachingMaterial/teachIssue/teachAuditDetail.vue'], resolve),
        meta: {
            breadcrumb: ['教材管理', '教材发放管理', '部门审核', '部门审核信息'],
            requireAuth: true
        }
    },
    {
        path: '/teachingmaterial/teach-issue/many-audit', // 多级申请审批
        name: 'many-audit',
        component: resolve => require(['@/views/teachingMaterial/teachIssue/manyAudit.vue'], resolve),
        meta: {
            breadcrumb: ['教材管理', '教材发放管理', '多级申请审批'],
            requireAuth: true
        }
    },
    {
        path: '/teachingmaterial/teach-issue/many-audit-detail', // 多级申请审批信息
        name: 'many-audit-detail',
        component: resolve => require(['@/views/teachingMaterial/teachIssue/manyAuditDetail.vue'], resolve),
        meta: {
            breadcrumb: ['教材管理', '教材发放管理', '多级申请审批', '多级申请审批信息'],
            requireAuth: true
        }
    },
    {
        path: '/teachingmaterial/teach-issue/put-report', // 教务处报备
        name: 'put-report',
        component: resolve => require(['@/views/teachingMaterial/teachIssue/putReport.vue'], resolve),
        meta: {
            breadcrumb: ['教材管理', '教材发放管理', '教务处报备'],
            requireAuth: true
        }
    },
    {
        path: '/teachingmaterial/teach-issue/put-report-detail', // 教务处报备信息
        name: 'put-report-detail',
        component: resolve => require(['@/views/teachingMaterial/teachIssue/putReportDetail.vue'], resolve),
        meta: {
            breadcrumb: ['教材管理', '教材发放管理', '教务处报备', '教务处报备信息'],
            requireAuth: true
        }
    },
    {
        path: '/teachingmaterial/teach-issue/teach-issue', // 教材发放
        name: 'teach-issue',
        component: resolve => require(['@/views/teachingMaterial/teachIssue/teachIssue.vue'], resolve),
        meta: {
            breadcrumb: ['教材管理', '教材发放管理', '教材发放'],
            requireAuth: true
        }
    },
    {
        path: '/teachingmaterial/teach-issue/teach-issue-detail', // 教材发放信息
        name: 'teach-issue-detail',
        component: resolve => require(['@/views/teachingMaterial/teachIssue/teachIssueDetail.vue'], resolve),
        meta: {
            breadcrumb: ['教材管理', '教材发放管理', '教材发放', '教材发放信息'],
            requireAuth: true
        }
    },
    {
        path: '/teachingmaterial/teach-issue/issue-list', // 教材发放清单
        name: 'issue-list',
        component: resolve => require(['@/views/teachingMaterial/teachIssue/issueList.vue'], resolve),
        meta: {
            breadcrumb: ['教材管理', '教材发放管理', '教材发放清单'],
            requireAuth: true
        }
    }
]
