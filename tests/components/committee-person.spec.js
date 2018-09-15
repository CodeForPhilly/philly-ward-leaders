import { mount } from 'vue-test-utils'

import CommitteePerson from '../../src/components/committee-person.vue'

describe('Committee person', () => {
  test('Displays full name, division ordinal, and address', () => {
    const propsData = {
      fullName: 'John Doe',
      division: 1,
      address: '123 Main St'
    }
    const wrapper = mount(CommitteePerson, { propsData })
    const wrapperText = wrapper.text().trim()
    expect(wrapperText).toBe('John Doe 1st Division  123 Main St')
  })
})
