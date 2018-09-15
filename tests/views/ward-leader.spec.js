import { mount } from 'vue-test-utils'
import Vuex from 'vuex'
import Vue from 'vue'

import WardLeader from '../../src/views/ward-leader.vue'

Vue.use(Vuex)

describe('Ward leader', () => {
  it('Fetches leader based on ward and party', () => {
    const FETCH_LEADER = jest.fn()
    const FETCH_COMMITTEE_PERSONS = jest.fn()
    const FETCH_WARD_BOUNDARIES = jest.fn()
    const FETCH_SAMPLE_BALLOTS = jest.fn()
    const $store = new Vuex.Store({
      state: {
        currentLeader: {
          leader: {},
          committeePersons: [],
          wardBoundaries: {}
        }
      },
      actions: {
        FETCH_LEADER,
        FETCH_COMMITTEE_PERSONS,
        FETCH_WARD_BOUNDARIES,
        FETCH_SAMPLE_BALLOTS
      }
    })
    const propsData = { ward: '66', party: 'democratic' }
    mount(WardLeader, {
      mocks: { $store },
      propsData
    })

    expect(FETCH_LEADER).toBeCalled()
    expect(FETCH_LEADER.mock.calls[0][1].party).toBe('democratic')
    expect(FETCH_LEADER.mock.calls[0][1].ward).toBe('66')
    expect(FETCH_LEADER.mock.calls[0][1].subWard).toBe(undefined)
  })

  it('Fetches leader based on ward, party, and subward', () => {
    const FETCH_LEADER = jest.fn()
    const FETCH_COMMITTEE_PERSONS = jest.fn()
    const FETCH_WARD_BOUNDARIES = jest.fn()
    const FETCH_SAMPLE_BALLOTS = jest.fn()
    const $store = new Vuex.Store({
      state: {
        currentLeader: {
          leader: {},
          committeePersons: [],
          wardBoundaries: {}
        }
      },
      actions: {
        FETCH_LEADER,
        FETCH_COMMITTEE_PERSONS,
        FETCH_WARD_BOUNDARIES,
        FETCH_SAMPLE_BALLOTS
      }
    })
    const propsData = { ward: '66A', party: 'democratic' }
    mount(WardLeader, {
      mocks: { $store },
      propsData
    })

    expect(FETCH_LEADER).toBeCalled()
    expect(FETCH_LEADER.mock.calls[0][1].party).toBe('democratic')
    expect(FETCH_LEADER.mock.calls[0][1].ward).toBe('66')
    expect(FETCH_LEADER.mock.calls[0][1].subWard).toBe('A')
  })
})
