<template>
  <l-map
    class="map"
    :zoom="zoom"
    :center="center"
    :options="mapOpts"
    :use-global-leaflet="false"
    ref="map">
    <l-tile-layer
      :url="url"
      :attribution="attribution"
      :params="tileOpts"></l-tile-layer>
    <l-geo-json
      @ready="zoomToWard"
      :geojson="boundaries"
      :options="geojsonOpts"
      ref="geojsonLayer"></l-geo-json>
  </l-map>
</template>

<script>
import { LGeoJson, LMap, LTileLayer } from '@vue-leaflet/vue-leaflet'
import { ordinalize } from '../util'
import "leaflet/dist/leaflet.css";

export default {
  name: 'ward-map',
  props: [
    'ward',
    'boundaries',
    'committeePersons'
  ],
  components: {
    LMap,
    LTileLayer,
    LGeoJson
  },
  data () {
    return {
      zoom: 14,
      center: [39.9523893, -75.1636291],
      mapOpts: {
        scrollWheelZoom: false
      },
      attribution: '&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> <a href="https://stamen.com/" target="_blank">&copy; Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/about" target="_blank">OpenStreetMap</a> contributors',
      url: 'https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}.png',
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
          const division = feature.properties.division
          const ordinal = ordinalize(division)
          const label = `${ordinal} Division`
          layer.bindTooltip(label)
        }
      }
    }
  },
  updated () {
    this.zoomToWard()
  },
  watch: {
    // Watching a single property
    boundaries(newVal, oldVal) {
      if (oldVal !== newVal) {
        this.zoomToWard()
      }
    }},
  methods: {
    zoomToWard () {
      const map = this.$refs.map
      const geojsonLayer = this.$refs.geojsonLayer
      if (map && geojsonLayer) {
        const bounds = geojsonLayer.leafletObject.getBounds()
        map.leafletObject.fitBounds(bounds)
      }
    }
  }
}
</script>

<style>
.map {
  height: 400px;
}
</style>
