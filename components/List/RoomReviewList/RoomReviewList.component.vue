<template lang="pug">
.list.room-review-list
  strong.room-review-list__title {{ $t('roomReviewList.ratingTitle') }}
  StarRating(read-only rating="3" :rounded-corners="true" :star-size="32")

  strong.room-review-list__title.mt-base {{ $t('roomReviewList.reviewsTitle') }}
  PullRefresh(v-model="isRefreshing" @refresh="handleRefresh")
    List.list.room-review-list__items
      Cell.room-review-list-item(v-for="i in 20")
        .room-review-list-item__head
          .room-review-list-item-user
            strong.room-review-list-item-user__username selimdoyranli

        .room-review-list-item__body
          .room-review-list-item-content
            p.room-review-list-item-content__description
              | Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              | Lorem ipsum, dolor sit amet consectetur adipisicing elit.

          .room-review-list-item-date
            Icon.room-review-list-item-date__icon(name="clock-o")
            span.room-review-list-item-date__value 1 saat önce
</template>

<script>
import { defineComponent, ref } from '@nuxtjs/composition-api'
import { PullRefresh, List, Cell, Icon } from 'vant'
import StarRating from 'vue-star-rating'

export default defineComponent({
  components: {
    PullRefresh,
    List,
    Cell,
    Icon,
    StarRating
  },
  setup() {
    const isRefreshing = ref(false)

    const handleRefresh = () => {
      console.log('refreshed')
    }

    return {
      isRefreshing,
      handleRefresh
    }
  }
})
</script>

<style lang="scss" src="./RoomReviewList.component.scss"></style>
