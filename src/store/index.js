import Vue from 'vue'
import Vuex from 'vuex'

import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './actions'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: (process.env.NODE_ENV !== 'production'),
  state: {
    notifications: {},
    contentPage: {},
    leaders: [],
    leader: {},
    committeePersons: [], // Of ward currently in view
    wardBoundaries: {} // Of ward currently in view
  },
  getters,
  mutations,
  actions
})

export default store
