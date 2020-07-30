import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/home/Index.vue'
import Demo from '../views/demo/Index.vue'
import Demo2 from '../views/demo/Index2.vue'

import { login } from '@/views/login/router.js'

import { teachAsset } from '../views/teachAsset/router'; // 教务资产管理
import { projectConstruct } from '../views/projectConstruct/router'; // 项目建设管理
import { system } from '../views/system/router' // 系统管理
import { standard } from '../views/standardExpenses/standard/router'; // 项目建设管理
import { teachingMaterial } from '../views/teachingMaterial/router'; // 教材管理

Vue.use(Router)

/**
 * 重写路由的push方法
 */
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}

const routes = [

  {
    path: '*',
    redirect: '/login'
  },
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      requireAuth: true
    },
    children: [
      {
        path: '/demo',
        name: 'demo',
        component: Demo,
        meta: {
          title: 'demo页面'
        }
      },
      {
        path: '/demo2',
        name: 'demo2',
        component: Demo2,
        meta: {
          title: 'demo页面2'
        }
      },
      ...teachAsset,
      ...projectConstruct,
      ...system,
      ...standard,
      ...teachingMaterial
    ]
  },
  ...login
]
let router = new Router({
  routes
})
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    const token = sessionStorage.getItem('TOKEN');
    if (token) {
      next();
    } else {
      next({ path: '/login' });
      // store.dispatch('Logout', token);
    }
  } else {
    next();
  }
});
router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  const targetPath = router.history.pending.fullPath;
  if (isChunkLoadFailed) {
    router.replace(targetPath);
  }
});
export default router
