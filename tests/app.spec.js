import { shallowMount } from '@vue/test-utils'
import Vue from 'vue'
import Vuex from 'vuex'

import App from '../src/App.vue'
import Notification from '../src/components/notification.vue'

Vue.use(Vuex)

describe('App', () => {

  test('Shows notifications', () => {
    const $store = new Vuex.Store({
      state: {
        notifications: {
          foo: { msg: 'bar' },
          baz: { msg: 'quz' }
        }
      }
    })

    const wrapper = shallowMount(App, {
      mocks: { $store },
      stubs: ['router-view']
    })

    const notifications = wrapper.findAllComponents(Notification)
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

    const wrapper = shallowMount(App, {
      mocks: { $store },
      stubs: ['router-view']
    })

    const notification = wrapper.findComponent(Notification)
    notification.vm.$emit('dismiss')
    expect(removeNotification).toBeCalled()
  })
})
