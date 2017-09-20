<template>
  <div>
    <h4 class="title is-4">{{ ward | ordinalize }} Ward</h4>
  </div>
</template>

<script>
import { ordinalize } from '../util'

export default {
  props: [ 'ward' ],
  filters: {
    ordinalize
  }
}
</script>
