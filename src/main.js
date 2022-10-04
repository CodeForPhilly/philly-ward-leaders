import Vue from 'vue'
import App from './App.vue'

import router from './router'
import store from './store'

new Vue({ // eslint-disable-line
  el: '#app',
  render: h => h(App),
  router,
  store
})
