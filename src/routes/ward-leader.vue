<template>
  <div>
    <section class="hero is-info">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            {{ leader.fullName }}
          </h1>
          <h2 class="subtitle">
            Ward Leader
          </h2>
        </div>
      </div>
    </section>
    <section class="section stats-bar">
      <stats-bar
        :party="leader.party"
        :party-registered="leader.partyRegistered"
        :party-turnout="leader.partyTurnout"
        :divisions="leader.divisions"
        :vacancies="vacancies"
      ></stats-bar>
    </section>
    <section class="section">
      <div class="container">
        <div class="columns">
          <div class="column">
            <figure class="image" v-if="leader.photo">
              <img :src="leader.photo">
            </figure>
          </div>
          <div class="column">
            <dl>
              <dt>Registered voters</dt>
              <dd>
                {{ leader.partyRegistered }}
                {{ partyPlural }} of
                {{ leader.totalRegistered }}
                ({{ registeredPercent }}%)
              </dd>

              <dt>Turnout (2015 Primary)</dt>
              <dd>
                {{ leader.partyTurnout }}
                {{ partyPlural }}
                ({{ partyTurnoutPercent }}%)
                <br>
                {{ leader.totalTurnout }}
                total
                ({{ totalTurnoutPercent }}%)
              </dd>

              <dt>Divisions</dt>
              <dd>{{ leader.divisions }}</dd>

              <dt>Committee Persons</dt>
              <dd>
                {{ leader.committeePersons }}
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
      </div>
    </section>
    <section class="section">
      <ward-map :ward="leader.ward"></ward-map>
    </section>
    <section class="section">
      <div class="container">
        <h2 class="title is-2">Committee Persons</h2>
        <div class="columns is-multiline">
          <committee-person
            v-for="person in committeePersons"
            :fullName="person.name"
            :division="person.division"
            :address="person.address"
          ></committee-person>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import StatsBar from '../components/stats-bar.vue'
import CommitteePerson from '../components/committee-person.vue'
import WardMap from '../components/ward-map.vue'

export default {
  computed: {
    ...mapState({
      leader: function (state) {
        const { ward, party } = this.$route.params
        return state.leaders.find((leader) => {
          return (leader.ward + '' === ward) && (leader.party === party)
        })
      },
      committeePersons: (state) => state.committeePersons
    }),
    partyPlural () {
      return this.leader.party === 'D' ? 'democrats' : 'republicans'
    },
    registeredPercent () {
      const { partyRegistered, totalRegistered } = this.leader
      return Math.round(partyRegistered / totalRegistered * 100)
    },
    partyTurnoutPercent () {
      const { partyTurnout, partyRegistered } = this.leader
      return Math.round(partyTurnout / partyRegistered * 100)
    },
    totalTurnoutPercent () {
      const { totalTurnout, totalRegistered } = this.leader
      return Math.round(totalTurnout / totalRegistered * 100)
    },
    vacancies () {
      return this.leader.divisions * 2 - this.leader.committeePersons
    }
  },
  methods: mapActions({
    fetchLeaders: 'FETCH_LEADERS',
    fetchCommitteePersons: 'FETCH_COMMITTEE_PERSONS'
  }),
  created () {
    if (!this.leader) this.fetchLeaders()

    const ward = this.$route.params.ward
    this.fetchCommitteePersons(ward)
  },
  components: {
    'stats-bar': StatsBar,
    'committee-person': CommitteePerson,
    'ward-map': WardMap
  }
}
</script>

<style>
.stats-bar {
  padding: 3rem 1.5rem 1.5rem 1.5rem;
}
dt {
  font-weight: bold;
}
</style>
