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
  RoomReviewView(ref="roomReviewViewRef")
</template>

<script>
import { defineComponent, ref, reactive, watch } from '@nuxtjs/composition-api'
import { Dialog } from 'vant'
import { RoomReviewView } from '@/components/View'

export default defineComponent({
  components: {
    Dialog: Dialog.Component,
    RoomReviewView
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

    const roomReviewViewRef = ref(null)

    watch(
      () => state.isOpen,
      value => {
        if (value) {
          roomReviewViewRef.value?.$fetch()
        }
      }
    )

    return {
      state,
      roomReviewViewRef
    }
  }
})
</script>

<style lang="scss" src="./RoomReviewDialog.component.scss"></style>
