<template>
</template>

<script>
// See Leaflet Plugins section of Vue2Leaflet docs:
// https://github.com/KoRiGaN/Vue2Leaflet#leaflet-plugins
// (This should be moved to its own module)
import L from 'leaflet'
import 'leaflet-geocoder-mapzen'
import pick from 'lodash/pick'

// See https://github.com/KoRiGaN/Vue2Leaflet/issues/28
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.imagePath = ''
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

const events = [
  'results',
  'error',
  'select',
  'highlight',
  'expand',
  'collapse',
  'reset',
  'focus',
  'blur'
]

const props = {
  apikey: {
    type: String
  },
  bounds: {
    type: Boolean,
    default: false
  },
  expanded: {
    type: Boolean,
    default: false
  },
  position: {
    type: String,
    default: 'topleft'
  },
  placeholder: {
    type: String
  },
  options: {
    type: Object,
    default: () => ({})
  }
}

export default {
  props,
  mounted () {
    const overrides = pick(this, ['bounds', 'placeholder', 'expanded', 'position'])
    const opts = Object.assign({}, this.options, overrides)

    this.geocoder = L.control.geocoder(this.apikey, opts)
    eventsBinder(this, this.geocoder, events)
    if (this.$parent._isMounted) {
      this.deferredMountedTo(this.$parent.mapObject)
    }
  },
  methods: {
    deferredMountedTo (parent) {
      this.parent = parent
      this.geocoder.addTo(parent)
      for (var i = 0; i < this.$children.lenth; i++) {
        this.$children[i].deferredMountedTo(parent)
      }
    },
    setVisible (newVal, oldVal) {
      if (newVal === oldVal) return
      if (newVal) {
        this.geocoder.addTo(this.parent)
      } else {
        this.parent.removeLayer(this.geocoder)
      }
    }
  }
}

// Copied from vue2-leaflet/src/utils/eventsBinder.js
// Can't import it because babel won't transpile files from node_modules
function eventsBinder (vueElement, leaflet, events) {
  for (var i = 0; i < events.length; i++) {
    const exposedName = 'l-' + events[i]
    const eventName = events[i]
    leaflet.on(eventName, (ev) => {
      vueElement.$emit(exposedName, ev)
    })
  }
}
</script>

<style>
@import '~leaflet-geocoder-mapzen/dist/leaflet-geocoder-mapzen.css';
</style>
