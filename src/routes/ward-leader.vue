<template>
  <div>
    <section class="hero is-info" v-if="leader">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            {{ leader.Name }}
          </h1>
          <h2 class="subtitle">
            Ward Leader
          </h2>
        </div>
      </div>
    </section>
    <section class="section" v-if="leader">
      <stats-bar
        :party="leader.Party"
        :party-registered="leader['Party Registered']"
        :party-turnout="leader['Party Turnout']"
        :divisions="leader.Divisions"
        :vacancies="vacancies"
      ></stats-bar>
    </section>
    <section class="section" v-if="leader">
      <div class="columns">
        <div class="column">
          <figure class="image is-square" v-if="leader.Photo">
            <img :src="leader.Photo">
          </figure>
        </div>
        <div class="column">
          <dl>
            <dt>Registered voters</dt>
            <dd>
              {{ leader['Party Registered'] }}
              {{ partyPlural }} of
              {{ leader['Total Registered'] }}
              ({{ registeredPercent }}%)
            </dd>

            <dt>Turnout (2015 Primary)</dt>
            <dd>
              {{ leader['Party Turnout'] }}
              {{ partyPlural }}
              ({{ partyTurnoutPercent }}%)
              <br>
              {{ leader['Total Turnout'] }}
              total
              ({{ totalTurnoutPercent }}%)
            </dd>

            <dt>Divisions</dt>
            <dd>{{ leader.Divisions }}</dd>

            <dt>Committee Persons</dt>
            <dd>
              {{ leader['Committee People'] }}
              ({{ vacancies }} vacancies)
            </dd>
          </dl>
        </div>
        <div class="column">
          <dl>
            <dt>Address</dt>
            <dd>{{ leader.Address }}</dd>

            <dt>Phone</dt>
            <dd>{{ leader.Phone }}</dd>

            <dt>Age</dt>
            <dd>{{ leader.Age }}</dd>

            <dt>Gender</dt>
            <dd>{{ leader.Gender }}</dd>

            <dt>Occupation</dt>
            <dd>{{ leader.Occupation }}</dd>
          </dl>
        </div>
        <div class="column">
          <dl>
            <dt>Email</dt>
            <dd>{{ leader.Email }}</dd>

            <dt>Social Media</dt>
            <dd>
              <ul>
                <li v-if="leader.LinkedIn">
                  <a :href="leader.LinkedIn">LinkedIn</a>
                </li>
                <li v-if="leader.Facebook">
                  <a :href="leader.Facebook">Facebook</a>
                </li>
                <li v-if="leader.Twitter">
                  <a :href="leader.Twitter">Twitter</a>
                </li>
              </ul>
            </dd>
          </dl>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import StatsBar from '../components/stats-bar.vue'

export default {
  computed: {
    ...mapState({
      leader: function (state) {
        const { ward, party } = this.$route.params
        return state.leaders.find((leader) => {
          return (leader.Ward + '' === ward) && (leader.Party === party)
        })
      }
    }),
    partyPlural () {
      return this.leader.Party === 'D' ? 'democrats' : 'republicans'
    },
    registeredPercent () {
      const partyRegistered = this.leader['Party Registered']
      const totalRegistered = this.leader['Total Registered']
      return Math.round(partyRegistered / totalRegistered * 100)
    },
    partyTurnoutPercent () {
      const partyTurnout = this.leader['Party Turnout']
      const partyRegistered = this.leader['Party Registered']
      return Math.round(partyTurnout / partyRegistered * 100)
    },
    totalTurnoutPercent () {
      const totalTurnout = this.leader['Total Turnout']
      const totalRegistered = this.leader['Total Registered']
      return Math.round(totalTurnout / totalRegistered * 100)
    },
    vacancies () {
      return this.leader.Divisions * 2 - this.leader['Committee People']
    }
  },
  components: {
    'stats-bar': StatsBar
  }
}
</script>

<style>
dt {
  font-weight: bold;
}
</style>
