import 'babel-polyfill'

import * as actions from '../../src/store/actions'

describe('Actions', () => {
  describe('Notify', () => {
    it('Adds a notification', () => {
      const commit = jest.fn()
      const msg = 'Hello, world!'
      actions.NOTIFY({ commit }, msg)
      expect(commit).toBeCalled()
      const call = commit.mock.calls[0]
      expect(call[0]).toBe('ADD_NOTIFICATION')
      expect(call[1].msg).toBe(msg)
    })

    it('Sets a timer to remove the notification', () => {
      jest.useFakeTimers()
      const commit = jest.fn()
      actions.NOTIFY({ commit })
      jest.runAllTimers()
      expect(commit.mock.calls.length).toBeGreaterThan(1)
      expect(commit.mock.calls[1][0]).toBe('REMOVE_NOTIFICATION')
    })
  })

  describe('Fetch leaders', () => {
    it('Calls begin_request and end_request')
    it('Calls end_request on failure')
    it('Calls notify on failure')
    it('Calls fetch_leaders_success with the appropriate data structure')
  })

  describe('Fetch leader', () => {
    it('Puts the ward and party in the query url')
    it('Considers an empty array like a 404')
    it('Calls fetch_leader_success with the appropriate data structure')
  })

  describe('Fetch committee persons', () => {
    it('Puts the ward and aprty in the query url')
    it('Saves the result with the proper data structure')
  })

  describe('Fetch ward boundaries', () => {
    it('Constructs the appropriate url')
    it('Calls end_request on failure')
  })

  describe('Fetch citywide boundaries', () => {
    // Same as ward boundaries
    it('Calls notify on failure')
  })

  describe('Fetch content page', () => {
    it('Puts the slug in the query url')
    it('Considers an empty array like a 404')
    it('Saves the first item')
  })
})
