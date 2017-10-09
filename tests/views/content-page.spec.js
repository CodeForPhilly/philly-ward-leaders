import { mount } from 'vue-test-utils'
import Vuex from 'vuex'
import Vue from 'vue'
import { stub } from 'sinon'

import ContentPage from '../../src/views/content-page.vue'

Vue.use(Vuex)

describe('Content page', () => {
  it('Fetches page based on route', () => {
    const FETCH_CONTENT_PAGE = stub()
    const $store = new Vuex.Store({
      state: {
        contentPage: {}
      },
      actions: { FETCH_CONTENT_PAGE }
    })
    const propsData = { slug: 'about' }
    const wrapper = mount(ContentPage, {
      mocks: { $store },
      propsData
    })

    expect(FETCH_CONTENT_PAGE.calledOnce).toBe(true)

    const { args } = FETCH_CONTENT_PAGE.getCall(0)
    expect(args[1]).toBe('about')
  })

  it('Renders markdown', () => {
    const $store = new Vuex.Store({
      state: {
        contentPage: {
          content: '_Italic text_'
        }
      },
      actions: {
        FETCH_CONTENT_PAGE: stub()
      }
    })
    const wrapper = mount(ContentPage, {
      mocks: { $store }
    })
    const contentEl = wrapper.find('#content')
    const html = '<div id="content"><p><em>Italic text</em></p>\n</div>'
    expect(contentEl.html().trim()).toBe(html)
  })
})
