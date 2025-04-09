<template>
  <router-link :to="feedbackLink">{{ label }}</router-link>
</template>

<script>
export default {
  props: {
    thePage: { type: String },
    detail: { type: String },
    label: { type: String, default: "Know it?" },
    defaultValue: { type: String, default: "" },
  },
  computed: {
    feedbackLink() {
      const opts = {
        thePage: this.thePage,
        defaultValue: this.defaultValue,
      };
      if (this.detail) {
        opts.selectedOption = "what-error";
        opts.defaultValue = `${this.detail} should be: `;
      }
      return {
        name: "feedback",
        query: opts,
      };
    },
  },
};
</script>
