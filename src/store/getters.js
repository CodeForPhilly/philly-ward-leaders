export function partyPlural(state) {
  const party = state.currentLeader.leader.party;
  if (party === "democratic") {
    return "democrats";
  }
  if (party === "republican") {
    return "republicans";
  }
}

export function partyAbbr(state) {
  if (state.currentLeader.leader.party)
    return state.currentLeader.leader.party[0];
}

export function partyTitle(state) {
  const party = state.currentLeader.leader.party;
  if (party === "democratic") {
    return "Democratic";
  }
  if (party === "republican") {
    return "Republican";
  }
}

export function registeredVotersPercent(state) {
  const { registeredVotersParty, registeredVotersTotal } =
    state.currentLeader.leader;
  return Math.round((registeredVotersParty / registeredVotersTotal) * 100);
}

export function turnoutPartyPercent(state) {
  const { turnoutParty, registeredVotersParty } = state.currentLeader.leader;
  return Math.round((turnoutParty / registeredVotersParty) * 100);
}

export function turnoutTotalPercent(state) {
  const { turnoutTotal, registeredVotersTotal } = state.currentLeader.leader;
  return Math.round((turnoutTotal / registeredVotersTotal) * 100);
}

export function vacancyCount(state) {
  const { ward, subWard, party } = state.currentLeader.leader;
  if (!ward || !party) return 0;
  const wardKey = subWard ? `${ward}${subWard}` : String(ward);
  const stats = state.wardStats[wardKey];
  if (!stats) return 0;
  return stats[`${party}Vacancies`] || 0;
}

export function age(state) {
  const yearOfBirth = state.currentLeader.leader.yearOfBirth;
  if (!yearOfBirth) return;

  const currentYear = new Date().getFullYear();
  return currentYear - yearOfBirth;
}

export function findLeader(state) {
  return function (ward, party) {
    return state.leaders.find(
      (leader) => leader.ward === ward && leader.party === party,
    );
  };
}

export function isLeadersFetched(state) {
  // TODO: This could produce false positives if there's actually
  // no data or if the fetch has started but not finished.
  return state.leaders.length > 0;
}
