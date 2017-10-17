export function partyPlural (state) {
  const party = state.currentLeader.leader.party
  if (party === 'democratic') {
    return 'democrats'
  } else if (party === 'republican') {
    return 'republicans'
  }
}

export function partyAbbr (state) {
  if (state.currentLeader.leader.party) return state.currentLeader.leader.party[0]
}

export function partyTitle (state) {
  const party = state.currentLeader.leader.party
  if (party === 'democratic') {
    return 'Democratic'
  } else if (party === 'republican') {
    return 'Republican'
  }
}

export function registeredVotersPercent (state) {
  const { registeredVotersParty, registeredVotersTotal } = state.currentLeader.leader
  return Math.round(registeredVotersParty / registeredVotersTotal * 100)
}

export function turnoutPartyPercent (state) {
  const { turnoutParty, registeredVotersParty } = state.currentLeader.leader
  return Math.round(turnoutParty / registeredVotersParty * 100)
}

export function turnoutTotalPercent (state) {
  const { turnoutTotal, registeredVotersTotal } = state.currentLeader.leader
  return Math.round(turnoutTotal / registeredVotersTotal * 100)
}

export function vacancyCount (state) {
  const { divisionCount, committeePersonCount } = state.currentLeader.leader
  return divisionCount * 2 - committeePersonCount
}

export function age (state) {
  const yearOfBirth = state.currentLeader.leader.yearOfBirth
  if (!yearOfBirth) return

  const currentYear = (new Date()).getFullYear()
  return currentYear - yearOfBirth
}

export function findLeader (state) {
  return function (ward, party) {
    return state.leaders.find((leader) => leader.ward === ward && leader.party === party)
  }
}

export function isLeadersFetched (state) {
  // TODO: This could produce false positives if there's actually
  // no data or if the fetch has started but not finished.
  return state.leaders.length > 0
}
