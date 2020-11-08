<template>
  <div v-if="leader.fullName">

    <section class="hero is-info">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            {{ leader.fullName }}
          </h1>
          <h2 class="subtitle">
            {{ leader.ward | ordinalize }}
            <span v-if="leader.subWard">({{ leader.subWard }})</span>
            Ward Leader,
            {{ partyTitle }} Party
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

    <section class="section leader-info">
      <div class="container">
        <div class="columns">
          <div class="column">
            <figure class="image" v-if="leader.photo">
              <img :src="leader.photo">
              <ask-detail
                :fullName="leader.fullName"
                detail="Photo"
                label="Have a better photo?"></ask-detail>
            </figure>
            <figure class="image" v-else>
              <img src="../assets/photo-placeholder.png">
              <ask-detail
                :fullName="leader.fullName"
                detail="Photo"
                label="Have a photo?"></ask-detail>
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

              <dt>Turnout ({{ turnoutElection }})</dt>
              <dd>
                {{ leader.turnoutParty | formatNumber }}
                {{ partyPlural }}
                ({{ turnoutPartyPercent }}%)
                <br>
                {{ leader.turnoutTotal | formatNumber }}
                total
                ({{ turnoutTotalPercent }}%)
              </dd>

              <dt>
                <abbr v-tooltip="'How many divisions make up the ward'">
                  Divisions
                </abbr>
              </dt>
              <dd>{{ leader.divisionCount }}</dd>

              <dt>
                <abbr v-tooltip="'Each division elects 2 committee persons'">
                  Committee Persons
                </abbr>
              </dt>
              <dd>
                {{ leader.committeePersonCount }}
                ({{ vacancyCount }}
                <abbr v-tooltip="'Each division elects 2 committee persons'">
                  vacancies
                </abbr>)
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
              <dd v-if="age">{{ age }}</dd>
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

              <dt>
                Sample Ballots
              </dt>
              <dd>
                <ul v-if="sampleBallots.length > 0" class="sample-ballots">
                  <li
                    v-for="ballot in sampleBallots"
                    :key="ballot.id">
                    <a @click.prevent="modalUrl = ballot.url">
                      <figure class="image is-48x48">
                        <img :src="ballot.url" height="48"/>
                      </figure>
                    </a>
                  </li>
                </ul>
                <a :href="sampleBallotFormPrefilled">
                  Upload a sample ballot
                </a>
              </dd>

              <dt v-if="leader.campaignFinanceReports && leader.campaignFinanceReports.length > 0">
                Campaign Finance Reports
              </dt>
              <dd>
                <ul>
                  <li
                    v-for="report in leader.campaignFinanceReports"
                    :key="report.title">
                    <a :href="report.url">
                      {{ report.year }}
                    </a>
                  </li>
                </ul>
              </dd>
            </dl>

          </div>
        </div>
        <p class="has-text-centered">
          Is this information incorrect?
          <ask-detail
            :fullName="leader.fullName"
            label="Let us know"></ask-detail>
        </p>
      </div>
    </section>

    <section class="section">
      <ward-map
        :ward="leader.ward"
        :boundaries="wardBoundaries"
        :committeePersons="committeePersons"></ward-map>
    </section>

    <section class="section" v-if="committeePersons">
      <div class="container">
        <h2 class="title is-2">Committee Persons</h2>
        <div class="columns is-multiline">
          <committee-person
            v-for="person in committeePersons"
            :key="person.id"
            :fullName="person.fullName"
            :division="person.division"
            :address="person.address"
            :title="person.title"
            :email="person.email"
          ></committee-person>
        </div>
      </div>
    </section>

    <div class="modal is-active" v-show="modalUrl">
      <div class="modal-background" @click="modalUrl = null"/>
      <div class="modal-content">
        <p class="image">
          <img :src="modalUrl">
        </p>
      </div>
      <button @click="modalUrl = null" class="modal-close is-large" aria-label="close"/>
    </div>

  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

import StatsBar from '../components/stats-bar.vue'
import CommitteePerson from '../components/committee-person.vue'
import WardMap from '../components/ward-map.vue'
import AskDetail from '../components/ask-detail.vue'
import { formatNumber, ordinalize } from '../util'
import { SAMPLE_BALLOT_FORM, TURNOUT_ELECTION } from '../config'

export default {
  props: [
    'party',
    'ward',
    'slug'
  ],
  data () {
    return {
      turnoutElection: TURNOUT_ELECTION,
      modalUrl: null
    }
  },
  computed: {
    ...mapState({
      leader: (state) => state.currentLeader.leader,
      sampleBallots: (state) => state.currentLeader.sampleBallots,
      committeePersons: (state) => state.currentLeader.committeePersons,
      wardBoundaries: (state) => state.currentLeader.wardBoundaries
    }),
    ...mapGetters([
      'partyPlural',
      'partyTitle',
      'registeredVotersPercent',
      'turnoutPartyPercent',
      'turnoutTotalPercent',
      'vacancyCount',
      'age'
    ]),
    sampleBallotFormPrefilled () {
      return `${SAMPLE_BALLOT_FORM}?ward=${this.ward}&party=${this.party}`
    }
  },
  methods: mapActions({
    fetchLeader: 'FETCH_LEADER',
    fetchSampleBallots: 'FETCH_SAMPLE_BALLOTS',
    fetchCommitteePersons: 'FETCH_COMMITTEE_PERSONS',
    fetchWardBoundaries: 'FETCH_WARD_BOUNDARIES'
  }),
  created () {
    const opts = {
      party: this.party
    }

    if (hasSubWard(this.ward)) {
      const { ward, subWard } = splitSubWard(this.ward)
      opts.ward = ward
      opts.subWard = subWard
    } else {
      opts.ward = this.ward
    }

    this.fetchLeader(opts)
    this.fetchSampleBallots(opts)
    this.fetchCommitteePersons(opts)
    this.fetchWardBoundaries(opts.ward)
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

function hasSubWard (ward) {
  const lastChar = ward.slice(-1)
  return /[A-Za-z]/.test(lastChar)
}

function splitSubWard (ward) {
  return {
    ward: ward.slice(0, -1),
    subWard: ward.slice(-1)
  }
}
</script>

<style lang="sass" scoped>
.stats-bar
  padding: 3rem 1.5rem 1.5rem 1.5rem

.leader-info
  padding-bottom: 0

dt
  font-weight: bold
  letter-spacing: 1px

abbr
  border-bottom: dotted 1px #4a4a4a
  cursor: help

dd
  margin-bottom: 15px

.unknown
  letter-spacing: 1px
  font-size: 80%

.modal
  z-index: 999999

.sample-ballots
  margin-bottom: 15px

  li,
  li figure
    display: inline-block
</style>
