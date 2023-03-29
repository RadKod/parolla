<template lang="pug">
Dialog.dialog.menu-dialog(
  v-model="state.isOpen"
  title="Daha Fazla"
  :cancel-button-text="cancelButtonText"
  :show-confirm-button="false"
  :show-cancel-button="true"
  :close-on-click-overlay="false"
  @closed="$emit('closed')"
)
  CellGroup.menu-dialog-nav
    Cell.menu-dialog-nav__item(icon="eye-o" title="Koyu Tema" size="large")
      template(#right-icon)
        SwitchInput(v-model="isDark" size="22px" @change="toggleDarkTheme")
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
import { defineComponent, useContext, ref, reactive, watch } from '@nuxtjs/composition-api'
import { Dialog, CellGroup, Cell, Switch, Toast } from 'vant'

export default defineComponent({
  components: {
    Dialog: Dialog.Component,
    CellGroup,
    Cell,
    SwitchInput: Switch
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
    const context = useContext()

    const state = reactive({
      isOpen: props.isOpen
    })

    watch(
      () => props.isOpen,
      value => {
        state.isOpen = value
      }
    )

    const isDark = ref(context.$colorMode.value === 'dark')

    watch(
      () => context.$colorMode.value,
      value => {
        if (value === 'dark') {
          isDark.value = true
        } else {
          isDark.value = false
        }
      }
    )

    const toggleDarkTheme = isChecked => {
      if (isChecked) {
        context.$colorMode.preference = 'dark'
        document.querySelector('meta[name="theme-color"]').setAttribute('content', '#161616')
      } else {
        context.$colorMode.preference = 'light'
        document.querySelector('meta[name="theme-color"]').setAttribute('content', '#eeeeee')
      }
    }

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

    return { state, isDark, toggleDarkTheme, openSuggestQuestion, openSharer }
  }
})
</script>

<style lang="scss" src="./MenuDialog.component.scss"></style>
