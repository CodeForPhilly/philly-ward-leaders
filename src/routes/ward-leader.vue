<template>
  <div v-if="leader.fullName">

    <section class="hero is-info">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            {{ leader.fullName }}
          </h1>
          <h2 class="subtitle">
            {{ leader.ward | ordinalize }} Ward Leader
          </h2>
        </div>
      </div>
    </section>

    <section class="section stats-bar is-hidden-mobile">
      <stats-bar
        :party="leader.party"
        :registered-voters-party="leader.registeredVotersParty"
        :turnout-party-percent="turnoutPartyPercent"
        :division-count="leader.divisionCount"
        :vacancy-count="vacancyCount"
      ></stats-bar>
    </section>

    <section class="section">
      <div class="container">
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
                {{ leader.registeredVotersParty | formatNumber }}
                {{ partyPlural }} of
                {{ leader.registeredVotersTotal | formatNumber }}
                total
                ({{ registeredVotersPercent }}%)
              </dd>

              <dt>Turnout (2015 Primary)</dt>
              <dd>
                {{ leader.turnoutParty | formatNumber }}
                {{ partyPlural }}
                ({{ turnoutPartyPercent }}%)
                <br>
                {{ leader.turnoutTotal | formatNumber }}
                total
                ({{ turnoutTotalPercent }}%)
              </dd>

              <dt>Divisions</dt>
              <dd>{{ leader.divisionCount }}</dd>

              <dt>Committee Persons</dt>
              <dd>
                {{ leader.committeePersonCount }}
                ({{ vacancyCount }} vacancies)
              </dd>
            </dl>
          </div>
          <div class="column">
            <dl>
              <dt>Address</dt>
              <dd v-if="leader.address">{{ leader.address }}</dd>
              <dd v-else>
                <span class="unknown">Unknown</span>
                <ask-detail
                  :fullName="leader.fullName"
                  detail="Address"></ask-detail>
              </dd>

              <dt>Phone</dt>
              <dd v-if="leader.phone">{{ leader.phone }}</dd>
              <dd v-else>
                <span class="unknown">Unknown</span>
                <ask-detail
                  :fullName="leader.fullName"
                  detail="Phone"></ask-detail>
              </dd>

              <dt>Age</dt>
              <dd v-if="leader.age">{{ leader.age }}</dd>
              <dd v-else>
                <span class="unknown">Unknown</span>
                <ask-detail
                  :fullName="leader.fullName"
                  detail="Age"></ask-detail>
              </dd>

              <dt>Gender</dt>
              <dd v-if="leader.gender">{{ leader.gender }}</dd>
              <dd v-else>
                <span class="unknown">Unknown</span>
                <ask-detail
                  :fullName="leader.fullName"
                  detail="Gender"></ask-detail>
              </dd>

              <dt>Occupation</dt>
              <dd v-if="leader.occupation">{{ leader.occupation }}</dd>
              <dd v-else>
                <span class="unknown">Unknown</span>
                <ask-detail
                  :fullName="leader.fullName"
                  detail="Occupation"></ask-detail>
              </dd>
            </dl>
          </div>
          <div class="column">
            <dl>
              <dt>Email</dt>
              <dd v-if="leader.email">
                <a :href="'mailto:' + leader.email">{{ leader.email }}</a>
              </dd>
              <dd v-else>
                <span class="unknown">Unknown</span>
                <ask-detail
                  :fullName="leader.fullName"
                  detail="Email"></ask-detail>
              </dd>

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
                <ask-detail
                  :fullName="leader.fullName"
                  detail="Social media"
                  label="Know a link?"></ask-detail>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <ward-map :ward="leader.ward" :boundaries="wardBoundaries"></ward-map>
    </section>

    <section class="section" v-if="committeePersons">
      <div class="container">
        <h2 class="title is-2">Committee Persons</h2>
        <div class="columns is-multiline">
          <committee-person
            v-for="person in committeePersons"
            :fullName="person.fullName"
            :division="person.division"
            :address="person.address"
          ></committee-person>
        </div>
      </div>
    </section>

  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

import StatsBar from '../components/stats-bar.vue'
import CommitteePerson from '../components/committee-person.vue'
import WardMap from '../components/ward-map.vue'
import AskDetail from '../components/ask-detail.vue'
import { formatNumber, ordinalize } from '../util'

export default {
  props: [
    'party',
    'ward',
    'slug'
  ],
  computed: {
    ...mapState({
      leader: (state) => state.leader,
      committeePersons: (state) => state.committeePersons,
      wardBoundaries: (state) => state.wardBoundaries
    }),
    ...mapGetters([
      'partyPlural',
      'registeredVotersPercent',
      'turnoutPartyPercent',
      'turnoutTotalPercent',
      'vacancyCount'
    ])
  },
  methods: mapActions({
    fetchLeader: 'FETCH_LEADER',
    fetchCommitteePersons: 'FETCH_COMMITTEE_PERSONS',
    fetchWardBoundaries: 'FETCH_WARD_BOUNDARIES'
  }),
  created () {
    const opts = {
      ward: this.ward,
      party: this.party
    }
    this.fetchLeader(opts)
    this.fetchCommitteePersons(opts)
    this.fetchWardBoundaries(this.ward)
  },
  components: {
    'stats-bar': StatsBar,
    'committee-person': CommitteePerson,
    'ward-map': WardMap,
    'ask-detail': AskDetail
  },
  filters: {
    formatNumber,
    ordinalize
  }
}
</script>

<style scoped>
.stats-bar {
  padding: 3rem 1.5rem 1.5rem 1.5rem;
}
dt {
  font-weight: bold;
  letter-spacing: 1px;
}
dd {
  margin-bottom: 15px;
}
.unknown {
  letter-spacing: 1px;
  font-size: 80%;
}
</style>
