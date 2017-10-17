import 'babel-polyfill'

describe('Api', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  describe('Fetch leaders', () => {
    it('Simplifies response data structure', async () => {
      const fakeResponse = require('./__fixtures__/wardLeaders.json')
      mockClientSuccess(fakeResponse)
      const Api = require('../../src/api').default
      const api = new Api()
      const response = await api.fetchLeaders()

      expect(response.length).toBeGreaterThan(0)
      const item = response[0]
      expect(item).not.toHaveProperty('fields')
      expect(item).not.toHaveProperty('sys')
      expect(item).toHaveProperty('id')
      expect(item).toHaveProperty('photo')
      expect(item.photo).toEqual(expect.any(String))
    })

    it('Failures reject promise', async () => {
      expect.assertions(1)
      mockClientFailure()
      const Api = require('../../src/api').default
      const api = new Api()
      await expect(api.fetchLeaders()).rejects.toBeDefined()
    })
  })

  describe('Fetch leader', () => {
    it('Simplifies response data structure', async () => {
      const fakeResponse = require('./__fixtures__/wardLeader.json')
      mockClientSuccess(fakeResponse)
      const Api = require('../../src/api').default
      const api = new Api()
      const response = await api.fetchLeader()

      expect(response).not.toHaveProperty('fields')
      expect(response).not.toHaveProperty('sys')
      expect(response).toHaveProperty('id')
      expect(response).toHaveProperty('photo')
      expect(response.photo).toEqual(expect.any(String))
    })

    it('Rejects if leader not found', async () => {
      const fakeResponse = require('./__fixtures__/wardLeader-notFound.json')
      mockClientSuccess(fakeResponse)
      const Api = require('../../src/api').default
      const api = new Api()
      await expect(api.fetchLeader()).rejects.toBeDefined()
    })

    it('Rejects if request fails', async () => {
      mockClientFailure()
      const Api = require('../../src/api').default
      const api = new Api()
      await expect(api.fetchLeader()).rejects.toBeDefined()
    })
  })

  describe('Fetch committee persons', () => {
    it('Simplifies response data structure', async () => {
      const fakeResponse = require('./__fixtures__/committeePersons.json')
      mockClientSuccess(fakeResponse)
      const Api = require('../../src/api').default
      const api = new Api()
      const response = await api.fetchCommitteePersons()

      expect(response.length).toBeGreaterThan(0)
      const item = response[0]
      expect(item).not.toHaveProperty('fields')
      expect(item).not.toHaveProperty('sys')
      expect(item).toHaveProperty('id')
      expect(item).toHaveProperty('fullName')
    })

    it('Rejects if request fails', async () => {
      mockClientFailure()
      const Api = require('../../src/api').default
      const api = new Api()
      await expect(api.fetchCommitteePersons()).rejects.toBeDefined()
    })
  })

  describe('Fetch content page', () => {
    it('Simplifies response data structure', async () => {
      const fakeResponse = require('./__fixtures__/contentPage.json')
      mockClientSuccess(fakeResponse)
      const Api = require('../../src/api').default
      const api = new Api()
      const response = await api.fetchContentPage()

      expect(response).not.toHaveProperty('fields')
      expect(response).not.toHaveProperty('sys')
      expect(response).toHaveProperty('id')
      expect(response).toHaveProperty('content')
    })

    it('Rejects if page not found', async () => {
      const fakeResponse = require('./__fixtures__/contentPage-notFound.json')
      mockClientSuccess(fakeResponse)
      const Api = require('../../src/api').default
      const api = new Api()
      await expect(api.fetchContentPage()).rejects.toBeDefined()
    })

    it('Rejects if request fails', async () => {
      mockClientFailure()
      const Api = require('../../src/api').default
      const api = new Api()
      await expect(api.fetchContentPage()).rejects.toBeDefined()
    })
  })
})

function mockClientSuccess (response) {
  jest.doMock('contentful', () => ({
    createClient () {
      return {
        getEntries (opts) {
          return Promise.resolve(response)
        }
      }
    }
  }))
}

function mockClientFailure () {
  jest.doMock('contentful', () => ({
    createClient () {
      return {
        getEntries (opts) {
          return Promise.reject(new Error('Mock error'))
        }
      }
    }
  }))
}
