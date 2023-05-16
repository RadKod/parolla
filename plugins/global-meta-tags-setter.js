export default ({ app, i18n }) => {
  app.head.htmlAttrs.lang = i18n.locale
  app.head.title = i18n.t('seo.main.title')

  app.head.meta = [
    {
      hid: 'charset',
      charset: 'utf-8'
    },
    {
      hid: 'viewport',
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0, interactive-widget=resizes-content, user-scalable=no'
    },
    {
      hid: 'apple-mobile-web-app-capable',
      name: 'apple-mobile-web-app-capable',
      content: 'yes'
    },
    {
      hid: 'description',
      name: 'description',
      content: i18n.t('seo.main.description')
    },
    {
      hid: 'og:image',
      property: 'og:image',
      content: `/meta/og-main-${i18n.locale}.jpg`
    },
    {
      hid: 'og:description',
      property: 'og:description',
      content: i18n.t('seo.main.description')
    },
    {
      hid: 'og:url',
      property: 'og:url',
      content: `parolla.app`
    },
    {
      hid: 'twitter:card',
      property: 'twitter:card',
      content: `summary_large_image`
    },
    {
      hid: 'twitter:creator',
      property: 'twitter:creator',
      content: `@parollaapp`
    },
    {
      hid: 'Publisher',
      property: 'Publisher',
      content: `RadKod`
    },
    {
      name: 'theme-color',
      content: '#eeeeee'
    }
  ]
}
