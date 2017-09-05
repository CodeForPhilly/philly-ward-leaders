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
      <nav class="level">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Voters ({{ leader.Party }})</p>
            <p class="title">{{ leader['Party Registered'] }}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Turnout ({{ leader.Party }})</p>
            <p class="title">{{ leader['Party Turnout'] }}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Divisions</p>
            <p class="title">{{ leader.Divisions }}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Vacancies</p>
            <p class="title">{{ vacancies }}</p>
          </div>
        </div>
      </nav>
    </section>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

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
    vacancies () {
      return this.leader.Divisions * 2 - this.leader['Committee People']
    }
  }
}
</script>
