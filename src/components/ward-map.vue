<template>
  <v-map style="height: 350px" :zoom="zoom" :center="center" :options="mapOpts">
    <v-tilelayer :url="url" :attribution="attribution" :params="tileLayerOpts"></v-tilelayer>
  </v-map>
</template>

<script>
import { Map, TileLayer } from 'vue2-leaflet'

export default {
  name: 'ward-map',
  components: {
    'v-map': Map,
    'v-tilelayer': TileLayer
  },
  data () {
    return {
      zoom: 16,
      center: [39.9523893, -75.1636291],
      mapOpts: {
        scrollWheelZoom: false
      },
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      url: 'http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}',
      tileLayerOpts: {
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 20,
        ext: 'png'
      }
    }
  }
}
</script>

<style lang="scss">
@import "~leaflet/dist/leaflet.css";
</style>
