<template>
  <v-map
    class="map"
    :zoom="zoom"
    :center="center">
    <v-tilelayer
      :url="tileUrl"
      :attribution="tileAttribution"
    :params="tileOpts"></v-tilelayer>
    <v-geojson-layer
      v-if="isBoundariesLoaded"
      :geojson="boundaries"
      :options="geojsonOpts"></v-geojson-layer>
  </v-map>
</template>

<script>
import { Map, TileLayer, GeoJSON } from 'vue2-leaflet'
import { mapState, mapActions } from 'vuex'

import WardPopup from '../components/ward-popup.vue'
const WardPopupConstructor = WardPopup._Ctor[0] // See #127

export default {
  components: {
    'v-map': Map,
    'v-tilelayer': TileLayer,
    'v-geojson-layer': GeoJSON
  },
  data () {
    return {
      zoom: 12,
      center: [39.9523893, -75.1636291],
      tileAttribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      tileUrl: 'http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}',
      tileOpts: {
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 20,
        ext: 'png'
      },
      geojsonOpts: {
        style: () => ({
          weight: 2,
          color: '#04576F',
          opacity: 0.8,
          fillColor: '#2284a1',
          fillOpacity: 0.4
        }),
        onEachFeature (feature, layer) {
          const propsData = {
            ward: feature.properties.WARD_NUM
          }
          const vm = new WardPopupConstructor({ propsData }).$mount()
          layer.bindPopup(vm.$el)
        }
      }
    }
  },
  computed: {
    ...mapState({
      boundaries: (state) => state.citywideBoundaries
    }),
    isBoundariesLoaded () {
      return ('type' in this.boundaries)
    }
  },
  methods: mapActions({
    fetchCitywideBoundaries: 'FETCH_CITYWIDE_BOUNDARIES'
  }),
  created () {
    this.fetchCitywideBoundaries()
  }
}
</script>

<style lang="scss">
@import "~leaflet/dist/leaflet.css";

.map {
  height: 100vh;
}
</style>
