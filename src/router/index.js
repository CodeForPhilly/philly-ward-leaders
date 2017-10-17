import Vue from 'vue'
import VueRouter from 'vue-router'

import Splash from '../views/splash.vue'
import WardLeaderList from '../views/ward-leader-list.vue'
import WardLeader from '../views/ward-leader.vue'
import CityMap from '../views/city-map.vue'
import ContentPage from '../views/content-page.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'splash',
    component: Splash
  },
  {
    path: '/leaders',
    redirect: '/leaders/democratic'
  },
  {
    path: '/leaders/:party',
    name: 'ward-leader-list',
    component: WardLeaderList,
    props: true
  },
  {
    path: '/leaders/:party/:ward/:slug',
    name: 'ward-leader',
    component: WardLeader,
    props: true
  },
  {
    path: '/map',
    name: 'city-map',
    component: CityMap
  },
  {
    path: '/:slug',
    name: 'content-page',
    component: ContentPage,
    props: true
  }
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
