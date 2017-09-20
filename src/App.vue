<template>
  <div id="app">
    <nav-bar></nav-bar>
    <div class="notifications">
      <notification
         v-for="item in notifications"
         :msg="item.msg"
         @dismiss="removeNotification(item.id)"></notification>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import values from 'lodash/values'

import NavBar from './components/nav-bar.vue'
import Notification from './components/notification.vue'

export default {
  computed: mapState({
    notifications: (state) => values(state.notifications)
  }),
  methods: mapMutations({
    removeNotification: 'REMOVE_NOTIFICATION'
  }),
  components: {
    'nav-bar': NavBar,
    'notification': Notification
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

.navbar-burger span {
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
