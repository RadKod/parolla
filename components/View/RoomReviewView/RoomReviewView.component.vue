<template lang="pug">
.room-review-view
  RoomReviewForm(v-if="isOpenRoomReviewForm" @onClickBackButton="closeRoomReviewForm" @onSuccess="handleSuccessRoomReviewForm")

  template(v-else)
    template(v-if="fetchState.pending")
      Empty(:description="$t('dialog.roomReview.pendingReviews')")

    template(v-else-if="fetchState.error")
      Empty(image="error" :description="$t('dialog.roomReview.error.fetchReviews.description')")
        Button(@click="fetch") {{ $t('dialog.roomReview.error.fetchReviews.action') }}

    template(v-else)
      RoomReviewList.room-review-view__list(:items="review.list" :rating="review.rating" @onClickOpenRoomReviewForm="openRoomReviewForm")
        template(#openFormButton)
          Button.room-review-view__openFormButton.room-review-view__openFormButton--desktop(
            v-if="!isOpenRoomReviewForm && review.list && review.list.length > 0"
            icon="smile-comment-o"
            @click="openRoomReviewForm"
          ) {{ $t('dialog.roomReview.review') }}

          Button.room-review-view__openFormButton.room-review-view__openFormButton--mobile(
            v-if="!isOpenRoomReviewForm && review.list && review.list.length > 0"
            icon="plus"
            size="small"
            @click="openRoomReviewForm"
          )
</template>

<script>
import { defineComponent, useStore, useFetch, ref, reactive, watch, computed } from '@nuxtjs/composition-api'
import { gameModeKeyEnum } from '@/enums'
import { useGameMode } from '@/hooks'
import { roomTransformer, roomReviewTransformer } from '@/transformers'
import { Button, Empty } from 'vant'
import { RoomReviewForm } from '@/components/Form'
import { RoomReviewList } from '@/components/List'

export default defineComponent({
  components: {
    Button,
    Empty,
    RoomReviewForm,
    RoomReviewList
  },
  setup() {
    const store = useStore()

    const { activeGameMode } = useGameMode()

    const room = computed(() => store.getters['creator/room'])

    const isOpenRoomReviewForm = ref(false)

    const review = reactive({
      rating: null,
      viewCount: null,
      room: {},
      list: []
    })

    const fetchReviews = async () => {
      if (activeGameMode.value === gameModeKeyEnum.CREATOR) {
        const result = await store.dispatch('creator/fetchReviews', {
          relationId: room.value.relationId
        })

        if (result.success) {
          review.rating = result.data.rating
          review.viewCount = result.data.view_count
          review.room = roomTransformer(result.data)
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
      isOpenRoomReviewForm,
      review,
      openRoomReviewForm,
      closeRoomReviewForm,
      handleSuccessRoomReviewForm
    }
  }
})
</script>

<style lang="scss" src="./RoomReviewView.component.scss"></style>
