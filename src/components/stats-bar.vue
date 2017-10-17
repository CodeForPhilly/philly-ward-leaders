<template>
  <nav class="level">
    <div class="level-item has-text-centered">
      <div>
        <p class="heading">Voters ({{ partyAbbr }})</p>
        <p class="title">{{ registeredVotersParty | formatNumber }}</p>
      </div>
    </div>
    <div class="level-item has-text-centered">
      <div>
        <p class="heading">Turnout ({{ partyAbbr }})</p>
        <p class="title">{{ turnoutPartyPercent }}%</p>
      </div>
    </div>
    <div class="level-item has-text-centered">
      <div>
        <p class="heading">Divisions</p>
        <p class="title">{{ divisionCount }}</p>
      </div>
    </div>
    <div class="level-item has-text-centered">
      <div>
        <p class="heading">Vacancies</p>
        <p class="title">{{ vacancyCount }}</p>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'

import { formatNumber } from '../util'

export default {
  props: [
    'party',
    'registered-voters-party',
    'turnout-party-percent',
    'division-count',
    'vacancy-count'
  ],
  computed: mapGetters([
    'partyAbbr'
  ]),
  filters: {
    formatNumber
  }
}
</script>
