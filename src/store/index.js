import Vue from 'vue'
import Vuex from 'vuex'

import leaders from '../../data/ward-leaders.json'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: (process.env.NODE_ENV !== 'production'),
  state: {
    leaders, // Use static data until back-end integration is built
    currentLeader: {}
  },
  mutations: {
    setCurrentLeader (state, leader) {
      state.currentLeader = leader
    }
  },
  actions: {
    // Stub using static data until back-end integration is built
    fetchCurrentLeader ({ state, commit }, { ward, party }) {
      const leader = state.leaders.find((leader) => {
        return (leader.Ward + '' === ward) && (leader.Party === party)
      })
      commit('setCurrentLeader', leader)
    }
  }
})

export default store
