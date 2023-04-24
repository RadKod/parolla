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
  RoomReviewForm(v-if="isOpenRoomReviewForm" @onClickBackButton="closeRoomReviewForm")

  RoomReviewList.room-review-dialog__list(v-else)

  Button.room-review-dialog__openFormButton(v-if="!isOpenRoomReviewForm" icon="smile-comment-o" @click="openRoomReviewForm")
</template>

<script>
import { defineComponent, reactive, watch, ref } from '@nuxtjs/composition-api'
import { Dialog, Button } from 'vant'
import { RoomReviewForm } from '@/components/Form'
import { RoomReviewList } from '@/components/List'

export default defineComponent({
  components: {
    Dialog: Dialog.Component,
    Button,
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
    const state = reactive({
      isOpen: props.isOpen
    })

    watch(
      () => props.isOpen,
      value => {
        state.isOpen = value
      }
    )

    const isOpenRoomReviewForm = ref(false)

    const openRoomReviewForm = () => {
      isOpenRoomReviewForm.value = true
    }

    const closeRoomReviewForm = () => {
      isOpenRoomReviewForm.value = false
    }

    return {
      state,
      isOpenRoomReviewForm,
      openRoomReviewForm,
      closeRoomReviewForm
    }
  }
})
</script>

<style lang="scss" src="./RoomReviewDialog.component.scss"></style>
