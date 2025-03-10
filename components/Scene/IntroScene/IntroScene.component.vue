<template lang="pug">
.scene.intro-scene(ref="rootRef" tabindex="1")
  // Scene Inner
  .scene__inner
    LazyAppLogo
    h2.intro-scene__title {{ $t('introScene.title') }}

    .intro-scene-mode-list
      Button.intro-scene-mode-list-item.intro-scene-mode-list-item--tour(size="large" :to="localePath({ name: 'TourMode-TourModeGame' })")
        .prepend
          AppIcon.intro-scene-mode-list-item__icon(name="noto:repeat-button" :width="24" :height="24")
          span.intro-scene-mode-list-item-title
            | {{ $t('introScene.modeList.tour.title') }}
            span.intro-scene-mode-list-item-liveCount
              span.pulse
              AppIcon.icon(name="tabler:users" :width="16" :height="16")
              span.count 576 aktif oyuncu
          .top-scorer
            .top-scorer__content
              AppIcon.top-scorer__icon(name="noto:trophy" :width="16" :height="16")
              span Günün en iyi skoru
                strong &nbsp; 476 &nbsp;
              | puan
            PlayerAvatar.top-scorer__avatar(with-username :user="$auth.user" :size="22")
          p.intro-scene-mode-list-item__description Her tur diğer oyuncularla anlık rekabet

          .intro-scene-mode-list-item.intro-scene-mode-list-item__footer
            Button.play-now-button Hemen Oyna
            .avatar-group
              PlayerAvatar(v-for="i in 5" :name="String(i)")
              .avatar-group__moreCount +572

      Button.intro-scene-mode-list-item(
        size="large"
        :to="$i18n.locale === $i18n.defaultLocale ? localePath({ name: 'DailyMode' }) : localePath('/')"
        :class="[{ 'intro-scene-mode-list-item--disabled': $i18n.locale !== $i18n.defaultLocale }]"
        @click="localeAvailabilityMessage"
      )
        .prepend
          AppIcon.intro-scene-mode-list-item__icon(name="noto:calendar" :width="24" :height="24")
          .title-group
            a.intro-scene-mode-list-item-title(href="https://parolla.app" :title="$t('introScene.subtitle')" @click.prevent.stop.capture)
              | {{ $t('introScene.modeList.daily.title') }}
            span.ms-1 ({{ $t('introScene.modeList.daily.subtitle') }})
          p.intro-scene-mode-list-item__description Bugünün soru setini oyna
        .append
          label.intro-scene-mode-list-item__label(v-if="$i18n.locale !== $i18n.defaultLocale") Only TR

      Button.intro-scene-mode-list-item(
        size="large"
        :to="$i18n.locale === $i18n.defaultLocale ? localePath({ name: 'UnlimitedMode' }) : localePath('/')"
        :class="[{ 'intro-scene-mode-list-item--disabled': $i18n.locale !== $i18n.defaultLocale }]"
        @click="localeAvailabilityMessage"
      )
        .prepend
          AppIcon.intro-scene-mode-list-item__icon(name="noto:infinity" :width="24" :height="24")
          span.intro-scene-mode-list-item-title {{ $t('introScene.modeList.unlimited.title') }}
          p.intro-scene-mode-list-item__description Sınırsız soru seti
        .append
          label.intro-scene-mode-list-item__label(v-if="$i18n.locale !== $i18n.defaultLocale") Only TR

      Button.intro-scene-mode-list-item(size="large" :to="localePath({ name: 'CreatorMode-CreatorModeIntro' })")
        .prepend
          AppIcon.intro-scene-mode-list-item__icon(name="noto:pencil" :width="24" :height="24")
          span.intro-scene-mode-list-item-title {{ $t('introScene.modeList.creator.title') }}
          p.intro-scene-mode-list-item__description Diğer oyuncuların oluşturduğu soru setlerini oyna
        .append
          label.intro-scene-mode-list-item__label(v-if="$i18n.locale !== $i18n.defaultLocale") Only TR

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
