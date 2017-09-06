<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <router-link to="/" class="navbar-item">
        Philly Ward Leaders
      </router-link>

      <div class="navbar-burger" @click="toggleMenu" data-target="navMenu">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>

    <div class="navbar-menu" id="navMenu">
      <div class="navbar-start"></div>
      <div class="navbar-end">
        <router-link to="/" class="navbar-item">
          Home
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  methods: {
    toggleMenu (evt) {
      const btnEl = evt.target
      const menuId = btnEl.dataset.target
      const menuEl = document.getElementById(menuId)

      btnEl.classList.toggle('is-active')
      menuEl.classList.toggle('is-active')
    }
  }
}
</script>
