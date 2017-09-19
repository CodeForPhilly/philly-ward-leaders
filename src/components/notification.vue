<template>
  <div class="notification is-danger">
    <button class="delete" @click.prevent="$emit('dismiss')"></button>
    {{ msg }}
  </div>
</template>

<script>
module.exports = {
  props: [ 'msg' ]
}
</script>

<style>
.notification {
  margin: 0 auto;
  width: 80%;
}
</style>
