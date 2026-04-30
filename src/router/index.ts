import { createRouter, createWebHistory } from 'vue-router'
import Drinks from '../views/Drinks.vue'
import Login from '../views/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Drinks
    },
    {
      path: '/drinks',
      redirect: '/'
    },
    {
      path: '/equipments',
      name: 'equipments',
      component: () => import('../views/Equipments.vue')
    },
    {
      path: '/service',
      name: 'service',
      component: () => import('../views/Service.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/Admin.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/info',
      name: 'info',
      component: () => import('../views/Info.vue')
    }
  ]
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('admin-token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router