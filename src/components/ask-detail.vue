<template>
  <a :href="href">{{ label }}</a>
</template>

<script>
import qs from 'query-string'

const FEEDBACK_URL = 'http://form.jotform.us/form/50926595605160'

export default {
  props: {
    fullName: { type: String },
    detail: { type: String },
    label: { type: String, default: 'Know it?' }
  },
  computed: {
    href () {
      const opts = {
        thePage: this.fullName,
        whatHappened: 'I found a content or data error'
      }
      if (this.detail) {
        opts.tellUs = `${this.detail} should be: `
      }
      const query = qs.stringify(opts)
      return `${FEEDBACK_URL}?${query}`
    }
  }
}
</script>
