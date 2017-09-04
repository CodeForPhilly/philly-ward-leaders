<template>
  <div>
    <hero></hero>
    <section class="section">
      <div class="container">
        <div class="columns is-multiline">
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
import leaders from '../../data/ward-leaders.json'
import Hero from '../components/hero.vue'
import BaseballCard from '../components/baseball-card/index.vue'

export default {
  name: 'app',
  data () {
    return {
      leaders: leaders.filter((leader) => leader.Party === 'D')
    }
  },
  components: {
    'hero': Hero,
    'baseball-card': BaseballCard
  }
}
</script>

<style lang="scss">
@import "~bulma";
</style>
