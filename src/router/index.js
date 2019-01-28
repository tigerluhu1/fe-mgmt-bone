import Vue from 'vue'
import Router from 'vue-router'

import Ready from '@/views/Ready'

Vue.use(Router)
let router = new Router({
  scrollBehavior: () => {
    return {
      y: 0
    }
  },
  routes: [{
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue')
  }, {
    path: '/',
    name: 'app',
    redirect: '/home',
    component: Ready,
    children: [{
      path: '/home',
      name: 'home',
      meta: {
        title: 'home.pageTitle'
      },
      component: () => import('@/views/Home')
    }]
  }, {
    path: '/system',
    name: 'system',
    redirect: {
      name: 'user-management'
    },
    component: Ready,
    children: [{
      path: 'user',
      name: 'user-management',
      meta: {
        title: 'system_user.pageTitle'
      },
      component: () => import('@/views/system/user/list')
    }, {
      path: 'dictionary',
      name: 'dictionary-management',
      meta: {
        title: 'system_dict.pageTitle'
      },
      component: () => import('@/views/system/dictionary/list')
    }, {
      path: 'parameter',
      name: 'setting-management',
      meta: {
        title: 'system_parameter.pageTitle'
      },
      component: () => import('@/views/system/parameter/list')
    }, {
      path: 'role',
      name: 'sys_role',
      meta: {
        title: 'system_role.pageTitle'
      },
      component: () => import('@/views/system/role/list')
    }, {
      path: 'office',
      name: 'main_office',
      meta: {
        title: 'system_office.pageTitle'
      },
      component: () => import('@/views/system/office/list')
    }, {
      path: 'department',
      name: 'dept-management',
      meta: {
        title: 'system_department.pageTitle'
      },
      component: () => import('@/views/system/department/list')
    }, {
      path: 'menu',
      name: 'menu-management',
      meta: {
        title: 'system_menu.pageTitle'
      },
      component: () => import('@/views/system/menu/list')
    }]
  }]
})

router.afterEach(to => {
  let app = router.app
  app.$store.dispatch('openNewPage', to)
})

export default router
