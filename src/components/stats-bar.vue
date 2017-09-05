<template>
  <nav class="level">
    <div class="level-item has-text-centered">
      <div>
        <p class="heading">Voters ({{ party }})</p>
        <p class="title">{{ partyRegistered }}</p>
      </div>
    </div>
    <div class="level-item has-text-centered">
      <div>
        <p class="heading">Turnout ({{ party }})</p>
        <p class="title">{{ partyTurnout }}</p>
      </div>
    </div>
    <div class="level-item has-text-centered">
      <div>
        <p class="heading">Divisions</p>
        <p class="title">{{ divisions }}</p>
      </div>
    </div>
    <div class="level-item has-text-centered">
      <div>
        <p class="heading">Vacancies</p>
        <p class="title">{{ vacancies }}</p>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  props: [
    'party',
    'party-registered',
    'party-turnout',
    'divisions',
    'vacancies'
  ]
}
</script>
