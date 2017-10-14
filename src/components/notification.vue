<template>
  <div class="notification is-danger">
    <button class="delete" @click.prevent="$emit('dismiss')"></button>
    {{ msg }}
  </div>
</template>

<script>
export default {
  name: 'notification',
  props: [ 'msg' ]
}
</script>

<style lang="sass">
.notification
  margin: 0 auto
  width: 80%
</style>
