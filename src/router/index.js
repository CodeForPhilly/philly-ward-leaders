import Vue from 'vue'
import VueRouter from 'vue-router'

import Splash from '../routes/splash.vue'
import WardLeaderList from '../routes/ward-leader-list.vue'
import WardLeader from '../routes/ward-leader.vue'
import CityMap from '../routes/city-map.vue'
import ContentPage from '../routes/content-page.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: Splash },
  { path: '/leaders', redirect: '/leaders/democratic' },
  { path: '/leaders/:party', component: WardLeaderList, props: true },
  { path: '/leaders/:party/:ward/:slug', component: WardLeader, props: true },
  { path: '/map', component: CityMap },
  { path: '/:slug', component: ContentPage, props: true }
]

const router = new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior
})

function scrollBehavior (to, from, savedPosition) {
  if (savedPosition) {
    return savedPosition
  } else {
    return { x: 0, y: 0 }
  }
}

export default router
