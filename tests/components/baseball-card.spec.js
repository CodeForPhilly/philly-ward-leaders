import { mount,shallowMount,RouterLinkStub, renderToString  } from '@vue/test-utils'
//import router from '../../src/router'

import BaseballCard from '../../src/components/baseball-card/index.vue'
import { createSSRApp } from 'vue'

describe('Baseball card', () => {
  it('Matches snapshot', async () => {
    const propsData = {
      name: 'John Doe',
      ward: 1,
      party: 'democratic',
      photoUrl: 'https://example.com/image.png',
      registeredVotersParty: 1000,
      turnoutParty: 400,
      turnoutTotal: 600,
      divisionCount: 30,
      committeePersonCount: 25
    }
    const htmL_text = await renderToString(BaseballCard, {
      propsData,
      stubs: {
        'router-link': {
          template: '<a><slot /></a>'
        }
      }
    })
    console.log(htmL_text)
    expect(htmL_text).toMatchSnapshot()
  })

  it('Includes subward in URL', () => {
    const propsData = {
      name: 'John Doe',
      ward: 1,
      subWard: 'A',
      party: 'democratic',
      photoUrl: 'https://example.com/image.png',
      registeredVotersParty: 1000,
      turnoutParty: 400,
      turnoutTotal: 600,
      divisionCount: 30,
      committeePersonCount: 25
    }
    const wrapper = mount(BaseballCard, {
      propsData,
     })
    const url = wrapper.vm.url
    expect(url).toBe('/leaders/democratic/1A/john-doe')
  })
})
