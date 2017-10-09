import 'babel-polyfill'

// import * as actions from '../../src/store/actions'

// jest.mock('../../src/api')

describe('Actions', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  describe('Notify', () => {
    it('Adds a notification', () => {
      const { NOTIFY } = require('../../src/store/actions')
      const commit = jest.fn()
      const msg = 'Hello, world!'
      NOTIFY({ commit }, msg)
      expect(commit).toBeCalled()
      const call = commit.mock.calls[0]
      expect(call[0]).toBe('ADD_NOTIFICATION')
      expect(call[1].msg).toBe(msg)
    })

    it('Sets a timer to remove the notification', () => {
      const { NOTIFY } = require('../../src/store/actions')
      jest.useFakeTimers()
      const commit = jest.fn()
      NOTIFY({ commit })
      jest.runAllTimers()
      expect(commit.mock.calls.length).toBeGreaterThan(1)
      expect(commit.mock.calls[1][0]).toBe('REMOVE_NOTIFICATION')
    })
  })

  describe('Fetch leaders', () => {
    it('Successful action calls begin, success, and end', () => {
      const payload = ['yay']
      jest.doMock('../../src/api', () => class {
        fetchLeaders () {
          return Promise.resolve(payload)
        }
      })
      const { FETCH_LEADERS } = require('../../src/store/actions')

      const commit = jest.fn()
      FETCH_LEADERS({ commit })

      process.nextTick(() => {
        expect(commit).toBeCalledWith('BEGIN_REQUEST', 'FETCH_LEADERS')
        expect(commit).toBeCalledWith('FETCH_LEADERS_SUCCESS', payload)
        expect(commit).toBeCalledWith('END_REQUEST', 'FETCH_LEADERS')
      })
    })

    it('Failed action calls begin, notify, and end', () => {
      jest.doMock('../../src/api', () => class {
        fetchLeaders () {
          return Promise.reject(new Error())
        }
      })
      const { FETCH_LEADERS } = require('../../src/store/actions')

      const commit = jest.fn()
      const dispatch = jest.fn()
      FETCH_LEADERS({ commit, dispatch })

      process.nextTick(() => {
        expect(commit).toBeCalledWith('BEGIN_REQUEST', 'FETCH_LEADERS')
        expect(dispatch).toBeCalledWith('NOTIFY', expect.any(String))
        expect(commit).toBeCalledWith('END_REQUEST', 'FETCH_LEADERS')
      })
    })
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
