import Vue from 'vue'

export function FETCH_LEADERS_SUCCESS (state, leaders) {
  state.leaders = leaders
}

export function RESET_LEADER (state) {
  state.currentLeader.leader = {}
}

export function FETCH_LEADER_SUCCESS (state, leader) {
  state.currentLeader.leader = leader
}

export function FETCH_SAMPLE_BALLOTS_SUCCESS (state, sampleBallots) {
  state.currentLeader.sampleBallots = sampleBallots
}

export function FETCH_COMMITTEE_PERSONS_SUCCESS (state, committeePersons) {
  state.currentLeader.committeePersons = committeePersons
}

export function FETCH_WARD_BOUNDARIES_SUCCESS (state, wardBoundaries) {
  state.currentLeader.wardBoundaries = wardBoundaries
}

export function FETCH_CITYWIDE_BOUNDARIES_SUCCESS (state, citywideBoundaries) {
  state.citywideBoundaries = citywideBoundaries
}

export function FETCH_CONTENT_PAGE_SUCCESS (state, contentPage) {
  state.contentPage = contentPage
}

export function ADD_NOTIFICATION (state, notification) {
  Vue.set(state.notifications, notification.id, notification)
}

export function REMOVE_NOTIFICATION (state, id) {
  Vue.delete(state.notifications, id)
}

export function BEGIN_REQUEST (state, name) {
  Vue.set(state.pendingRequests, name, true)
}

export function END_REQUEST (state, name) {
  Vue.delete(state.pendingRequests, name)
}
