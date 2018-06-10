import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/Dashboard'

Vue.use(Router)

export default new Router({
  routes: [
    {
			path: '*',
			redirect: '/dashboard'
		},
    {
			path: '/dashboard',
			name: 'Dashboard',
			component: Dashboard,
      meta: {
          requiresAuth: true
      }
		},
  ]
})
