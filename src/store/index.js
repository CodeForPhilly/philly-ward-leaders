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
    committeePersons: [], // Of ward currently in view
    wardBoundaries: {} // Of ward currently in view
  },
  getters: {
    partyPlural (state) {
      const party = state.leader.party
      if (party === 'Democratic') {
        return 'democrats'
      } else if (party === 'Republican') {
        return 'republicans'
      }
    },
    partyAbbr (state) {
      if (state.leader.party) return state.leader.party[0]
    },
    registeredVotersPercent (state) {
      const { registeredVotersParty, registeredVotersTotal } = state.leader
      return Math.round(registeredVotersParty / registeredVotersTotal * 100)
    },
    turnoutPartyPercent (state) {
      const { turnoutParty, registeredVotersParty } = state.leader
      return Math.round(turnoutParty / registeredVotersParty * 100)
    },
    turnoutTotalPercent (state) {
      const { turnoutTotal, registeredVotersTotal } = state.leader
      return Math.round(turnoutTotal / registeredVotersTotal * 100)
    },
    vacancyCount (state) {
      const { divisionCount, committeePersonCount } = state.leader
      return divisionCount * 2 - committeePersonCount
    }
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
    },
    FETCH_WARD_BOUNDARIES_SUCCESS (state, wardBoundaries) {
      state.wardBoundaries = wardBoundaries
    }
  },
  actions: {
    async FETCH_LEADERS ({ commit }, partyPlural) {
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
      const party = pluralToParty(partyPlural)
      const response = await client.getEntries({
        content_type: 'wardLeader',
        order: 'fields.ward',
        'fields.party': party,
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
    },
    async FETCH_WARD_BOUNDARIES ({ commit }, ward) {
      const url = `/data/ward-boundaries/${ward}.geojson`
      const response = await axios.get(url)
      commit('FETCH_WARD_BOUNDARIES_SUCCESS', response.data)
    }
  }
})

function pluralToParty (partyPlural) {
  if (partyPlural === 'democrats') {
    return 'Democratic'
  } else if (partyPlural === 'republicans') {
    return 'Republican'
  }
}

export default store
