<template lang="pug">
.list.room-review-list
  strong.room-review-list__title
    | {{ $t('roomReviewList.ratingTitle') }}
  StarRating(read-only :rating="rating" :rounded-corners="true" :star-size="32")

  strong.room-review-list__title.mt-base {{ $t('roomReviewList.reviewsTitle') }}
  template(v-if="items && items.length > 0")
    List.list.room-review-list__items
      Cell.room-review-list-item(v-for="(item, index) in items" :key="index")
        .room-review-list-item__head
          .room-review-list-item-user
            strong.room-review-list-item-user__username {{ item.user.username }}
            small &nbsp; (🟊 {{ item.rating.substring(0, 1) }})

        .room-review-list-item__body
          .room-review-list-item-content
            p.room-review-list-item-content__description {{ item.comment }}

          .room-review-list-item-date
            Icon.room-review-list-item-date__icon(name="clock-o")
            Timeago.room-review-list-item-date__value(:datetime="item.createdAt" :auto-update="60" :locale="$i18n.locale")
  // Empty List
  template(v-else)
    Empty(:description="$t('roomReviewList.empty.description')")
      Button(type="info" icon="plus" native-type="button" round @click="$emit('onClickOpenRoomReviewForm')") {{ $t('roomReviewList.empty.action') }}
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { List, Cell, Icon, Empty, Button } from 'vant'
import StarRating from 'vue-star-rating'

export default defineComponent({
  components: {
    List,
    Cell,
    Icon,
    Empty,
    Button,
    StarRating
  },
  props: {
    rating: {
      type: Number,
      required: false,
      default: null
    },
    items: {
      type: Array,
      required: false,
      default: null
    }
  },
  setup() {}
})
</script>

<style lang="scss" src="./RoomReviewList.component.scss"></style>
