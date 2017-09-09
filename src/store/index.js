import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { createClient } from 'contentful'

import { CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN } from '../config'

Vue.use(Vuex)

const client = createClient({
  space: CONTENTFUL_SPACE_ID,
  accessToken: CONTENTFUL_ACCESS_TOKEN
})

const store = new Vuex.Store({
  strict: (process.env.NODE_ENV !== 'production'),
  state: {
    leaders: [],
    leader: {},
    committeePersons: [] // Of ward currently in view
  },
  mutations: {
    FETCH_LEADERS_SUCCESS (state, leaders) {
      state.leaders = leaders
    },
    FETCH_LEADER_SUCCESS (state, leader) {
      state.leader = leader
    },
    FETCH_COMMITTEE_PERSONS_SUCCESS (state, committeePersons) {
      state.committeePersons = committeePersons
    }
  },
  actions: {
    async FETCH_LEADERS ({ commit }) {
      const fields = [
        'sys.id',
        'fields.ward',
        'fields.party',
        'fields.fullName',
        'fields.photoUrl',
        'fields.registeredVotersParty',
        'fields.turnoutParty',
        'fields.divisionCount',
        'fields.committeePersonCount'
      ]
      const response = await client.getEntries({
        content_type: 'wardLeader',
        order: 'fields.ward',
        select: fields.join(',')
      })
      const leaders = response.items.map((item) => item.fields)
      commit('FETCH_LEADERS_SUCCESS', leaders)
    },
    async FETCH_LEADER ({ commit }, { ward, party }) {
      const response = await client.getEntries({
        content_type: 'wardLeader',
        'fields.ward': ward,
        'fields.party': party
      })
      const leader = response.items[0].fields
      commit('FETCH_LEADER_SUCCESS', leader)
    },
    async FETCH_COMMITTEE_PERSONS ({ commit }, { ward, party }) {
      const response = await client.getEntries({
        content_type: 'committeePerson',
        'fields.ward': ward,
        'fields.party': party
      })
      const committeePersons = response.items.map((item) => item.fields)
      commit('FETCH_COMMITTEE_PERSONS_SUCCESS', committeePersons)
    }
  }
})

export default store
