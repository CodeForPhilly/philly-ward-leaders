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
      'fields.ward',
      'fields.subWard',
      'fields.party',
      'fields.fullName',
      'fields.photo',
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
    return this.client.getEntries(opts)
      .then((response) => response.items.map(getFieldsAndId))
      .then((items) => items.map(simplifyLinkedItems))
  }

  fetchLeader (ward, subWard, party) {
    const requestOpts = {
      content_type: 'wardLeader',
      'fields.ward': ward,
      'fields.party': party
    }
    if (subWard) requestOpts['fields.subWard'] = subWard

    return this.client.getEntries(requestOpts)
    .then((response) => {
      if (response.items.length > 0) {
        return simplifyLinkedItems(getFieldsAndId(response.items[0]))
      } else {
        throw new Error('Ward leader was not found')
      }
    })
  }

  fetchSampleBallots (ward, subWard, party) {
    const requestOpts = {
      content_type: 'sampleBallot',
      'fields.ward': ward,
      'fields.party': party
    }
    if (subWard) requestOpts['fields.subWard'] = subWard

    return this.client.getEntries(requestOpts)
    .then((response) => response.items.map(getFieldsAndId))
  }

  fetchCommitteePersons (ward, party) {
    const requestOpts = {
      content_type: 'committeePerson',
      order: 'fields.division',
      'fields.ward': ward,
      'fields.party': party
    }

    return this.client.getEntries(requestOpts)
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

function simplifyLinkedItems (item) {
  const simplifiedItem = {
    ...item,
    photo: item.photo && item.photo.fields && item.photo.fields.file.url
  }
  if (item.campaignFinanceReports) {
    simplifiedItem.campaignFinanceReports = item.campaignFinanceReports.map((report) => report.fields)
  }
  return simplifiedItem
}
