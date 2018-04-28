import Vue from 'vue'
import Vuex from 'vuex'

import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './actions'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: (process.env.NODE_ENV !== 'production'),
  state: {
    pendingRequests: {},
    notifications: {},
    contentPage: {},
    leaders: [],
    citywideBoundaries: {},
    currentLeader: {
      leader: {},
      sampleBallots: [],
      committeePersons: [],
      wardBoundaries: {}
    }
  },
  getters,
  mutations,
  actions
})

export default store
