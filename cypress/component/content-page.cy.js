import { mount } from 'cypress/vue'
import { createStore } from 'vuex'
import ContentPage from '../../src/views/content-page.vue'

describe('ContentPage Component', () => {
  let store
  
  beforeEach(() => {
    const FETCH_CONTENT_PAGE = cy.spy().as('fetchContentPage')

    store = createStore({
      state: {
        contentPage: {
          content: '_Italic text_',
        },
      },
      actions: {
        FETCH_CONTENT_PAGE,
      },
    })
  })

  it('Fetches page based on route', () => {
    mount(ContentPage, {
      global: {
        plugins: [store],
      },
      props: { slug: 'about' },
    })

    cy.get('@fetchContentPage').should('have.been.calledOnce')
    // Verify that the second argument of the function call is 'about'
    cy.get('@fetchContentPage').then((spy) => {
        expect(spy.args[0][1]).to.equal('about')
        })
  })

  it('Renders markdown correctly', () => {
    mount(ContentPage, {
      global: {
        plugins: [store],
      },
    })

    cy.get('#content')
      .should('exist')
      .invoke('html')
      .should('contain', '<p><em>Italic text</em></p>')
  })
})
