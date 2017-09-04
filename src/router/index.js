import Vue from 'vue'
import VueRouter from 'vue-router'

import WardLeaders from '../routes/ward-leaders.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: WardLeaders }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
