<template>
  <l-map
    ref="map"
    class="citywide-map"
    :zoom="zoom"
    :center="center"
    :use-global-leaflet="false">
    <l-tile-layer
      :url="tileUrl"
      :attribution="tileAttribution"
      :params="tileOpts"></l-tile-layer>
    <l-geo-json
      ref="geojsonLayer"
      v-if="isBoundariesLoaded"
      :geojson="boundaries"
      :options="geojsonOpts"></l-geo-json>
  </l-map>
</template>

<script>
import { LMap, LTileLayer, LGeoJson } from '@vue-leaflet/vue-leaflet'
import { mapState, mapActions, mapGetters } from 'vuex'

import { ordinalize, slugify } from '../util'
import "leaflet/dist/leaflet.css";

export default {
  components: {
    LMap,
    LTileLayer,
    LGeoJson,
  },
  data () {
    return {
      zoom: 12,
      center: [39.9523893, -75.1636291],
      tileAttribution: '&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> <a href="https://stamen.com/" target="_blank">&copy; Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/about" target="_blank">OpenStreetMap</a> contributors',
      tileUrl: 'https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}.png',
      tileOpts: {
        minZoom: 11,
        maxZoom: 100
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
  methods: {
    ...mapActions({
      fetchCitywideBoundaries: 'FETCH_CITYWIDE_BOUNDARIES',
      fetchLeaders: 'FETCH_LEADERS'
    }),
  },
  created () {
    this.fetchCitywideBoundaries()
    this.fetchLeaders()
  },
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
.citywide-map {
  position:absolute;
  height: 100%;
}

.leader-buttons .button {
  width: 100%;
}
</style>
