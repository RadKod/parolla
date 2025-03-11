<template lang="pug">
.scene.intro-scene(ref="rootRef" tabindex="1")
  // Scene Inner
  .scene__inner
    LazyAppLogo
    h2.intro-scene__title {{ $t('introScene.title') }}

    .intro-scene-mode-list
      Button.intro-scene-mode-list-item.intro-scene-mode-list-item--tour(size="large" :to="localePath({ name: 'TourMode-TourModeGame' })")
        .prepend
          AppIcon.intro-scene-mode-list-item__icon(name="akar-icons:arrow-cycle" color="#fff" :width="24" :height="24")
          span.intro-scene-mode-list-item-title
            | {{ $t('introScene.modeList.tour.title') }}

          span.live-count
            AppIcon.icon(name="tabler:users" :width="16" :height="16")
            span.count {{ $t('introScene.modeList.tour.liveCount', { count: 576 }) }}
            span.pulse

          .top-scorer
            .top-scorer__content
              AppIcon.top-scorer__icon(name="noto:trophy" :width="16" :height="16")
              i18n(tag="p" path="introScene.modeList.tour.todaysBestScore")
                template(#by)
                  PlayerAvatar.top-scorer__avatar(with-username :user="$auth.user" :size="22")
                template(#score)
                  strong &nbsp; 476 &nbsp;

          p.intro-scene-mode-list-item__description {{ $t('introScene.modeList.tour.description') }}

          .intro-scene-mode-list-item.intro-scene-mode-list-item__footer
            Button.play-now-button {{ $t('general.playNow') }}
            .avatar-group
              PlayerAvatar(v-for="i in 5" :name="String(i)")
              .avatar-group__moreCount +572

        .append
          label.intro-scene-mode-list-item__label
            AppIcon(name="tabler:sparkles" :width="16" :height="16")
            | {{ $t('introScene.modeList.tour.label') }}

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
          p.intro-scene-mode-list-item__description {{ $t('introScene.modeList.daily.description') }}
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
          p.intro-scene-mode-list-item__description {{ $t('introScene.modeList.unlimited.description') }}
        .append
          label.intro-scene-mode-list-item__label(v-if="$i18n.locale !== $i18n.defaultLocale") Only TR

      Button.intro-scene-mode-list-item(size="large" :to="localePath({ name: 'CreatorMode-CreatorModeIntro' })")
        .prepend
          AppIcon.intro-scene-mode-list-item__icon(name="noto:pencil" :width="24" :height="24")
          span.intro-scene-mode-list-item-title {{ $t('introScene.modeList.creator.title') }}
          p.intro-scene-mode-list-item__description {{ $t('introScene.modeList.creator.description') }}
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
