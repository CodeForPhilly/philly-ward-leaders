import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'

import WardLeader from '../../src/views/ward-leader.vue'


describe('Ward leader', () => {
  let store;
  const FETCH_LEADER = jest.fn()
  const FETCH_COMMITTEE_PERSONS = jest.fn()
  const FETCH_WARD_BOUNDARIES = jest.fn()
  const FETCH_SAMPLE_BALLOTS = jest.fn()

  beforeEach(() => {
    store = createStore({
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
    });
  });  

  it('Fetches leader based on ward and party', () => {
    const propsData = { ward: '66', party: 'democratic' }
    const wrapper = mount(WardLeader, {
      global: {
        plugins: [store],
      },
      propsData
    })
    expect(FETCH_LEADER).toBeCalled()
    expect(FETCH_LEADER.mock.calls[0][1].party).toBe('democratic')
    expect(FETCH_LEADER.mock.calls[0][1].ward).toBe('66')
    expect(FETCH_LEADER.mock.calls[0][1].subWard).toBe(undefined)
  })

  it('Fetches leader based on ward, party, and subward', () => {
    const propsData = { ward: '66A', party: 'democratic' }
    const wrapper = mount(WardLeader, {
      global: {
        plugins: [store],
      },
      propsData
    })

    expect(FETCH_LEADER).toBeCalled()
    expect(FETCH_LEADER.mock.calls[0][1].party).toBe('democratic')
    expect(FETCH_LEADER.mock.calls[0][1].ward).toBe('66')
    expect(FETCH_LEADER.mock.calls[0][1].subWard).toBe('A')
  })
})
