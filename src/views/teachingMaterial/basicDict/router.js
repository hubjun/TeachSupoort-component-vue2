export const basicDict = [
    {
      path: '/teachingMaterial/basic-dict/asset-type', // 选用方式
      name: 'assettype',
      component: resolve => require(['@/views/teachingMaterial/basicDict/AssetType.vue'], resolve),
      meta: {
        breadcrumb: ['教材管理', '基础字典管理', '选用方式'],
        requireAuth: true
      }
    },
    {
      path: '/teachingMaterial/basic-dict/asset-type-detail', // 选用方式详情
      name: 'assettypedetail',
      component: resolve => require(['@/views/teachingMaterial/basicDict/AssetTypeDetail.vue'], resolve),
      meta: {
        breadcrumb: ['教材管理', '基础字典管理', '选用方式详情'],
        requireAuth: true
      }
    },
    {
      path: '/teachingMaterial/basic-dict/course-dict',
      name: 'coursedict',
      component: resolve => require(['@/views/teachingMaterial/basicDict/CourseDict.vue'], resolve),
      meta: {
        breadcrumb: ['教材管理', '基础字典管理', '课程字典'],
        requireAuth: true
      }
    },
    {
      path: '/teachingMaterial/basic-dict/course-dict-detail',
      name: 'coursedictdetail',
      component: resolve => require(['@/views/teachingMaterial/basicDict/CourseDictDetail.vue'], resolve),
      meta: {
        breadcrumb: ['教材管理', '基础字典管理', '课程字典详情'],
        requireAuth: true
      }
    },
    {
      path: '/teachingMaterial/basic-dict/unit-year', // 学年
      name: 'unityear',
      component: resolve => require(['@/views/teachingMaterial/basicDict/UnitYear.vue'], resolve),
      meta: {
        breadcrumb: ['教材管理', '基础字典管理', '学年字典'],
        requireAuth: true
      }
    },
    {
        path: '/teachingMaterial/basic-dict/unit-year-detail', // 学年详情
        name: 'unityeardetail',
        component: resolve => require(['@/views/teachingMaterial/basicDict/UnitYearDetail.vue'], resolve),
        meta: {
          breadcrumb: ['教材管理', '基础字典管理', '学年详情'],
          requireAuth: true
        }
    },
    {
      path: '/teachingMaterial/basic-dict/course-type', // 课程类型
      name: 'coursetype',
      component: resolve => require(['@/views/teachingMaterial/basicDict/CourseType.vue'], resolve),
      meta: {
        breadcrumb: ['教材管理', '基础字典管理', '课程类型'],
        requireAuth: true
      }
    },
    {
        path: '/teachingMaterial/basic-dict/course-type-detail', // 课程类型详情
        name: 'coursetypedetail',
        component: resolve => require(['@/views/teachingMaterial/basicDict/CourseTypeDetail.vue'], resolve),
        meta: {
          breadcrumb: ['教材管理', '基础字典管理', '课程类型详情'],
          requireAuth: true
        }
      },
    {
      path: '/teachingMaterial/basic-dict/training-level', // 培养层次
      name: 'traininglevel',
      component: resolve => require(['@/views/teachingMaterial/basicDict/TrainingLevel.vue'], resolve),
      meta: {
        breadcrumb: ['教材管理', '基础字典管理', '培养层次'],
        requireAuth: true
      }
    },
    {
        path: '/teachingMaterial/basic-dict/training-level-detail', // 培养层次详情
        name: 'trainingleveldeail',
        component: resolve => require(['@/views/teachingMaterial/basicDict/TrainingLevelDetail.vue'], resolve),
        meta: {
          breadcrumb: ['教材管理', '基础字典管理', '培养层次详情'],
          requireAuth: true
        }
      },
    {
      path: '/teachingMaterial/basic-dict/teaching-type', // 教材类型
      name: 'teachingtype',
      component: resolve => require(['@/views/teachingMaterial/basicDict/TeachingType.vue'], resolve),
      meta: {
        breadcrumb: ['教材管理', '基础字典管理', '教材类型'],
        requireAuth: true
      }
    },
    {
        path: '/teachingMaterial/basic-dict/teaching-type-detail', // 教材类型详情
        name: 'teachingtypedetail',
        component: resolve => require(['@/views/teachingMaterial/basicDict/TeachingTypeDetail.vue'], resolve),
        meta: {
          breadcrumb: ['教材管理', '基础字典管理', '教材类型详情'],
          requireAuth: true
        }
      }
  ]
