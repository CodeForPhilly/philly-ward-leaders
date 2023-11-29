<template>
  <section class="hero is-info">
    <div class="container">
      <div class="box">
        <div class="hero-body">
          <div class="feedback">
            <h1 class="title">Feedback Form</h1>
            <h1>{{ msg }}</h1>
            <br>
            <form v-if="!submitted">
              <div class="radio-form">
                <div v-for="radio in radioList" :key="radio.id">
                  <input :name="radio.id" required v-model="formData.selectedOption" type="radio" :id="radio.id"
                    :value="radio.id" />
                  <label :for="radio.id">{{ radio.label }}</label>
                </div>
              </div>
              <div class="form-text" v-if="formData.selectedOption === 'what-other'">
                <label for="otherText">Please specify</label>
                <input type="text" id="otherText" name="otherText" v-model="formData.otherText" size="40"/>
              </div>
              <br>
              <div class="form-text">
                <label for="tellUsAboutIt">Tell us about it <span aria-label="Required question">*</span></label>
                <textarea name="tellUsAboutIt" id="tellUsAboutIt" v-model="formData.tellUsAboutIt" cols="40"
                  rows="4" required></textarea>
              </div>
              <div class="form-text">
                <label for="howDoYouKnow">How do you know</label>
                <textarea name="howDoYouKnow" id="howDoYouKnow" v-model="formData.howDoYouKnow" cols="40"
                  rows="2" size="40"></textarea>
              </div>
              <div class="form-text">
                <label for="thePageWhereItHappened">The page where it happened</label>
                <input type="text" id="thePageWhereItHappened" name="thePageWhereItHappened"
                  v-model="formData.thePageWhereItHappened" size="40"/>
              </div>
              <div class="form-text">
                <label for="yourEmail">Your email</label>
                <input type='text' id='yourEmail' name='yourEmail' v-model="formData.yourEmail" size="40"/>
              </div>
              <br>
              <div class="form-text">
                <button :disabled="noInput" class="button is-primary is-small" type="submit"
                  @click.prevent="submitFormPost">Submit
                  Feedback</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Feedback',
  data () {
    return {
      submitted: false,
      msg: 'What happened?',
      radioList: [
        { id: 'what-wrong', label: 'Something went wrong' },
        { id: 'what-suggest', label: 'I have a suggestion' },
        { id: 'what-error', label: 'I found a content or data error' },
        { id: 'what-confused', label: 'Something is confusing' },
        { id: 'what-nice', label: 'Nothing, I just want to say something nice' },
        { id: 'what-other', label: 'Other' }
      ],

      formData: {
        selectedOption: 'what-suggest',
        otherText: '',
        tellUsAboutIt: '',
        howDoYouKnow: '',
        thePageWhereItHappened: '',
        yourEmail: ''
      }
    }
  },
  mounted () {
    if (this.$route.query.selectedOption) {
      this.formData.selectedOption = this.$route.query.selectedOption
    }
    if (this.$route.query.thePage) {
      this.formData.thePageWhereItHappened = this.$route.query.thePage
    }
    if (this.$route.query.defaultValue) {
      this.formData.tellUsAboutIt = this.$route.query.defaultValue
    }
  },
  computed: {
    formParams () {
      const selectedRadio = this.radioList.find(radio => radio.id === this.formData.selectedOption)
      const currTime = Date.now()
      const params = {
        submit: 'Submit',
        'entry.843445704': this.formData.tellUsAboutIt,
        'entry.584749072': this.formData.howDoYouKnow,
        'entry.1794541886': this.formData.thePageWhereItHappened,
        'entry.1040622557': this.formData.yourEmail,
        'entry.852279778': currTime.toString()
      }

      if (selectedRadio) {
        const entryId = 'entry.564578111'
        if (selectedRadio.id === 'what-other') {
          params[entryId] = '__other_option__'
          params[`${entryId}.other_option_response`] = this.formData.otherText
        } else {
          params[entryId] = selectedRadio.label
        }
      }
      return params
    },

    noInput () {
      return this.formData.tellUsAboutIt.length === 0
    },
    formUrl () {
      return 'https://docs.google.com/forms/d/e/1FAIpQLSf5gGHLck-Uv6WayZjgEYysfLxe_xpPxB9jiB9qv7LWEpbjZg/formResponse'
    }
  },
  methods: {
    submitFormPost () {
      const bodyFormData = new FormData()
      Object.entries(this.formParams).forEach(([key, value]) => {
        bodyFormData.append(key, value)
      })
      axios.post(this.formUrl, bodyFormData)
        .catch(function (error) {
          console.log(error)
        })
      this.submitted = true
      this.msg = 'Thank you for your feedback!'
    }
  }
}
</script>

<style scoped lang="sass">
.hero.is-info
  display: flex
  justify-content: center
  align-items: center
  min-height: 100vh

.container
  max-width: 600px

.box
  background-color: rgba(255, 255, 255, 0.7)
  border-radius: 8px
  padding: 30px
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)

.feedback
  width: 100%

.form-text label
  display: block
  margin-top: 5px

.button
  min-width: 250px
  margin-bottom: 15px

p
  margin-bottom: 15px

abbr
  border-bottom: dotted 1px #333
  cursor: help
</style>
