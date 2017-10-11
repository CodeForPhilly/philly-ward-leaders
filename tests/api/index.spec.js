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
      expect(item.photo).toEqual(expect.any(String))
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
          return Promise.reject(new Error())
        }
      }
    }
  }))
}
