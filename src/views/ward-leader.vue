<template>
  <div v-if="leader.fullName && wardBoundaries.features">
    <section class="hero is-info">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            {{ leader.fullName }}
            <span v-if="leader.nickname"><br />({{ leader.nickname }})</span>
          </h1>
          <h2 class="subtitle">
            {{ ordinalizeNumber(leader.ward) }}
            <span v-if="leader.subWard">({{ leader.subWard }})</span>
            Ward Leader,
            {{ partyTitle }} Party
          </h2>
        </div>
      </div>
    </section>

    <section class="section stats-bar is-hidden-mobile">
      <stats-bar
        :party="leader.party"
        :registered-voters-party="leader.registeredVotersParty"
        :turnout-party-percent="turnoutPartyPercent"
        :division-count="wardBoundaries.features.length"
        :vacancy-count="vacancyCount"
      ></stats-bar>
    </section>

    <section class="section leader-info">
      <div class="container">
        <div class="columns">
          <div class="column">
            <figure class="image" v-if="leader.photo">
              <img :src="leader.photo" />
              <ask-detail
                :thePage="feedbackPage"
                detail="Photo"
                label="Have a better photo?"
              ></ask-detail>
            </figure>
            <figure class="image" v-else>
              <img src="../assets/photo-placeholder.png" />
              <ask-detail
                :thePage="feedbackPage"
                detail="Photo"
                label="Have a photo?"
              ></ask-detail>
            </figure>
          </div>
          <div class="column">
            <dl>
              <dt>Registered voters</dt>
              <dd>
                {{ formatNumber(leader.registeredVotersParty) }}
                {{ partyPlural }} of
                {{ formatNumber(leader.registeredVotersTotal) }}
                total ({{ registeredVotersPercent }}%)
              </dd>

              <dt>Turnout ({{ turnoutElection }})</dt>
              <dd>
                {{ formatNumber(leader.turnoutParty) }}
                {{ partyPlural }}
                ({{ turnoutPartyPercent }}%)
                <br />
                {{ formatNumber(leader.turnoutTotal) }}
                total ({{ turnoutTotalPercent }}%)
              </dd>

              <dt>
                <span
                  class="explanation"
                  title="How many divisions make up the ward"
                >
                  Divisions
                </span>
              </dt>
              <dd>{{ wardBoundaries.features.length }}</dd>

              <dt>
                <span
                  class="explanation"
                  title="Each division elects 2 committee persons"
                >
                  Committee Persons
                </span>
              </dt>
              <dd>
                {{ committeePersonCount }}
                ({{ vacanciesCount }}
                <span
                  class="explanation"
                  title="Each division elects 2 committee persons"
                >
                  vacancies
                </span>
                )
              </dd>
            </dl>
          </div>
          <div class="column">
            <dl>
              <dt>Address</dt>
              <dd v-if="leader.address">{{ leader.address }}</dd>
              <dd v-else>
                <span class="unknown">Unknown | </span>
                <ask-detail
                  :thePage="feedbackPage"
                  detail="Address"
                ></ask-detail>
              </dd>

              <dt>Phone</dt>
              <dd v-if="leader.phone">{{ leader.phone }}</dd>
              <dd v-else>
                <span class="unknown">Unknown | </span>
                <ask-detail :thePage="feedbackPage" detail="Phone"></ask-detail>
              </dd>

              <dt>Age</dt>
              <dd v-if="age">{{ age }}</dd>
              <dd v-else>
                <span class="unknown">Unknown | </span>
                <ask-detail :thePage="feedbackPage" detail="Age"></ask-detail>
              </dd>

              <dt>Gender</dt>
              <dd v-if="leader.gender">{{ leader.gender }}</dd>
              <dd v-else>
                <span class="unknown">Unknown | </span>
                <ask-detail
                  :thePage="feedbackPage"
                  detail="Gender"
                ></ask-detail>
              </dd>

              <dt>Occupation</dt>
              <dd v-if="leader.occupation">{{ leader.occupation }}</dd>
              <dd v-else>
                <span class="unknown">Unknown | </span>
                <ask-detail :thePage="feedbackPage" detail="Occupation">
                </ask-detail>
              </dd>
            </dl>
          </div>
          <div class="column">
            <dl>
              <dt>Email</dt>
              <dd v-if="leader.email">
                <a :href="'mailto:' + leader.email">{{ leader.email }}</a>
              </dd>
              <dd v-else>
                <span class="unknown">Unknown | </span>
                <ask-detail :thePage="feedbackPage" detail="Email"></ask-detail>
              </dd>

              <dt>Social Media</dt>
              <dd>
                <ul>
                  <li v-if="leader.linkedin">
                    <a :href="leader.linkedin">LinkedIn</a>
                  </li>
                  <li v-if="leader.facebook">
                    <a :href="leader.facebook">Facebook</a>
                  </li>
                  <li v-if="leader.twitter">
                    <a :href="leader.twitter">Twitter</a>
                  </li>
                </ul>
                <ask-detail
                  :thePage="feedbackPage"
                  detail="Social media"
                  label="Know a link?"
                ></ask-detail>
              </dd>
              <dt
                v-if="
                  leader.campaignFinanceReports &&
                  leader.campaignFinanceReports.length > 0
                "
              >
                Campaign Finance Reports
              </dt>
              <dd>
                <ul>
                  <li
                    v-for="report in leader.campaignFinanceReports"
                    :key="report.title"
                  >
                    <a :href="report.url">
                      {{ report.year }}
                    </a>
                  </li>
                </ul>
              </dd>
            </dl>
          </div>
        </div>
        <p class="has-text-centered">
          Is this information incorrect?
          <ask-detail :thePage="feedbackPage" label="Let us know"></ask-detail>
        </p>
      </div>
    </section>

    <section v-if="wardBoundaries">
      <ward-map
        style="height: 350px; margin: 10px"
        :ward="leader.ward"
        :boundaries="wardBoundaries"
        :committeePersons="committeePersons"
      ></ward-map>
    </section>

    <section class="section" v-if="committeePersons">
      <div class="container">
        <h2 class="title is-2">Committee Persons</h2>
        <div class="columns is-multiline">
          <committee-person
            v-for="person in allCommitteePersons"
            :key="person.id"
            :fullName="person.fullName"
            :division="person.division"
            :address="person.address"
            :title="person.title"
            :email="person.email"
          ></committee-person>
        </div>
      </div>
    </section>

    <div class="modal is-active" v-show="modalUrl">
      <div class="modal-background" @click="modalUrl = null" />
      <div class="modal-content">
        <p class="image">
          <img :src="modalUrl" />
        </p>
      </div>
      <button
        @click="modalUrl = null"
        class="modal-close is-large"
        aria-label="close"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

