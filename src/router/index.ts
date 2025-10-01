import { useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'login', component: () => import('../pages/Login.vue') },
    { path: '/', component: () => import('../pages/Home.vue') },
    {
      path: '/products/:id',
      name: 'product-detail',
      component: () => import('@/pages/ProductDetail.vue'),
    },
    { path: '/products', name: 'products', component: () => import('@/pages/ProductsList.vue') },
    {
      path: '/coming-soon',
      name: 'coming-soon',
      component: () => import('@/pages/OnProgress.vue'),
      meta: { hideLayout: false },
    },
    { path: '/cart', name: 'cart', component: () => import('@/pages/Cart.vue') },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
