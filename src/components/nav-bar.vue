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
        <router-link to="/leaders" class="navbar-item">
          Leaders
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
      const btnEl = evt.target
      const menuId = btnEl.dataset.target
      const menuEl = document.getElementById(menuId)

      btnEl.classList.toggle('is-active')
      menuEl.classList.toggle('is-active')
    }
  }
}
</script>
