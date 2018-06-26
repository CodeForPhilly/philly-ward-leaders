<template>
  <div class="column">
    <div class="card committee-person">
      <div class="card-content">
        <p class="title is-4">{{ fullName }}</p>
        <p class="subtitle is-6">
          <span>{{ division | ordinalize }} Division</span>
          <span v-if="title">&amp; {{ title }}</span>
        </p>
        <div class="content">
          <address>{{ address }}</address>
          <a v-if="email" :href="'mailto:' + email">{{ email }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ordinalize } from '../util'

export default {
  name: 'CommitteePerson',
  props: [
    'fullName',
    'division',
    'address',
    'title',
    'email'
  ],
  filters: {
    ordinalize
  }
}
</script>

<style scoped lang="sass">
.committee-person
  min-width: 250px

address
  font-style: inherit
</style>
