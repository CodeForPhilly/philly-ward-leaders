<template>
  <div id="app">
    <nav-bar></nav-bar>
    <div class="notifications">
      <notification
         v-for="item in notifications"
         :key="item.id"
         :msg="item.msg"
         @dismiss="removeNotification(item.id)"></notification>
    </div>
    <b-loading :active="isLoading"></b-loading>
    <router-view></router-view>
    <site-footer v-if="shouldShowFooter"></site-footer>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState, mapMutations } from 'vuex'
import values from 'lodash/values'
import Buefy from 'buefy'
import Tooltip from 'vue-directive-tooltip'

import NavBar from './components/nav-bar.vue'
import Notification from './components/notification.vue'
import SiteFooter from './components/site-footer.vue'

Vue.use(Tooltip)

export default {
  computed: {
    ...mapState({
      notifications: (state) => values(state.notifications),
      pendingRequests: (state) => Object.keys(state.pendingRequests || [])
    }),
    isLoading () {
      const routeName = this.$route && this.$route.name
      return (this.pendingRequests.length > 0) && (routeName !== 'splash')
    },
    shouldShowFooter () {
      const routeName = this.$route && this.$route.name
      return routeName !== 'city-map'
    }
  },
  methods: mapMutations({
    removeNotification: 'REMOVE_NOTIFICATION'
  }),
  components: {
    'nav-bar': NavBar,
    'notification': Notification,
    'b-loading': Buefy.Loading,
    'site-footer': SiteFooter
  }
}
</script>

<style lang="sass">
@import "~bulma/sass/utilities/initial-variables"

$blue: #04576F
$light-blue: #2284a1

$navbar-background-color: $light-blue
$navbar-item-color: $white
$primary: $light-blue

@import "~bulma"
@import "~buefy/lib/buefy.css"
@import "~vue-directive-tooltip/src/css/index.scss"

.navbar-burger span,
.navbar-burger.is-active span
  background-color: $white

.notifications
  position: absolute;
  top: 60px;
  left: 0;
  right: 0;
  z-index: 9999;
</style>
