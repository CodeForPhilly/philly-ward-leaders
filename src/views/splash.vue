<template>
  <section class="hero is-info is-medium">
    <div class="hero-body">
      <div class="container">
        <h1 class="title">
          Philly Ward Leaders
        </h1>
        <h2 class="subtitle">
          Shining a spotlight on the powerful players behind Philadelphia elections.
        </h2>
        <router-link to="/leaders" class="button is-primary is-large">Get started</router-link>
        <p>Had you heard of all the candidates for judge last time you voted? How about City Council at-Large?
           When you voted, a neighbor of yours likely handed you a ballot of candidates endorsed by your
           <abbr v-tooltip="'A roughly neighborhood-sized geographical division of the city'">ward</abbr>.
           If you haven’t heard of the candidates, why not take your neighbor’s advice?</p>
        <p>These endorsements are determined by Ward Leaders, and have a huge influence over who gets elected in Philadelphia. As powerful and few as they are (69), ward leaders tend to remain behind the scenes and most voters don’t even know who theirs is. This transparency web site aims to bring a level of spotlight to ward leaders that is more proportional to the power they wield.</p>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: mapGetters([
    'isLeadersFetched'
  ]),
  methods: mapActions({
    fetchLeaders: 'FETCH_LEADERS'
  }),
  created () {
    if (!this.isLeadersFetched) {
      this.fetchLeaders()
    }
  }
}
</script>

<style scoped lang="sass">
.button
  min-width: 250px
  margin-bottom: 15px

p
  margin-bottom: 15px

abbr
  border-bottom: dotted 1px #fff
  cursor: help
</style>
