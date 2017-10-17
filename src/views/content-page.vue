<template>
  <section class="section">
    <div class="container">
      <div class="content">
        <h1>{{ title }}</h1>
        <div v-html="content" id="content"></div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import marked from 'marked'

export default {
  props: [ 'slug' ],
  computed: mapState({
    title: (state) => state.contentPage.title,
    content: (state) => {
      if (state.contentPage.content) {
        return marked(state.contentPage.content)
      }
    }
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
