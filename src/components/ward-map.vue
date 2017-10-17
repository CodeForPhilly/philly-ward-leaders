<template>
  <v-map
    v-if="isBoundariesLoaded"
    class="map"
    :zoom="zoom"
    :center="center"
    :options="mapOpts"
    ref="map">
    <v-tilelayer
      :url="url"
      :attribution="attribution"
      :params="tileOpts"></v-tilelayer>
    <v-geojson-layer
      :geojson="boundaries"
      :options="geojsonOpts"
      ref="geojson"></v-geojson-layer>
  </v-map>
</template>

<script>
import { Map, TileLayer, GeoJSON } from 'vue2-leaflet'

import { ordinalize } from '../util'

export default {
  name: 'ward-map',
  props: [
    'ward',
    'boundaries',
    'committeePersons'
  ],
  components: {
    'v-map': Map,
    'v-tilelayer': TileLayer,
    'v-geojson-layer': GeoJSON
  },
  data () {
    return {
      zoom: 12,
      center: [39.9523893, -75.1636291],
      mapOpts: {
        scrollWheelZoom: false
      },
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      url: 'http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png',
      tileOpts: {
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 20
      },
      geojsonOpts: {
        style: () => ({
          weight: 2,
          color: '#04576F',
          opacity: 0.8,
          fillColor: '#2284a1',
          fillOpacity: 0.4
        }),
        onEachFeature: (feature, layer) => {
          const division = +feature.properties.division
          const ordinal = ordinalize(division)
          const label = `${ordinal} Division`
          layer.bindTooltip(label)
        }
      }
    }
  },
  computed: {
    isBoundariesLoaded () {
      return ('type' in this.boundaries)
    }
  },
  mounted () {
    this.zoomToWard()
  },
  updated () {
    this.zoomToWard()
  },
  methods: {
    zoomToWard () {
      const map = this.$refs.map
      const geojsonLayer = this.$refs.geojson
      if (map && geojsonLayer) {
        const bounds = geojsonLayer.getBounds()
        map.fitBounds(bounds)
      }
    }
  }
}
</script>

<style lang="sass">
@import "~leaflet/dist/leaflet.css"

.map
  height: 350px
</style>
