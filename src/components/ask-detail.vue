<template>
  <router-link :to="feedbackLink">{{ label }}</router-link>
</template>

<script>

export default {
  props: {
    fullName: { type: String },
    detail: { type: String },
    label: { type: String, default: 'Know it?' },
    defaultValue: { type: String, default: '' }
  },
  computed: {
    feedbackLink () {
      const opts = {
        thePage: this.fullName,
        defaultValue: this.defaultValue,
        selectedOption: this.detail ? '3' : null
      }
      return {
        name: 'feedback',
        query: opts
      }
    }
  }
}
</script>



