<template lang="pug">
Form.room-review-form(@keypress.enter.prevent)
  .room-review-form__head
    Button.room-review-form-back-button(native-type="button" @click="$emit('onClickBackButton')")
      AppIcon.room-review-form-back-button__icon(name="tabler:arrow-left" color="var(--color-icon-01)" :width="16" :height="16")
      span.room-review-form-back-button__title {{ $t('form.roomReview.back') }}

  .room-review-form__body
    StarRating(:rounded-corners="true" :star-size="42" @rating-selected="onRatingSelected")

    template(v-if="form.rating")
      Field.room-review-form__commentField(show-word-limit maxlength="240")
        template(#input)
          textarea(
            name="comment"
            :placeholder="$t('form.roomReview.comment.placeholder')"
            rows="1"
            :maxlength="form.validation.comment.maxLength.max"
            @input="e => handleCommentInput(e)"
          )

      Button.room-review-form-submit-button(
        native-type="button"
        :loading="form.isBusy"
        :disabled="!form.rating || form.comment.length <= 0 || form.isBusy"
        @click="handleSubmit"
      )
        AppIcon.room-review-form-submit-button__icon(name="tabler:send" color="var(--color-text-04)" :width="16" :height="16")
        span.room-review-form-submit-button__title {{ $t('form.roomReview.submit') }}

    template(v-else)
      p.room-review-form__emptyRatingDescription {{ $t('form.roomReview.empty.rating.description') }}
</template>

<script>
import { defineComponent, useContext, useStore, reactive, computed } from '@nuxtjs/composition-api'
import { Form, Button, Field, Notify } from 'vant'
import StarRating from 'vue-star-rating'
import { AppIcon } from '@/components/Icon'

export default defineComponent({
  components: {
    Form,
    Button,
    Field,
    Notify,
    StarRating,
    AppIcon
  },
  setup(props, { emit }) {
    const baseClassName = 'room-review-form'

    const { i18n } = useContext()
    const store = useStore()

    const room = computed(() => store.getters['creator/room'])
    const user = computed(() => store.getters['auth/user'])

    const form = reactive({
      isBusy: false,
      rating: null,
      comment: '',
      validation: {
        comment: {
          maxLength: {
            max: 240
          }
        }
      }
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

    const getErrorNotify = message => {
      Notify({
        message: message,
        color: 'var(--color-text-04)',
        background: 'var(--color-danger-01)',
        duration: 1000
      })
    }

    const getSuccessNotify = message => {
      Notify({
        message: message,
        color: 'var(--color-text-04)',
        background: 'var(--color-success-01)',
        duration: 1000
      })
    }

    const resetForm = () => {
      form.rating = null
      form.comment = ''
    }

    const handleSubmit = async () => {
      form.isBusy = true

      if (!form.rating) {
        getErrorNotify(i18n.t('form.roomReview.error.emptyRating'))

        return false
      }

      if (!form.comment || form.comment.length <= 0) {
        getErrorNotify(i18n.t('form.roomReview.error.required'))

        return false
      }

      if (form.comment && form.comment.length > form.validation.comment.maxLength.max) {
        getErrorNotify(i18n.t('form.roomReview.error.maxLength'))

        return false
      } else {
        const result = await store.dispatch('creator/postReview', {
          relationId: room.value.relationId,
          form,
          user: user.value
        })

        if (result.success) {
          getSuccessNotify(result.message)
          await store.commit('creator/INCREMENT_ROOM_REVIEW_COUNT')
          resetForm()
          emit('onSuccess')
        } else {
          getErrorNotify(result.message)
        }
      }

      form.isBusy = false
    }

    return {
      form,
      onRatingSelected,
      handleCommentInput,
      handleSubmit
    }
  }
})
</script>

<style lang="scss" src="./RoomReviewForm.component.scss"></style>
