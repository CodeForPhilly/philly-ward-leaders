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
            :photoUrl="leader.photoUrl"
            :turnoutParty="leader.turnoutParty"
            :registeredVotersParty="leader.registeredVotersParty"
            :divisionCount="leader.divisionCount"
            :committeePersonCount="leader.committeePersonCount"
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
  computed: mapState({
    leaders: (state) => state.leaders
  }),
  components: {
    'hero': Hero,
    'baseball-card': BaseballCard
  },
  methods: {
    ...mapActions({
      fetchLeaders: 'FETCH_LEADERS'
    }),
    fetchPartyLeaders () {
      const party = this.$route.params.party
      this.fetchLeaders(party)
    }
  },
  created () {
    this.fetchPartyLeaders()
  },
  watch: {
    '$route': 'fetchPartyLeaders'
  }
}
</script>

<style scoped>
.leader-list {
  padding-top: 24px;
}
</style>
