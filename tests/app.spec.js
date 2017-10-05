import { shallow } from 'vue-test-utils'
import Vue from 'vue'
import Vuex from 'vuex'
import Buefy from 'buefy'

import App from '../src/App.vue'

Vue.use(Vuex)

describe('App', () => {
  test('Doesn\'t show loading indicator when no pending requests', () => {
    const $store = new Vuex.Store({
      state: {
        pendingRequests: {}
      }
    })

    const wrapper = shallow(App, {
      mocks: { $store },
      stubs: ['router-view']
    })

    const indicator = wrapper.find(Buefy.Loading)
    const isActive = indicator.hasProp('active', false)
    expect(isActive).toBe(true)
  })

  test('Shows loading indicator when there are pending requests', () => {
    const $store = new Vuex.Store({
      state: {
        pendingRequests: {
          foo: { msg: 'bar' }
        }
      }
    })

    const wrapper = shallow(App, {
      mocks: { $store },
      stubs: ['router-view']
    })

    const indicator = wrapper.find(Buefy.Loading)
    const isActive = indicator.hasProp('active', true)
    expect(isActive).toBe(true)
  })
})
