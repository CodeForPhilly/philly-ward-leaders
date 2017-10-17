import { shallow } from 'vue-test-utils'
import Vue from 'vue'
import Vuex from 'vuex'
import Buefy from 'buefy'

import App from '../src/App.vue'
import Notification from '../src/components/notification.vue'

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

  test('Shows notifications', () => {
    const $store = new Vuex.Store({
      state: {
        notifications: {
          foo: { msg: 'bar' },
          baz: { msg: 'quz' }
        }
      }
    })

    const wrapper = shallow(App, {
      mocks: { $store },
      stubs: ['router-view']
    })

    const notifications = wrapper.findAll(Notification)
    expect(notifications.length).toBe(2)
  })

  test('Dismissing a notification calls store event REMOVE_NOTIFICATION', () => {
    const removeNotification = jest.fn()
    const $store = new Vuex.Store({
      state: {
        notifications: {
          foo: { msg: 'bar' }
        }
      },
      mutations: {
        REMOVE_NOTIFICATION: removeNotification
      }
    })

    const wrapper = shallow(App, {
      mocks: { $store },
      stubs: ['router-view']
    })

    const notification = wrapper.find(Notification)
    notification.vm.$emit('dismiss')
    expect(removeNotification).toBeCalled()
  })
})
