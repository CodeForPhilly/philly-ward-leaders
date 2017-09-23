import axios from 'axios'
import nanoid from 'nanoid'
import { createClient } from 'contentful'

import { CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN } from '../config'

const client = createClient({
  space: CONTENTFUL_SPACE_ID,
  accessToken: CONTENTFUL_ACCESS_TOKEN
})

export function NOTIFY ({ commit }, msg) {
  const id = nanoid()
  const duration = 5000
  const notification = { id, msg }
  commit('ADD_NOTIFICATION', notification)
  window.setTimeout(() => commit('REMOVE_NOTIFICATION', id), duration)
}

export async function FETCH_LEADERS (ctx) {
  ctx.commit('BEGIN_REQUEST', 'FETCH_LEADERS')
  const fields = [
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
  let response
  try {
    const opts = {
      content_type: 'wardLeader',
      order: 'fields.ward',
      select: fields.join(','),
      limit: 1000
    }
    response = await client.getEntries(opts)
  } catch (err) {
    ctx.dispatch('NOTIFY', `Failed to retrieve ward leaders`)
    ctx.commit('END_REQUEST', 'FETCH_LEADERS')
    return
  }
  const leaders = response.items.map((item) => item.fields)
  ctx.commit('FETCH_LEADERS_SUCCESS', leaders)
  ctx.commit('END_REQUEST', 'FETCH_LEADERS')
}

export async function FETCH_LEADER (ctx, { ward, party }) {
  ctx.commit('BEGIN_REQUEST', 'FETCH_LEADER')
  ctx.commit('RESET_LEADER')
  let response
  try {
    response = await client.getEntries({
      content_type: 'wardLeader',
      'fields.ward': ward,
      'fields.party': party
    })
  } catch (err) {
    ctx.dispatch('NOTIFY', `Failed to get information about the ward leader`)
    ctx.commit('END_REQUEST', 'FETCH_LEADER')
    return
  }

  if (response.items.length) {
    const leader = response.items[0].fields
    ctx.commit('FETCH_LEADER_SUCCESS', leader)
  } else {
    ctx.dispatch('NOTIFY', `Ward leader was not found`)
  }
  ctx.commit('END_REQUEST', 'FETCH_LEADER')
}

export async function FETCH_COMMITTEE_PERSONS (ctx, { ward, party }) {
  ctx.commit('BEGIN_REQUEST', 'FETCH_COMMITTEE_PERSONS')
  let response
  try {
    response = await client.getEntries({
      content_type: 'committeePerson',
      order: 'fields.division',
      'fields.ward': ward,
      'fields.party': party
    })
  } catch (err) {
    ctx.dispatch('NOTIFY', `Failed to get list of committee persons`)
    ctx.commit('END_REQUEST', 'FETCH_COMMITTEE_PERSONS')
    return
  }
  const committeePersons = response.items.map((item) => item.fields)
  ctx.commit('FETCH_COMMITTEE_PERSONS_SUCCESS', committeePersons)
  ctx.commit('END_REQUEST', 'FETCH_COMMITTEE_PERSONS')
}

export async function FETCH_WARD_BOUNDARIES (ctx, ward) {
  ctx.commit('BEGIN_REQUEST', 'FETCH_WARD_BOUNDARIES')
  let response
  try {
    const url = `/data/ward-boundaries/${ward}.geojson`
    response = await axios.get(url)
  } catch (err) {
    return
  }
  ctx.commit('FETCH_WARD_BOUNDARIES_SUCCESS', response.data)
  ctx.commit('END_REQUEST', 'FETCH_WARD_BOUNDARIES')
}

export async function FETCH_CITYWIDE_BOUNDARIES (ctx) {
  ctx.commit('BEGIN_REQUEST', 'FETCH_CITYWIDE_BOUNDARIES')
  let response
  try {
    const url = `/data/citywide-boundaries.geojson`
    response = await axios.get(url)
  } catch (err) {
    ctx.dispatch('NOTIFY', `Failed to retrieve ward boundaries`)
    return
  }
  ctx.commit('FETCH_CITYWIDE_BOUNDARIES_SUCCESS', response.data)
  ctx.commit('END_REQUEST', 'FETCH_CITYWIDE_BOUNDARIES')
}

export async function FETCH_CONTENT_PAGE (ctx, slug) {
  ctx.commit('BEGIN_REQUEST', 'FETCH_CONTENT_PAGE')
  let response
  try {
    response = await client.getEntries({
      content_type: 'page',
      'fields.slug': slug
    })
  } catch (err) {
    ctx.dispatch('NOTIFY', `Failed to retrieve content`)
    ctx.commit('END_REQUEST', 'FETCH_CONTENT_PAGE')
    return
  }

  if (response.items.length) {
    const contentPage = response.items[0].fields
    ctx.commit('FETCH_CONTENT_PAGE_SUCCESS', contentPage)
  } else {
    ctx.dispatch('NOTIFY', `Page not found`)
  }
  ctx.commit('END_REQUEST', 'FETCH_CONTENT_PAGE')
}
