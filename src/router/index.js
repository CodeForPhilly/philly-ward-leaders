import Vue from 'vue'
import VueRouter from 'vue-router'

import Splash from '../routes/splash.vue'
import WardLeaderList from '../routes/ward-leader-list.vue'
import WardLeader from '../routes/ward-leader.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: Splash },
  { path: '/leaders', component: WardLeaderList },
  { path: '/:ward/:party', component: WardLeader }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
