<template>
  <div class="column">
    <div class="card committee-person">
      <div class="card-content">
        <p class="title is-4">{{ fullName }}</p>
        <p class="subtitle is-6">{{ division | ordinalize }} Division</p>
        <div class="content">{{ address }}</div>
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
    'address'
  ],
  filters: {
    ordinalize
  }
}
</script>

<style scoped lang="sass">
.committee-person
  min-width: 250px
</style>
