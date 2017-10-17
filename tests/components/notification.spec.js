import { mount } from 'vue-test-utils'

import Notification from '../../src/components/notification.vue'

describe('Notification', () => {
  test('Notification displays msg', () => {
    const propsData = { msg: 'Hello, world!' }
    const wrapper = mount(Notification, { propsData })
    const wrapperText = wrapper.text().trim()
    expect(wrapperText).toBe('Hello, world!')
  })

  test('Clicking delete button emits dismiss event', () => {
    const wrapper = mount(Notification)
    const deleteBtn = wrapper.find('button.delete')
    deleteBtn.trigger('click')

    const emittedEvents = wrapper.emitted()
    expect(emittedEvents.dismiss).toBeTruthy()
    expect(emittedEvents.dismiss.length).toBe(1)
  })
})
