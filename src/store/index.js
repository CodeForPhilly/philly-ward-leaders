import Vue from 'vue'
import Vuex from 'vuex'

// Use static json file until back-end is wired up
import leaders from '../../data/ward-leaders.json'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: (process.env.NODE_ENV !== 'production'),
  state: {
    leaders: []
  },
  mutations: {
    FETCH_LEADERS_SUCCESS (state, leaders) {
      state.leaders = leaders
    }
  },
  actions: {
    FETCH_LEADERS ({ commit }) {
      // Add fetching here
      commit('FETCH_LEADERS_SUCCESS', leaders)
    }
  }
})

export default store
