<template lang="pug">
Dialog.dialog.room-review-dialog(
  v-model="state.isOpen"
  :title="$t('dialog.roomReview.title')"
  :cancel-button-text="cancelButtonText || $t('general.close')"
  :show-confirm-button="false"
  :show-cancel-button="true"
  :close-on-click-overlay="false"
  @closed="$emit('closed')"
  @opened="$emit('opened')"
)
  RoomReviewForm(v-if="isOpenRoomReviewForm" @onClickBackButton="closeRoomReviewForm" @onSuccess="handleSuccessRoomReviewForm")

  template(v-else)
    template(v-if="fetchState.pending")
      Empty(:description="$t('dialog.roomReview.pendingReviews')")

    template(v-else-if="fetchState.error")
      Empty(image="error" :description="$t('dialog.roomReview.error.fetchReviews.description')")
        Button(@click="fetch") {{ $t('dialog.roomReview.error.fetchReviews.action') }}

    template(v-else)
      RoomReviewList.room-review-dialog__list(:items="review.list" :rating="room.rating" @onClickOpenRoomReviewForm="openRoomReviewForm")

      Button.room-review-dialog__openFormButton(
        v-if="!isOpenRoomReviewForm && review.list && review.list.length > 0"
        icon="smile-comment-o"
        @click="openRoomReviewForm"
      ) {{ $t('dialog.roomReview.review') }}
</template>

<script>
import { defineComponent, useStore, useFetch, ref, reactive, watch, computed } from '@nuxtjs/composition-api'
import { gameModeKeyEnum } from '@/enums'
import { useGameMode } from '@/hooks'
import { roomReviewTransformer } from '@/transformers'
import { Dialog, Button, Empty } from 'vant'
import { RoomReviewForm } from '@/components/Form'
import { RoomReviewList } from '@/components/List'

export default defineComponent({
  components: {
    Dialog: Dialog.Component,
    Button,
    Empty,
    RoomReviewForm,
    RoomReviewList
  },
  props: {
    isOpen: {
      type: Boolean,
      required: false,
      default: false
    },
    cancelButtonText: {
      type: String,
      required: false,
      default: null
    }
  },
  setup(props) {
    const store = useStore()

    const { activeGameMode } = useGameMode()

    const state = reactive({
      isOpen: props.isOpen
    })

    watch(
      () => props.isOpen,
      value => {
        state.isOpen = value
      }
    )

    watch(
      () => state.isOpen,
      value => {
        if (value) {
          fetch()
        }
      }
    )

    const room = computed(() => store.getters['creator/room'])

    const isOpenRoomReviewForm = ref(false)

    const review = reactive({
      list: []
    })

    const fetchReviews = async () => {
      if (activeGameMode.value === gameModeKeyEnum.CREATOR) {
        const result = await store.dispatch('creator/fetchReviews', {
          relationId: room.value.relationId
        })

        if (result.success) {
          review.list = result.data.reviews.map(item => roomReviewTransformer(item))
        }
      }
    }

    const { fetch, fetchState } = useFetch(async () => {
      await fetchReviews()
    })

    const openRoomReviewForm = () => {
      isOpenRoomReviewForm.value = true
    }

    const closeRoomReviewForm = () => {
      isOpenRoomReviewForm.value = false
    }

    const handleSuccessRoomReviewForm = () => {
      fetch()
      closeRoomReviewForm()
    }

    return {
      fetch,
      fetchState,
      room,
      state,
      isOpenRoomReviewForm,
      review,
      openRoomReviewForm,
      closeRoomReviewForm,
      handleSuccessRoomReviewForm
    }
  }
})
</script>

<style lang="scss" src="./RoomReviewDialog.component.scss"></style>
