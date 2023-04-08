<template lang="pug">
.scene.intro-scene(ref="rootRef" tabindex="1")
  // Scene Inner
  .scene__inner
    AppLogo
    h2.intro-scene__title {{ $t('introScene.title') }}

    .intro-scene-mode-list
      Button.intro-scene-mode-list-item(
        size="large"
        :to="$i18n.locale === $i18n.defaultLocale ? localePath({ name: 'DailyMode' }) : localePath('/')"
        :class="[{ 'intro-scene-mode-list-item--disabled': $i18n.locale !== $i18n.defaultLocale }]"
        @click="localeAvailabilityMessage"
      )
        | {{ $t('introScene.modeList.daily.title') }}
        label.intro-scene-mode-list-item__label(v-if="$i18n.locale !== $i18n.defaultLocale") Currently only available for TR
        span.intro-scene-mode-list-item__icon 📅
      Button.intro-scene-mode-list-item(
        size="large"
        :to="$i18n.locale === $i18n.defaultLocale ? localePath({ name: 'UnlimitedMode' }) : localePath('/')"
        :class="[{ 'intro-scene-mode-list-item--disabled': $i18n.locale !== $i18n.defaultLocale }]"
        @click="localeAvailabilityMessage"
      )
        span.intro-scene-mode-list-item__icon 🔁
        | {{ $t('introScene.modeList.unlimited.title') }}
        label.intro-scene-mode-list-item__label(v-if="$i18n.locale !== $i18n.defaultLocale") Currently only available for TR
      Button.intro-scene-mode-list-item(size="large" :to="localePath({ name: 'CreatorMode-CreatorModeIntro' })")
        span.intro-scene-mode-list-item__icon 📝
        | {{ $t('introScene.modeList.creator.title') }}
</template>

<script>
import { defineComponent, useContext } from '@nuxtjs/composition-api'
import { Button, Notify } from 'vant'
import { AppLogo } from '@/components/Logo'

export default defineComponent({
  components: {
    AppLogo,
    Button
  },
  setup() {
    const { i18n } = useContext()

    const localeAvailabilityMessage = () => {
      if (i18n.locale !== i18n.defaultLocale) {
        Notify({
          message: 'Currently only available for TR',
          color: 'var(--color-text-04)',
          background: 'var(--color-warning-01)',
          duration: 2000
        })
      }
    }

    return {
      localeAvailabilityMessage
    }
  }
})
</script>

<style lang="scss" src="./IntroScene.component.scss"></style>
