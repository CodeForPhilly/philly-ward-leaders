<template>
  <div class="column">
    <div class="card committee-person">
      <div class="card-content">
        <p class="title is-4">{{ fullName }}</p>
        <p class="subtitle is-6">Division {{ division }}</p>
        <div class="content">{{ address }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommitteePerson',
  props: [
    'fullName',
    'division',
    'address'
  ]
}
</script>

<style scoped>
.committee-person {
  min-width: 250px;
}
</style>
