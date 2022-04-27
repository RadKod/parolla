<template lang="pug">
Dialog.menu-dialog(
  v-model="state.isOpen"
  title="Daha Fazla"
  :cancel-button-text="cancelButtonText"
  :show-confirm-button="false"
  :show-cancel-button="true"
  :close-on-click-overlay="false"
  @closed="$emit('closed')"
)
  CellGroup.menu-dialog-nav
    Cell.menu-dialog-nav__item(
      icon="question-o"
      title="Soru önermek ister misin?"
      size="large"
      is-link
      @click.native="openSuggestQuestion"
    )
    Cell.menu-dialog-nav__item(
      icon="bar-chart-o"
      title="Skoru nasıl hesaplıyoruz"
      size="large"
      is-link
      @click.native="$emit('clickedHowToCalculateStats')"
    )
    Cell.menu-dialog-nav__item(icon="smile-comment-o" title="parolla'yı paylaş" size="large" is-link @click.native="openSharer")
    Cell.menu-dialog-nav__item(icon="manager-o" title="Yapımcılar" size="large" is-link @click.native="$emit('clickedCredits')")
    Cell.menu-dialog-nav__item(icon="guide-o" title="Bize ulaşın" size="large" is-link @click.native="$emit('clickedContact')")
</template>

<script>
import { defineComponent, reactive, watch } from '@nuxtjs/composition-api'
import { Dialog, CellGroup, Cell, Toast } from 'vant'

export default defineComponent({
  components: {
    Dialog: Dialog.Component,
    CellGroup,
    Cell
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
      default: 'Kapat'
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

    const openSuggestQuestion = () => {
      window.open(
        'https://docs.google.com/forms/d/e/1FAIpQLSec4_MAFiDOjpd9pywfocFsfJQoXfMpLT3HIaHpO0Lz3clnaA/viewform?usp=sf_link',
        '_blank'
      )
    }

    const openSharer = async () => {
      const shareText = `parolla - Günlük bilgi oyunu. \n\nhttps://parolla.app`
      try {
        await navigator.clipboard.writeText(shareText)
        await Toast({
          message: 'Panoya kopyalandı',
          position: 'bottom'
        })
        await navigator.share({
          title: 'parolla',
          text: shareText
        })
      } catch {
        await navigator.clipboard.writeText(shareText)
        await Toast({
          message: 'Panoya kopyalandı',
          position: 'bottom'
        })
      }
    }

    return { state, openSuggestQuestion, openSharer }
  }
})
</script>

<style lang="scss" src="./MenuDialog.component.scss"></style>
