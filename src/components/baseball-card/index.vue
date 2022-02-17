<template>
  <div class="column is-one-third flip-container" @click="noop">
    <div class="flipper">
      <div class="front">
        <svg ref="front"></svg>
      </div>
      <div class="back">
        <svg ref="back"></svg>
      </div>
      <svg class="contents" ref="content">
        <foreignObject width="100%" height="100%">
          <body>
            <div class="stats">
              <h3>
                {{ name }}
                <span class="ward-ordinal">
                  {{ ward | ordinalize }} Ward
                  {{ subWard }}
                </span>
              </h3>
              <dl>
                <dt>Voters ({{ partyAbbr }})</dt>
                <dd v-if="registeredVotersParty">{{ registeredVotersParty | formatNumber }}</dd>
                <dd v-else>Unknown</dd>

                <dt>Turnout ({{ partyAbbr }})</dt>
                <dd v-if="turnoutPartyPercent">{{ turnoutPartyPercent }}%</dd>
                <dd v-else>Unknown</dd>

                <dt>Vacancies</dt>
                <dd v-if="vacancies >= 0">{{ vacancies }}</dd>
                <dd v-else>Unknown</dd>
              </dl>
              <router-link :to="url" class="button is-info details">Details</router-link>
            </div>
          </body>
        </foreignObject>
      </svg>
    </div>
  </div>
</template>

<script>
import { createFront, createBack } from './svg'
import { slugify, ordinalize, formatNumber } from '../../util'

export default {
  props: {
    name: String,
    ward: Number,
    subWard: String,
    party: String,
    photo: {
      type: String,
      default: '../assets/photo-placeholder.png'
    },
    registeredVotersParty: Number,
    turnoutParty: Number,
    turnoutTotal: Number,
    divisionCount: Number,
    committeePersonCount: Number
  },
  computed: {
    url () {
      const wardString = this.ward + (this.subWard || '')
      return `/leaders/${this.party}/${wardString}/${this.slug}`
    },
    slug () {
      return slugify(this.name)
    },
    partyAbbr () {
      return this.party && this.party[0].toUpperCase()
    },
    turnoutPartyPercent () {
      return Math.round(this.turnoutParty / this.registeredVotersParty * 100)
    },
    vacancies () {
      return this.divisionCount * 2 - this.committeePersonCount
    }
  },
  mounted () {
    this.createCard()
  },
  updated () {
    this.createCard()
  },
  methods: {
    createCard () {
      const frontEl = this.$refs.front
      createFront(frontEl, this.$props)

      const backEl = this.$refs.back
      const contentsEl = this.$refs.content
      createBack(backEl, contentsEl, this.$props)
    },
    noop () {
      // iOS Safari requires a click handler be present in order for the CSS :hover
      // modifier to work.
      // https://stackoverflow.com/questions/18047353/fix-css-hover-on-iphone-ipad-ipod
    }
  },
  filters: {
    ordinalize,
    formatNumber
  }
}
</script>

<style lang="sass">
.flip-container
  perspective: 1000px
  transform-style: preserve-3d

  &:hover .back
    transform: rotateY(0deg)

  &:hover .front
    transform: rotateY(180deg)

.flipper
  transition: 0.6s
  position: relative
  margin: 0 30px

.front, .back
  backface-visibility: hidden
  transition: 0.6s
  transform-style: preserve-3d
  width: 100%
  height: 100%

.front
  z-index: 2
  transform: rotateY(0deg)

.back
  transform: rotateY(-180deg)
  position: absolute
  top: 0
  left: 0

.stats
  padding: 25px 25px

  h3
    font-size: 120%

    .ward-ordinal
      display: block

  dt, dd
    margin-bottom: 0
    float: left

  dt
    width: 60%
    overflow: hidden

  .button
    margin-top: 15px
    position: static
    width: 100%
</style>
