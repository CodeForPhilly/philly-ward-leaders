<template>
  <ul>
    <li v-for="(link, index) in links" :key="index">
      <a :href="link.url" target="_blank" rel="noopener noreferrer">{{
        link.title
      }}</a>
    </li>
  </ul>
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
