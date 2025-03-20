import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'

import ContentPage from '../../src/views/content-page.vue'

describe('Content page', () => {
  let store;
  const FETCH_CONTENT_PAGE = jest.fn()

  beforeEach(() => {
    store = createStore({
      state: { contentPage: {
        content: '_Italic text_'
        }
      },
      actions: { FETCH_CONTENT_PAGE },
    });
  });

  it('Fetches page based on route', () => {
    const propsData = { slug: 'about' }
    const wrapper = mount(ContentPage, {
      global: {
        plugins: [store],
      },
      propsData
    })
    expect(FETCH_CONTENT_PAGE).toBeCalled()
    expect(FETCH_CONTENT_PAGE.mock.calls[0][1]).toBe('about')
  })

  it('Renders markdown', () => {
    const wrapper = mount(ContentPage, {
      global: {
        plugins: [store],
      }
    })
    const contentEl = wrapper.find('#content')
    const html = '<div id="content">\n  <p><em>Italic text</em></p>\n</div>'
    expect(contentEl.html().trim()).toBe(html)
  })
})
