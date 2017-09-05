import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

// Use static json file until back-end is wired up
import leaders from '../../data/ward-leaders.json'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: (process.env.NODE_ENV !== 'production'),
  state: {
    leaders: [],
    committeePersons: [] // Of ward currently in view
  },
  mutations: {
    FETCH_LEADERS_SUCCESS (state, leaders) {
      state.leaders = leaders
    },
    FETCH_COMMITTEE_PERSONS_SUCCESS (state, committeePersons) {
      state.committeePersons = committeePersons
    }
  },
  actions: {
    FETCH_LEADERS ({ commit }) {
      // Add fetching here
      commit('FETCH_LEADERS_SUCCESS', leaders)
    },
    async FETCH_COMMITTEE_PERSONS ({ commit }, ward) {
      const url = `https://data.phila.gov/carto/api/v2/sql?q=SELECT * FROM elected_committee_people WHERE ward = ${ward}`
      const response = await axios.get(url)
      const committeePersons = response.data.rows
      commit('FETCH_COMMITTEE_PERSONS_SUCCESS', committeePersons)
    }
  }
})

export default store
