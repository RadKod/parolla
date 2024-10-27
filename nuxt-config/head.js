const { title, meta } = require('../system/head/main/tr')

module.exports = {
  htmlAttrs: {
    lang: 'tr'
  },
  title,
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/meta/icon/favicon.ico' },
    { rel: 'dns-prefetch', href: '//api.radkod.com' },
    { rel: 'manifest', href: '/manifest.json' }
  ],
  meta: [
    { charset: 'utf-8' },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0, interactive-widget=resizes-content, user-scalable=no'
    },
    {
      hid: 'robots',
      name: 'robots',
      content: 'index,follow'
    },
    {
      hid: 'Publisher',
      property: 'Publisher',
      content: 'RadKod'
    },
    {
      hid: 'theme-color',
      name: 'theme-color',
      content: '#eee'
    },
    {
      name: 'apple-mobile-web-app-capable',
      content: 'yes'
    },
    {
      name: 'apple-mobile-web-app-status-bar-style',
      content: 'black-translucent'
    },
    { name: 'Classification', content: 'Game' },
    { name: 'Rating', content: 'General' },
    { name: 'Distribution', content: 'Global' },
    { name: 'Copyright', content: 'parolla' },
    { itemprop: 'copyrightYear', content: new Date().getFullYear().toString() },
    ...meta
  ]
}
