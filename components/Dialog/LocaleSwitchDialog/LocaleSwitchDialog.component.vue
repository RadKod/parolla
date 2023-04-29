<template lang="pug">
Dialog.dialog.locale-switch-dialog(
  v-model="state.isOpen"
  :title="$t('dialog.localeSwitch.title')"
  :cancel-button-text="cancelButtonText || $t('general.cancel')"
  :confirm-button-text="confirmButtonText || $t('general.apply')"
  :show-cancel-button="true"
  :show-confirm-button="false"
  :close-on-click-overlay="false"
  @closed="$emit('closed')"
  @cancel="$emit('onCancel')"
  @confirm="$emit('onConfirm')"
)
  RadioGroup.locale-switch(v-model="activeLocale")
    CellGroup
      Cell.locale-switch-item(clickable :class="[{ 'locale-switch-item--active': $i18n.locale === 'tr' }]" @click="activeLocale = 'tr'")
        template(#title)
          AppIcon(name="circle-flags:tr")
          strong Türkçe
        template(#right-icon)
          Radio(name="tr")

      Cell.locale-switch-item(clickable :class="[{ 'locale-switch-item--active': $i18n.locale === 'en' }]" @click="activeLocale = 'en'")
        template(#title)
          AppIcon(name="circle-flags:us")
          strong English
        template(#right-icon)
          Radio(name="en")
</template>

<script>
import { defineComponent, useRoute, useContext, reactive, ref, watch } from '@nuxtjs/composition-api'
import { useDialog } from '@/hooks'
import { Dialog, RadioGroup, CellGroup, Cell, Radio, Toast } from 'vant'
import { AppIcon } from '@/components/Icon'

export default defineComponent({
  components: {
    Dialog: Dialog.Component,
    RadioGroup,
    CellGroup,
    Cell,
    Radio,
    AppIcon
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
    },
    confirmButtonText: {
      type: String,
      required: false,
      default: null
    }
  },
  setup(props) {
    const route = useRoute()
    const { i18n, localePath } = useContext()

    const { openLeaveDialog } = useDialog()

    const state = reactive({
      isOpen: props.isOpen
    })

    watch(
      () => props.isOpen,
      value => {
        state.isOpen = value
      }
    )

    const activeLocale = ref(i18n.locale)

    watch(
      () => activeLocale.value,
      value => {
        openLeaveDialog({
          confirm: () => {
            i18n.setLocale(value)
            setTimeout(() => {
              Toast.loading({
                message: i18n.t('dialog.localeSwitch.switching'),
                forbidClick: true
              })
            }, 100)
            setTimeout(() => {
              window.location.replace(localePath(route.value.path))
            }, 1000)
          }
        })
      }
    )

    return {
      state,
      activeLocale
    }
  }
})
</script>

<style lang="scss" src="./LocaleSwitchDialog.component.scss"></style>