import StatsBar from "../components/stats-bar.vue";
import CommitteePerson from "../components/committee-person.vue";
import WardMap from "../components/ward-map.vue";
import AskDetail from "../components/ask-detail.vue";
import { formatNumber, ordinalize } from "../util";
import { TURNOUT_ELECTION } from "../config";

export default {
  props: ["party", "ward", "slug"],
  data() {
    return {
      turnoutElection: TURNOUT_ELECTION,
      modalUrl: null,
    };
  },
  computed: {
    ...mapState({
      leader: (state) => state.currentLeader.leader,
      committeePersons: (state) => state.currentLeader.committeePersons,
      wardBoundaries: (state) => state.currentLeader.wardBoundaries,
    }),
    ...mapGetters([
      "partyPlural",
      "partyTitle",
      "registeredVotersPercent",
      "turnoutPartyPercent",
      "turnoutTotalPercent",
      "vacancyCount",
      "age",
    ]),
    feedbackPage() {
      return `${this.leader.fullName} (Ward ${this.leader.ward} ${this.leader.party})`;
    },
    allCommitteePersons() {
      const commPersons = this.committeePersons;
      // Get all divisions from ward boundaries
      const allDivisions = this.wardBoundaries.features.map(
        (x) => x.properties.division,
      );
      const vacantPerson = (division, subDivision, subDivisionId) => {
        return {
          ward: this.ward,
          fullName: "VACANT",
          division: division,
          party: this.party,
          address: `Division ${subDivision}`,
          id: subDivisionId,
          zip: "",
        };
      };
      let committeePersonsList = [];
      // Add placeholder objects for vacant divisions
      let wardName = this.ward;
      if (hasSubWard(this.ward)) {
        wardName = splitSubWard(this.ward).ward;
      }
      let wardString = wardName.toString().padStart(2, "0");
      let partyString = this.party.slice(0, 3).toUpperCase();
      for (let div in allDivisions) {
        let division = allDivisions[div];
        let divisionId = `${wardString}-${division.toString().padStart(2, "0")}-${partyString}`;
        let subDivisions = ["A", "B"];

        for (let subDiv in subDivisions) {
          let subDivision = subDivisions[subDiv];
          let subDivisionId = `${divisionId}-${subDivision}`;
          // Check for sub division id in ward leader data and add placeholder if missing
          let personData = commPersons.find((c) => c.id === subDivisionId);
          committeePersonsList.push(
            personData || vacantPerson(division, subDivision, subDivisionId),
          );
        }
      }
      // Sort output by id
      committeePersonsList.sort((a, b) => {
        if (a.id === b.id) {
          return 0;
        }
        return a.id < b.id ? -1 : 1;
      });
      return committeePersonsList;
    },
    committeePersonCount() {
      return this.wardBoundaries.features.length * 2;
    },
    vacanciesCount() {
      return this.allCommitteePersons.filter((p) => p.fullName === "VACANT")
        .length;
    },
  },
  methods: {
    ...mapActions({
      fetchLeader: "FETCH_LEADER",
      fetchCommitteePersons: "FETCH_COMMITTEE_PERSONS",
      fetchWardBoundaries: "FETCH_WARD_BOUNDARIES",
    }),
    ordinalizeNumber(number) {
      return ordinalize(number);
    },
    formatNumber(number) {
      return formatNumber(number);
    },
  },
  async created() {
    const opts = {
      party: this.party,
    };

    if (hasSubWard(this.ward)) {
      const { ward, subWard } = splitSubWard(this.ward);
      opts.ward = ward;
      opts.subWard = subWard;
    } else {
      opts.ward = this.ward;
    }

    await this.fetchLeader(opts);
    await this.fetchCommitteePersons(opts);
    await this.fetchWardBoundaries(this.ward); // `ward` prop may include suffix for sub ward
  },
  components: {
    "stats-bar": StatsBar,
    "committee-person": CommitteePerson,
    "ward-map": WardMap,
    "ask-detail": AskDetail,
  },
};

function hasSubWard(ward) {
  const lastChar = ward.slice(-1);
  return /[A-Za-z]/.test(lastChar);
}

function splitSubWard(ward) {
  return {
    ward: ward.slice(0, -1),
    subWard: ward.slice(-1),
  };
}
</script>

<style lang="sass" scoped>
.stats-bar
  padding: 3rem 1.5rem 1.5rem 1.5rem

.leader-info
  padding-bottom: 0

dt
  font-weight: bold
  letter-spacing: 1px

.explanation
  border-bottom: dotted 1px #4a4a4a
  cursor: help

dd
  margin-bottom: 15px

.unknown
  letter-spacing: 1px
  font-size: 80%

.modal
  z-index: 999999

.sample-ballots
  margin-bottom: 15px

  li,
  li figure
    display: inline-block
</style>
