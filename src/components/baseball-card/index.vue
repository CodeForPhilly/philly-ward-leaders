<template>
  <div class="column is-one-third flip-container">
    <div class="flipper">
      <svg class="front" ref="front"></svg>
      <svg class="back" ref="back"></svg>
      <svg class="contents" ref="content">
        <foreignObject width="100%" height="100%">
          <body>
            <div class="stats">
              <h3>{{ name }}<span class="ward-ordinal">{{ ward }} Ward</span></h3>
              <dl>
                <dt>Voters ({{ partyAbbr }})</dt>
                <dd>{{ registeredVotersParty }}</dd>

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

export default {
  props: [
    'name',
    'ward',
    'party',
    'photoUrl',
    'registeredVotersParty',
    'turnoutParty',
    'turnoutTotal',
    'divisionCount',
    'committeePersonCount'
  ],
  computed: {
    url () {
      return `/leaders/${this.party}/${this.ward}/${this.slug}`
    },
    slug () {
      return this.name.toString().toLowerCase().trim()
        .replace(/[^a-zA-Z0-9]/g, '-')  // Replace non-alphanumeric chars with -
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^\-|\-$/i, '')        // Remove leading/trailing hyphen
    },
    partyAbbr () {
      return this.party && this.party[0]
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
      createBack(backEl, contentsEl)
    }
  }
}
</script>

<style>
.flip-container {
	perspective: 1000;
	-webkit-perspective: 1000;
	-moz-perspective: 1000;
}
	.flip-container:hover .flipper, .flip-container.hover .flipper {
		transform: rotateY(180deg);
		-webkit-transform: rotateY(180deg);
		-moz-transform: rotateY(180deg);
	}

.flipper {
	transition: 0.6s;
	transform-style: preserve-3d;
	-webkit-transform-style: preserve-3d;
	-moz-transform-style: preserve-3d;

	position: relative;
	margin: 0 30px;
}

.front, .back {
	backface-visibility: hidden;
	-webkit-backface-visibility: hidden;
}

.back {
	position: absolute;
	top: 0;
	left: 0;
}

.front {
	z-index: 2;
	transform: rotateY(0deg);
	-webkit-transform: rotateY(0deg);
	-moz-transform: rotateY(0deg);
}

.back {
	transform: rotateY(180deg);
	-webkit-transform: rotateY(180deg);
	-moz-transform: rotateY(180deg);
}

.flip-container:hover .flipper, .flip-container.hover .flipper, .flip-container.flip .flipper {
	transform: rotateY(180deg);
	-webkit-transform: rotateY(180deg);
	-moz-transform: rotateY(180deg);
}

.stats {
     padding: 25px 25px;

     /* -webkit-box-shadow: 0px 0px 5px 2px rgba(0,0,0,0.75); */
     /*-moz-box-shadow: 0px 0px 5px 2px rgba(0,0,0,0.75);*/
     /* box-shadow: 0px 0px 5px 2px rgba(0,0,0,0.75); */
     /* position: relative; */
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
.stats dt { width: 60%; overflow: hidden; }
.stats .button {
  margin-top: 15px;
  position: static;
  width: 100%;
}
</style>
