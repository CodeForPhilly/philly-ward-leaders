<template>
  <div>
    <section class="hero is-info" v-if="leader">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            {{ leader.fullName }}
          </h1>
          <h2 class="subtitle">
            {{ leader.ward }} Ward Leader
          </h2>
        </div>
      </div>
    </section>
    <section class="section" v-if="leader">
      <stats-bar
        :party="leader.party"
        :registered-voters-party="leader.registeredVotersParty"
        :turnout-party-percent="turnoutPartyPercent"
        :division-count="leader.divisionCount"
        :vacancies="vacancies"
      ></stats-bar>
    </section>
    <section class="section" v-if="leader">
      <div class="columns">
        <div class="column">
          <figure class="image" v-if="leader.photoUrl">
            <img :src="leader.photoUrl">
          </figure>
        </div>
        <div class="column">
          <dl>
            <dt>Registered voters</dt>
            <dd>
              {{ leader.registeredVotersParty }}
              {{ partyPlural }} of
              {{ leader.registeredVotersTotal }}
              total
              ({{ registeredVotersPercent }}%)
            </dd>

            <dt>Turnout (2015 Primary)</dt>
            <dd>
              {{ leader.turnoutParty }}
              {{ partyPlural }}
              ({{ turnoutPartyPercent }}%)
              <br>
              {{ leader.turnoutTotal }}
              total
              ({{ turnoutTotalPercent }}%)
            </dd>

            <dt>Divisions</dt>
            <dd>{{ leader.divisionCount }}</dd>

            <dt>Committee Persons</dt>
            <dd>
              {{ leader.committeePersonCount }}
              ({{ vacancies }} vacancies)
            </dd>
          </dl>
        </div>
        <div class="column">
          <dl>
            <dt>Address</dt>
            <dd>{{ leader.address }}</dd>

            <dt>Phone</dt>
            <dd>{{ leader.phone }}</dd>

            <dt>Age</dt>
            <dd>{{ leader.age }}</dd>

            <dt>Gender</dt>
            <dd>{{ leader.gender }}</dd>

            <dt>Occupation</dt>
            <dd>{{ leader.occupation }}</dd>
          </dl>
        </div>
        <div class="column">
          <dl>
            <dt>Email</dt>
            <dd>{{ leader.email }}</dd>

            <dt>Social Media</dt>
            <dd>
              <ul>
                <li v-if="leader.linkedin">
                  <a :href="leader.linkedin">LinkedIn</a>
                </li>
                <li v-if="leader.facebook">
                  <a :href="leader.facebook">Facebook</a>
                </li>
                <li v-if="leader.twitter">
                  <a :href="leader.twitter">Twitter</a>
                </li>
              </ul>
            </dd>
          </dl>
        </div>
      </div>
    </section>
    <section class="section" v-if="committeePersons">
      <h2 class="title is-2">Committee Persons</h2>
      <div class="columns is-multiline">
        <committee-person
          v-for="person in committeePersons"
          :fullName="person.name"
          :division="person.division"
          :address="person.address"
        ></committee-person>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import StatsBar from '../components/stats-bar.vue'
import CommitteePerson from '../components/committee-person.vue'

export default {
  computed: {
    ...mapState({
      leader: (state) => state.leader,
      committeePersons: (state) => state.committeePersons
    }),
    partyPlural () {
      return this.leader.party === 'Democratic' ? 'democrats' : 'republicans'
    },
    registeredVotersPercent () {
      const { registeredVotersParty, registeredVotersTotal } = this.leader
      return Math.round(registeredVotersParty / registeredVotersTotal * 100)
    },
    turnoutPartyPercent () {
      const { turnoutParty, registeredVotersParty } = this.leader
      return Math.round(turnoutParty / registeredVotersParty * 100)
    },
    turnoutTotalPercent () {
      const { turnoutTotal, registeredVotersTotal } = this.leader
      return Math.round(turnoutTotal / registeredVotersTotal * 100)
    },
    vacancies () {
      return this.leader.divisionCount * 2 - this.leader.committeePersonCount
    }
  },
  methods: mapActions({
    fetchLeader: 'FETCH_LEADER',
    fetchCommitteePersons: 'FETCH_COMMITTEE_PERSONS'
  }),
  created () {
    const { ward, party } = this.$route.params
    this.fetchLeader({ ward, party })
    this.fetchCommitteePersons({ ward, party })
  },
  components: {
    'stats-bar': StatsBar,
    'committee-person': CommitteePerson
  }
}
</script>

<style>
dt {
  font-weight: bold;
}
</style>
