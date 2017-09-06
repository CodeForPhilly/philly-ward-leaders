<template>
  <div id="app">
    <nav-bar></nav-bar>
    <router-view></router-view>
  </div>
</template>

<script>
import NavBar from './components/nav-bar.vue'

export default {
  components: {
    'nav-bar': NavBar
  }
}
</script>

<style lang="scss">
@import "~bulma/sass/utilities/initial-variables";

$blue: #04576F;
$light-blue: #2284a1;

$navbar-background-color: $light-blue;
$navbar-item-color: $white;
$primary: $light-blue;

@import "~bulma";
</style>
