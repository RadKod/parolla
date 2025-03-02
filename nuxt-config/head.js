const { title, meta } = require('../system/head/main/tr')

module.exports = {
  htmlAttrs: {
    lang: 'tr'
  },
  title,
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/meta/icon/favicon.ico' },
    { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
    { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
    { rel: 'dns-prefetch', href: '//api.radkod.com' },
    { rel: 'dns-prefetch', href: '//pagead2.googlesyndication.com' },
    { rel: 'dns-prefetch', href: '//googleads.g.doubleclick.net' },
    { rel: 'dns-prefetch', href: '//www.googletagmanager.com' },
    { rel: 'manifest', href: '/manifest.json' }
  ],
  meta: [
    { charset: 'utf-8' },
    {
      hid: 'viewport',
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, interactive-widget=resizes-content'
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
      hid: 'apple-mobile-web-app-capable',
      name: 'apple-mobile-web-app-capable',
      content: 'yes'
    },
    { name: 'Classification', content: 'Game' },
    { name: 'Rating', content: 'General' },
    { name: 'Distribution', content: 'Global' },
    { name: 'Copyright', content: 'parolla' },
    { itemprop: 'copyrightYear', content: new Date().getFullYear().toString() },
    ...meta
  ]
}
