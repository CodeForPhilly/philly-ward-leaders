<template>
  <div>
    <hero></hero>
    <section class="section leader-list">

      <div class="tabs is-large is-centered">
        <ul>
          <router-link to="/leaders/democratic" tag="li" active-class="is-active">
            <a>Democrats</a>
          </router-link>
          <router-link to="/leaders/republican" tag="li" active-class="is-active">
            <a>Republicans</a>
          </router-link>
        </ul>
      </div>

      <div class="container">
        <div v-if="leaders.length" class="columns is-multiline">
          <baseball-card
            v-for="leader in leaders"
            :name="leader.fullName"
            :ward="leader.ward"
            :party="leader.party"
            :photo-url="leader.photoUrl"
            :turnout-party="leader.turnoutParty"
            :registered-voters-party="leader.registeredVotersParty"
            :division-count="leader.divisionCount"
            :committee-person-count="leader.committeePersonCount"
          ></baseball-card>
        </div>
      </div>

    </section>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import Hero from '../components/hero.vue'
import BaseballCard from '../components/baseball-card/index.vue'

export default {
  name: 'app',
  props: [ 'party' ],
  computed: mapState({
    leaders: (state) => state.leaders
  }),
  components: {
    'hero': Hero,
    'baseball-card': BaseballCard
  },
  methods: mapActions({
    fetchLeaders: 'FETCH_LEADERS'
  }),
  created () {
    this.fetchLeaders(this.party)
  },
  watch: {
    party (newValue) {
      this.fetchLeaders(newValue)
    }
  }
}
</script>

<style scoped>
.leader-list {
  padding-top: 24px;
}
</style>
