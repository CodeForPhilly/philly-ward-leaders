import Vue from 'vue'
import VueRouter from 'vue-router'

import Splash from '../routes/splash.vue'
import WardLeaderList from '../routes/ward-leader-list.vue'
import WardLeader from '../routes/ward-leader.vue'
import ContentPage from '../routes/content-page.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: Splash },
  { path: '/leaders', redirect: '/leaders/democratic' },
  { path: '/leaders/:party', component: WardLeaderList, props: true },
  { path: '/leaders/:party/:ward/:slug', component: WardLeader, props: true },
  { path: '/:slug', component: ContentPage, props: true }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
