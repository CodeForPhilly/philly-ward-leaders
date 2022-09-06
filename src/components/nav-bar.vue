<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <router-link to="/" class="navbar-item">
        Philly Ward Leaders
      </router-link>

      <div class="navbar-burger" @click="toggleMenu" ref="burger">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>

    <div class="navbar-menu" ref="menu">
      <div class="navbar-start"></div>
      <div class="navbar-end" @click="collapseMenu">
        <router-link to="/leaders" class="navbar-item">
          Leaders
        </router-link>
        <router-link to="/map" class="navbar-item">
          Ward Map
        </router-link>
        <router-link to="/learn" class="navbar-item">
          Learn More
        </router-link>
        <router-link to="/party-rules" class="navbar-item">
          Party Rules
        </router-link>
        <router-link to="/about" class="navbar-item">
          About
        </router-link>
        <a class="navbar-item" href="http://form.jotform.us/form/50926595605160">
          Feedback
        </a>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  methods: {
    toggleMenu (evt) {
      const btnEl = this.$refs.burger
      const menuEl = this.$refs.menu

      btnEl.classList.toggle('is-active')
      menuEl.classList.toggle('is-active')
    },
    collapseMenu () {
      const btnEl = this.$refs.burger
      const menuEl = this.$refs.menu

      btnEl.classList.remove('is-active')
      menuEl.classList.remove('is-active')
    }
  }
}
</script>

<style lang="sass">

.navbar-end
  background-color: #2284a1
</style>
