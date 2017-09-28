import Vue from 'vue'
import VueRouter from 'vue-router'

import Splash from '../pages/splash.vue'
import WardLeaderList from '../pages/ward-leader-list.vue'
import WardLeader from '../pages/ward-leader.vue'
import CityMap from '../pages/city-map.vue'
import ContentPage from '../pages/content-page.vue'

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
