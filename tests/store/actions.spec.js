import 'babel-polyfill'

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
      const fakeLeaders = ['yay']
      mockApiSuccess('fetchLeaders', fakeLeaders)
      const { FETCH_LEADERS } = require('../../src/store/actions')

      const commit = jest.fn()
      FETCH_LEADERS({ commit })

      process.nextTick(() => {
        expect(commit).toBeCalledWith('BEGIN_REQUEST', 'FETCH_LEADERS')
        expect(commit).toBeCalledWith('FETCH_LEADERS_SUCCESS', fakeLeaders)
        expect(commit).toBeCalledWith('END_REQUEST', 'FETCH_LEADERS')
      })
    })

    it('Failed action calls begin, notify, and end', () => {
      mockApiFailure('fetchLeaders')
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
    it('Calls reset, begin, success, and end', () => {
      const fakeLeader = { name: 'John Doe' }
      mockApiSuccess('fetchLeader', fakeLeader)
      const { FETCH_LEADER } = require('../../src/store/actions')

      const commit = jest.fn()
      const payload = { ward: 1, party: 'democratic' }
      FETCH_LEADER({ commit }, payload)

      process.nextTick(() => {
        expect(commit).toBeCalledWith('RESET_LEADER')
        expect(commit).toBeCalledWith('BEGIN_REQUEST', 'FETCH_LEADER')
        expect(commit).toBeCalledWith('FETCH_LEADER_SUCCESS', fakeLeader)
        expect(commit).toBeCalledWith('END_REQUEST', 'FETCH_LEADER')
      })
    })

    it('Calls notify and end on failure', () => {
      mockApiFailure('fetchLeader')
      const { FETCH_LEADER } = require('../../src/store/actions')

      const commit = jest.fn()
      const dispatch = jest.fn()
      const payload = { ward: 1, party: 'democratic' }
      FETCH_LEADER({ commit, dispatch }, payload)

      process.nextTick(() => {
        expect(dispatch).toBeCalledWith('NOTIFY', expect.any(String))
        expect(commit).toBeCalledWith('END_REQUEST', 'FETCH_LEADER')
      })
    })
  })

  describe('Fetch committee persons', () => {
    it('Calls begin, success, and end', () => {
      const fakeResponse = [{ name: 'John Doe' }]
      mockApiSuccess('fetchCommitteePersons', fakeResponse)
      const { FETCH_COMMITTEE_PERSONS } = require('../../src/store/actions')

      const commit = jest.fn()
      const payload = { ward: 1, party: 'democratic' }
      FETCH_COMMITTEE_PERSONS({ commit }, payload)

      process.nextTick(() => {
        expect(commit).toBeCalledWith('BEGIN_REQUEST', 'FETCH_COMMITTEE_PERSONS')
        expect(commit).toBeCalledWith('FETCH_COMMITTEE_PERSONS_SUCCESS', fakeResponse)
        expect(commit).toBeCalledWith('END_REQUEST', 'FETCH_COMMITTEE_PERSONS')
      })
    })

    it('Calls notify and end on failure', () => {
      mockApiFailure('fetchCommitteePersons')
      const { FETCH_COMMITTEE_PERSONS } = require('../../src/store/actions')

      const commit = jest.fn()
      const dispatch = jest.fn()
      const payload = { ward: 1, party: 'democratic' }
      FETCH_COMMITTEE_PERSONS({ commit, dispatch }, payload)

      process.nextTick(() => {
        expect(dispatch).toBeCalledWith('NOTIFY', expect.any(String))
        expect(commit).toBeCalledWith('END_REQUEST', 'FETCH_COMMITTEE_PERSONS')
      })
    })
  })

  describe('Fetch ward boundaries', () => {
    it('Calls begin, success, and end', () => {
      const fakeResponse = [{ type: 'Feature' }]
      mockApiSuccess('fetchWardBoundaries', fakeResponse)
      const { FETCH_WARD_BOUNDARIES } = require('../../src/store/actions')

      const commit = jest.fn()
      const payload = 1
      FETCH_WARD_BOUNDARIES({ commit }, payload)

      process.nextTick(() => {
        expect(commit).toBeCalledWith('BEGIN_REQUEST', 'FETCH_WARD_BOUNDARIES')
        expect(commit).toBeCalledWith('FETCH_WARD_BOUNDARIES_SUCCESS', fakeResponse)
        expect(commit).toBeCalledWith('END_REQUEST', 'FETCH_WARD_BOUNDARIES')
      })
    })

    it('Calls end on failure', () => {
      mockApiFailure('fetchWardBoundaries')
      const { FETCH_WARD_BOUNDARIES } = require('../../src/store/actions')

      const commit = jest.fn()
      const dispatch = jest.fn()
      const payload = 1
      FETCH_WARD_BOUNDARIES({ commit, dispatch }, payload)

      process.nextTick(() => {
        expect(commit).toBeCalledWith('END_REQUEST', 'FETCH_WARD_BOUNDARIES')
      })
    })
  })

  describe('Fetch citywide boundaries', () => {
    it('Calls begin, success, and end', () => {
      const fakeResponse = [{ type: 'Feature' }]
      mockApiSuccess('fetchCitywideBoundaries', fakeResponse)
      const { FETCH_CITYWIDE_BOUNDARIES } = require('../../src/store/actions')

      const commit = jest.fn()
      FETCH_CITYWIDE_BOUNDARIES({ commit })

      process.nextTick(() => {
        expect(commit).toBeCalledWith('BEGIN_REQUEST', 'FETCH_CITYWIDE_BOUNDARIES')
        expect(commit).toBeCalledWith('FETCH_CITYWIDE_BOUNDARIES_SUCCESS', fakeResponse)
        expect(commit).toBeCalledWith('END_REQUEST', 'FETCH_CITYWIDE_BOUNDARIES')
      })
    })

    it('Calls notify and end on failure', () => {
      mockApiFailure('fetchCitywideBoundaries')
      const { FETCH_CITYWIDE_BOUNDARIES } = require('../../src/store/actions')

      const commit = jest.fn()
      const dispatch = jest.fn()
      FETCH_CITYWIDE_BOUNDARIES({ commit, dispatch })

      process.nextTick(() => {
        expect(dispatch).toBeCalledWith('NOTIFY', expect.any(String))
        expect(commit).toBeCalledWith('END_REQUEST', 'FETCH_CITYWIDE_BOUNDARIES')
      })
    })
  })

  describe('Fetch content page', () => {
    it('Calls begin, success, and end', () => {
      const fakeResponse = { content: 'Foo' }
      mockApiSuccess('fetchContentPage', fakeResponse)
      const { FETCH_CONTENT_PAGE } = require('../../src/store/actions')

      const commit = jest.fn()
      const payload = 'about'
      FETCH_CONTENT_PAGE({ commit }, payload)

      process.nextTick(() => {
        expect(commit).toBeCalledWith('BEGIN_REQUEST', 'FETCH_CONTENT_PAGE')
        expect(commit).toBeCalledWith('FETCH_CONTENT_PAGE_SUCCESS', fakeResponse)
        expect(commit).toBeCalledWith('END_REQUEST', 'FETCH_CONTENT_PAGE')
      })
    })

    it('Calls notify and end on failure', () => {
      mockApiFailure('fetchContentPage')
      const { FETCH_CONTENT_PAGE } = require('../../src/store/actions')

      const commit = jest.fn()
      const dispatch = jest.fn()
      const payload = 'slug'
      FETCH_CONTENT_PAGE({ commit, dispatch }, payload)

      process.nextTick(() => {
        expect(dispatch).toBeCalledWith('NOTIFY', expect.any(String))
        expect(commit).toBeCalledWith('END_REQUEST', 'FETCH_CONTENT_PAGE')
      })
    })
  })
})

function mockApiSuccess (method, response) {
  jest.doMock('../../src/api', () => class {
    [method] () {
      return Promise.resolve(response)
    }
  })
}

function mockApiFailure (method) {
  jest.doMock('../../src/api', () => class {
    [method] () {
      return Promise.reject(new Error())
    }
  })
}
