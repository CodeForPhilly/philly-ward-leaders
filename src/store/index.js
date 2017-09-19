import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { createClient } from 'contentful'
import nanoid from 'nanoid'

import { CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN } from '../config'

Vue.use(Vuex)

const client = createClient({
  space: CONTENTFUL_SPACE_ID,
  accessToken: CONTENTFUL_ACCESS_TOKEN
})

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
  getters: {
    partyPlural (state) {
      const party = state.leader.party
      if (party === 'democratic') {
        return 'democrats'
      } else if (party === 'republican') {
        return 'republicans'
      }
    },
    partyAbbr (state) {
      if (state.leader.party) return state.leader.party[0]
    },
    partyTitle (state) {
      const party = state.leader.party
      if (party === 'democratic') {
        return 'Democratic'
      } else if (party === 'republican') {
        return 'Republican'
      }
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
    },
    FETCH_CONTENT_PAGE_SUCCESS (state, contentPage) {
      state.contentPage = contentPage
    },
    ADD_NOTIFICATION (state, notification) {
      Vue.set(state.notifications, notification.id, notification)
    },
    REMOVE_NOTIFICATION (state, id) {
      Vue.delete(state.notifications, id)
    }
  },
  actions: {
    NOTIFY ({ commit }, msg) {
      const id = nanoid()
      const duration = 5000
      const notification = { id, msg }
      commit('ADD_NOTIFICATION', notification)
      window.setTimeout(() => commit('REMOVE_NOTIFICATION', id), duration)
    },
    async FETCH_LEADERS (ctx, party) {
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
      let response
      try {
        response = await client.getEntries({
          content_type: 'wardLeader',
          order: 'fields.ward',
          'fields.party': party,
          select: fields.join(',')
        })
      } catch (err) {
        ctx.dispatch('NOTIFY', `Failed to retrieve ward leaders`)
        return
      }
      const leaders = response.items.map((item) => item.fields)
      ctx.commit('FETCH_LEADERS_SUCCESS', leaders)
    },
    async FETCH_LEADER (ctx, { ward, party }) {
      let response
      try {
        response = await client.getEntries({
          content_type: 'wardLeader',
          'fields.ward': ward,
          'fields.party': party
        })
      } catch (err) {
        console.error('caught', err)
        ctx.dispatch('NOTIFY', `Failed to get information about the ward leader`)
        return
      }

      if (response.items.length) {
        const leader = response.items[0].fields
        ctx.commit('FETCH_LEADER_SUCCESS', leader)
      } else {
        ctx.dispatch('NOTIFY', `Ward leader was not found`)
      }
    },
    async FETCH_COMMITTEE_PERSONS (ctx, { ward, party }) {
      let response
      try {
        response = await client.getEntries({
          content_type: 'committeePerson',
          'fields.ward': ward,
          'fields.party': party
        })
      } catch (err) {
        ctx.dispatch('NOTIFY', `Failed to get list of committee persons`)
        return
      }
      const committeePersons = response.items.map((item) => item.fields)
      ctx.commit('FETCH_COMMITTEE_PERSONS_SUCCESS', committeePersons)
    },
    async FETCH_WARD_BOUNDARIES (ctx, ward) {
      let response
      try {
        const url = `/data/ward-boundaries/${ward}.geojson`
        response = await axios.get(url)
      } catch (err) {
        return
      }
      ctx.commit('FETCH_WARD_BOUNDARIES_SUCCESS', response.data)
    },
    async FETCH_CONTENT_PAGE (ctx, slug) {
      let response
      try {
        response = await client.getEntries({
          content_type: 'page',
          'fields.slug': slug
        })
      } catch (err) {
        ctx.dispatch('NOTIFY', `Failed to retrieve content`)
        return
      }

      if (response.items.length) {
        const contentPage = response.items[0].fields
        ctx.commit('FETCH_CONTENT_PAGE_SUCCESS', contentPage)
      } else {
        ctx.dispatch('NOTIFY', `Page not found`)
      }
    }
  }
})

export default store
