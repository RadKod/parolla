<template lang="pug">
Form.room-review-form(@keypress.enter.prevent @failed="handleFailed")
  .room-review-form__head
    Button.room-review-form-back-button(native-type="button" @click="$emit('onClickBackButton')")
      Icon.room-review-form-back-button__icon(name="arrow-left")
      span.room-review-form-back-button__title {{ $t('form.roomReview.back') }}

  .room-review-form__body
    StarRating(:rounded-corners="true" :star-size="42" @rating-selected="onRatingSelected")

    Field.room-review-form__commentField(show-word-limit maxlength="240")
      template(#input)
        textarea(
          name="comment"
          :placeholder="$t('form.roomReview.comment.placeholder')"
          rows="1"
          maxlength="240"
          @input="e => handleCommentInput(e)"
        )

    Button.room-review-form-submit-button(native-type="submit")
      Icon.room-review-form-submit-button__icon(name="guide-o")
      span.room-review-form-submit-button__title {{ $t('form.roomReview.submit') }}
</template>

<script>
import { defineComponent, reactive } from '@nuxtjs/composition-api'
import { Form, Button, Icon, Field } from 'vant'
import StarRating from 'vue-star-rating'

export default defineComponent({
  components: {
    Form,
    Button,
    Icon,
    Field,
    StarRating
  },
  setup() {
    const baseClassName = 'room-review-form'

    const form = reactive({
      comment: '',
      rating: null
    })

    const onRatingSelected = rating => {
      form.rating = rating
    }

    const handleCommentInput = e => {
      const value = e.target.value
      form.comment = value

      // Set word limit
      document.querySelector(`.${baseClassName}__commentField`).querySelector('.van-field__word-num').innerHTML = value.length
    }

    const handleFailed = () => {
      console.log('failed')
    }

    return {
      form,
      onRatingSelected,
      handleCommentInput,
      handleFailed
    }
  }
})
</script>

<style lang="scss" src="./RoomReviewForm.component.scss"></style>
