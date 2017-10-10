<template>
  <div class="column is-one-third flip-container">
    <div class="flipper">
      <svg class="front" ref="front"></svg>
      <svg class="back" ref="back"></svg>
      <svg class="contents" ref="content">
        <foreignObject width="100%" height="100%">
          <body>
            <div class="stats">
              <h3>
                {{ name }}
                <span class="ward-ordinal">
                  {{ ward | ordinalize }} Ward
                </span>
              </h3>
              <dl>
                <dt>Voters ({{ partyAbbr }})</dt>
                <dd>{{ registeredVotersParty | formatNumber }}</dd>

                <dt>Turnout ({{ partyAbbr }})</dt>
                <dd>{{ turnoutPartyPercent }}%</dd>

                <dt>Vacancies</dt>
                <dd>{{ vacancies }}</dd>
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
      return `/leaders/${this.party}/${this.ward}/${this.slug}`
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
    }
  },
  filters: {
    ordinalize,
    formatNumber
  }
}
</script>

<style>
.flip-container {
  perspective: 1000px;
  transform-style: preserve-3d;
}
  .flip-container:hover .back {
    transform: rotateY(0deg);
  }

  .flip-container:hover .front {
    transform: rotateY(180deg);
  }

.flipper {
	transition: 0.6s;
	position: relative;
	margin: 0 30px;
}

.front, .back {
  backface-visibility: hidden;
  transition: 0.6s;
  transform-style: preserve-3d;
}

.back {
  position: absolute;
  top: 0;
  left: 0;
}

.front {
  z-index: 2;
  transform: rotateY(0deg);
}

.back {
  transform: rotateY(-180deg);
}

.stats {
  padding: 25px 25px;
}
.stats h3 {
  font-size: 120%;
}
.stats h3 .ward-ordinal {
  display: block;
}
.stats dt, .card .stats dd {
  margin-bottom: 0;
  float: left;
}
.stats dt {
  width: 60%;
  overflow: hidden;
}
.stats .button {
  margin-top: 15px;
  position: static;
  width: 100%;
}
</style>
