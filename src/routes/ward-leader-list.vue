<template>
  <div>
    <hero></hero>
    <section class="section">
      <div class="container">
        <div v-if="leaders.length" class="columns is-multiline">
          <baseball-card
            v-for="leader in leaders"
            :name="leader.Name"
            :ward="leader.Ward"
            :party="leader.Party"
            :photo="leader.Photo"
            :photoOffset="leader['Photo Offset']"
            :partyTurnout="leader['Party Turnout']"
            :partyRegistered="leader['Party Registered']"
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
    leaders: (state) => state.leaders.filter((leader) => leader.Party === 'D')
  }),
  components: {
    'hero': Hero,
    'baseball-card': BaseballCard
  },
  methods: mapActions({
    fetchLeaders: 'FETCH_LEADERS'
  }),
  created () {
    this.fetchLeaders()
  }
}
</script>
