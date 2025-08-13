<template>
  <li v-for="(link, index) in links" :key="index">
    <a
      :href="link.url"
      target="_blank"
      rel="noopener noreferrer"
      :title="link.title"
      >{{ link.platform }}</a
    >
  </li>
</template>

<script>
export default {
  name: "links-list",
  props: {
    links: {
      type: Array,
      required: true,
      validator: (links) => {
        return links.every((link) => "title" in link && "url" in link);
      },
    },
  },
};
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}
</style>
