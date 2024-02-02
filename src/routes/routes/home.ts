import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'HomePage',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/withdrawal',
    name: 'WithdrawalPage',
    component: () => import('@/views/Withdrawal.vue')
  },
  {
    path: '/details',
    name: 'DetailsPage',
    component: () => import('@/views/Details.vue')
  }
]

export default routes
