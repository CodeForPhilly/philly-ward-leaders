import { stub } from 'sinon'
import 'babel-polyfill'

import * as actions from '../../src/store/actions'

describe('Actions', () => {
  describe('Notify', () => {
    it('Adds a notification', () => {
      const commit = stub()
      const msg = 'Hello, world!'
      actions.NOTIFY({ commit }, msg)
      const { args } = commit.getCall(0)
      expect(args[0]).toBe('ADD_NOTIFICATION')
      expect(args[1].msg).toBe(msg)
    })

    it('Sets a timer to remove the notification', () => {
      // Monkey patch setTimeout to immediately execute
      const setTimeout = window.setTimeout
      window.setTimeout = (cb, duration) => cb()

      const commit = stub()
      actions.NOTIFY({ commit })
      process.nextTick(() => {
        const { args } = commit.getCall(1)
        expect(args[0]).toBe('REMOVE_NOTIFICATION')
      })

      window.setTimeout = setTimeout
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
