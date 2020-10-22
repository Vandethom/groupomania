import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/authentication',
    name: 'Authentication',
    component: () => import('../views/SignIn.vue')
  },
  {
    path: '/createAccount',
    name: 'CreateAccount',
    component: () => import('../views/SignUp.vue')
  },
  {
    path: '/account',
    name: 'Account',
    component: () => import('../views/Account.vue')
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
