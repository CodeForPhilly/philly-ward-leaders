<template>
  <v-map
    class="map citywide-map"
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
import { mapState, mapActions, mapGetters } from 'vuex'

import { ordinalize, slugify } from '../util'

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
        onEachFeature: (feature, layer) => {
          const ward = +feature.properties.WARD_NUM
          const democrat = this.findLeader(ward, 'democratic') || {}
          const republican = this.findLeader(ward, 'republican') || {}
          const template = popupTemplate(ward, democrat.fullName, republican.fullName)
          layer.bindPopup(template)
        }
      }
    }
  },
  computed: {
    ...mapState({
      boundaries: (state) => state.citywideBoundaries,
      leaders: (state) => state.leaders
    }),
    ...mapGetters([
      'findLeader'
    ]),
    isBoundariesLoaded () {
      return ('type' in this.boundaries) && (this.leaders.length > 0)
    }
  },
  methods: mapActions({
    fetchCitywideBoundaries: 'FETCH_CITYWIDE_BOUNDARIES',
    fetchLeaders: 'FETCH_LEADERS'
  }),
  created () {
    this.fetchCitywideBoundaries()
    this.fetchLeaders()
  }
}

function popupTemplate (ward, democratFullName, republicanFullName) {
  const demButton = leaderButton(ward, 'democratic', democratFullName)
  const repButton = leaderButton(ward, 'republican', republicanFullName)

  return `
    <div>
      <h4 class="title is-4">
        ${ordinalize(ward)} Ward
      </h4>
      <ul class="leader-buttons">
        ${demButton}
        ${repButton}
      </ul>
    </div>
  `

  function leaderButton (ward, party, fullName) {
    if (!fullName) {
      return ''
    }
    const slug = slugify(fullName)
    const url = `/leaders/${party}/${ward}/${slug}`
    const partyAbbr = (party === 'democratic') ? 'D' : 'R'

    return `
      <li>
        <a href="${url}" class="button">${fullName} (${partyAbbr})</a>
      </li>
    `
  }
}
</script>

<style>
@import "~leaflet/dist/leaflet.css";

.citywide-map {
  height: calc(100vh - 52px);
}
.leader-buttons .button {
  width: 100%;
}
</style>
