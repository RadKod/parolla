<template lang="pug">
.scene.intro-scene(ref="rootRef" tabindex="1")
  // Scene Inner
  .scene__inner
    LazyAppLogo
    h2.intro-scene__title {{ $t('introScene.title') }}

    .intro-scene-mode-list
      Button.intro-scene-mode-list-item(
        size="large"
        :to="$i18n.locale === $i18n.defaultLocale ? localePath({ name: 'DailyMode' }) : localePath('/')"
        :class="[{ 'intro-scene-mode-list-item--disabled': $i18n.locale !== $i18n.defaultLocale }]"
        @click="localeAvailabilityMessage"
      )
        a(href="https://parolla.app" :title="$t('introScene.subtitle')" @click.prevent.stop.capture)
          | {{ $t('introScene.modeList.daily.title') }}
        span.ms-1 ({{ $t('introScene.modeList.daily.subtitle') }})
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

    .intro-scene__keywords.d-none
      h3.intro-scene__subtitle {{ $t('introScene.subtitle') }}
      p.intro-scene__description {{ $t('introScene.description') }}
</template>

<script>
import { defineComponent, useContext } from '@nuxtjs/composition-api'
import { Button, Notify } from 'vant'

export default defineComponent({
  components: {
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
