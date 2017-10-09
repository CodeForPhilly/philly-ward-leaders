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
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import values from 'lodash/values'
import Buefy from 'buefy'

import NavBar from './components/nav-bar.vue'
import Notification from './components/notification.vue'

export default {
  computed: {
    ...mapState({
      notifications: (state) => values(state.notifications),
      pendingRequests: (state) => Object.keys(state.pendingRequests || [])
    }),
    isLoading () {
      return this.pendingRequests.length > 0
    }
  },
  methods: mapMutations({
    removeNotification: 'REMOVE_NOTIFICATION'
  }),
  components: {
    'nav-bar': NavBar,
    'notification': Notification,
    'b-loading': Buefy.Loading
  }
}
</script>

<style lang="scss">
@import "~bulma/sass/utilities/initial-variables";

$blue: #04576F;
$light-blue: #2284a1;

$navbar-background-color: $light-blue;
$navbar-item-color: $white;
$primary: $light-blue;

@import "~bulma";
@import "~buefy/lib/buefy.css";

.navbar-burger span,
.navbar-burger.is-active span {
  background-color: $white;
}

.notifications {
  position: absolute;
  top: 60px;
  left: 0;
  right: 0;
  z-index: 9999;
}
</style>
