import axios from 'axios'
import { createClient } from 'contentful'

export default class Api {
  constructor (spaceId, accessToken) {
    this.client = createClient({
      space: spaceId,
      accessToken
    })
  }

  fetchLeaders () {
    const select = [
      'sys.id',
      'fields.ward',
      'fields.party',
      'fields.fullName',
      'fields.photoUrl',
      'fields.registeredVotersParty',
      'fields.turnoutParty',
      'fields.divisionCount',
      'fields.committeePersonCount'
    ]
    const opts = {
      content_type: 'wardLeader',
      order: 'fields.ward',
      select: select.join(','),
      limit: 1000
    }
    return client.getEntries(opts)
      .then((response) => response.items.map(getFieldsAndId))
  }

  fetchLeader (ward, party) {
    return this.client.getEntries({
      content_type: 'wardLeader',
      'fields.ward': ward,
      'fields.party': party
    })
    .then((response) => {
      if (response.items.length > 0) {
        return getFieldsAndId(response.items[0])
      } else {
        throw new Error('Ward leader was not found')
      }
    })
  }

  fetchCommitteePersons (ward, party) {
    return this.client.getEntries({
      content_type: 'committeePerson',
      order: 'fields.division',
      'fields.ward': ward,
      'fields.party': party
    })
    .then((response) => response.items.map(getFieldsAndId))
  }

  fetchContentPage (slug) {
    return this.client.getEntries({
      content_type: 'page',
      'fields.slug': slug
    })
    .then((response) => {
      if (response.items.length > 0) {
        return getFieldsAndId(response.items[0])
      } else {
        throw new Error('Page not found')
      }
    })
  }

  fetchWardBoundaries (ward) {
    const url = `/data/ward-boundaries/${ward}.geojson`
    return axios.get(url)
      .then((response) => response.data)
  }

  fetchCitywideBoundaries () {
    const url = `/data/citywide-boundaries.geojson`
    return axios.get(url)
      .then((response) => response.data)
  }
}

function getFieldsAndId (item) {
  return {
    ...item.fields,
    id: item.sys.id
  }
}
