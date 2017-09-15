<template>
  <div>
    <h1>{{ title }}</h1>
    <div v-html="content"></div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import marked from 'marked'

export default {
  props: [ 'slug' ],
  computed: mapState({
    title: (state) => state.contentPage.title,
    content: (state) => marked(state.contentPage.content)
  }),
  methods: mapActions({
    fetchContentPage: 'FETCH_CONTENT_PAGE'
  }),
  created () {
    this.fetchContentPage(this.slug)
  },
  watch: {
    slug (newValue) {
      this.fetchContentPage(newValue)
    }
  }
}
</script>
