module.exports = {
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'static',

  /*
   ** Nuxt ssr
   ** See https://nuxtjs.org/docs/configuration-glossary/configuration-ssr
   */
  ssr: false,

  /*
   ** Nuxt environments
   ** See https://nuxtjs.org/docs/configuration-glossary/configuration-env
   */
  env: {
    API: process.env.API
  },

  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    htmlAttrs: {
      lang: 'tr'
    },
    title: process.env.npm_package_name || 'parolla',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, height=device-height, initial-scale=1.0, viewport-fit=cover, user-scalable=no'
      },
      {
        name: 'apple-mobile-web-app-capable',
        content: 'yes'
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || 'Kelime oyunu'
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: '/meta/preview/og.jpg'
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: `Kelime oyunu`
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
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/meta/icon/favicon.ico' },
      { rel: 'dns-prefetch', href: '//api.radkod.com' },
      { rel: 'manifest', href: '/manifest.json' }
    ]
  },

  /*
   ** Global Styles (Do not import actual styles)
   ** https://www.npmjs.com/package/@nuxtjs/style-resources
   */
  styleResources: {
    scss: [
      // Plugins
      '~/assets/style/scss/plugins/_breakpoint.scss',
      '~/assets/style/scss/plugins/_mq.scss', // Doc: https://github.com/sass-mq/sass-mq
      // Functions
      '~/assets/style/scss/functions/_center.scss',
      // Mixins
      '~/assets/style/scss/mixins/_font.scss'
    ]
  },

  /*
   ** Global Styles (Actual styles)
   */
  css: [
    // Actual styles entry point (as import management)
    '~/assets/style/scss/app.scss'
  ],

  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  router: {
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'Home',
        path: '/',
        component: resolve(__dirname, 'pages/Main/-index.vue')
      })
      routes.push({
        name: 'DailyMode',
        path: '/daily',
        component: resolve(__dirname, 'pages/DailyMode/-index.vue')
      })
      routes.push({
        name: 'UnlimitedMode',
        path: '/unlimited',
        component: resolve(__dirname, 'pages/UnlimitedMode/-index.vue')
      })
      routes.push({
        name: 'PrivacyPolicy',
        path: '/page/privacy-policy',
        component: resolve(__dirname, 'pages/Page/PrivacyPolicy/-index.vue')
      })
    }
  },

  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    // https://www.npmjs.com/package/vuex-persist
    { src: '~/plugins/vuex-persist', ssr: false },
    { src: '~/plugins/ua-injector', ssr: false },
    { src: '~/plugins/theme-color', ssr: false }
  ],

  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: false,

  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // https://composition-api.nuxtjs.org
    '@nuxtjs/composition-api/module',
    // https://github.com/nuxt-community/style-resources-module
    '@nuxtjs/style-resources',
    // https://github.com/nuxt-community/eslint-module
    [
      '@nuxtjs/eslint-module',
      {
        // eslint module options
      }
    ],
    // https://github.com/nuxt-community/stylelint-module
    [
      '@nuxtjs/stylelint-module',
      {
        // stylelint module options
        files: ['{assets/style,components,layouts,pages}/**/*.{css,sass,scss,less,stylus,vue}']
      }
    ],
    // https://www.npmjs.com/package/nuxt-font-loader
    [
      'nuxt-font-loader',
      {
        url: 'https://fonts.googleapis.com/css2?family=Rubik:wght@400;700&display=swap',
        prefetch: true,
        preconnect: true
      }
    ],
    // https://v2.color-mode.nuxtjs.org
    [
      '@nuxtjs/color-mode',
      {
        preference: 'light'
      }
    ]
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // https://www.npmjs.com/package/@nuxtjs/gtm
    [
      '@nuxtjs/gtm',
      {
        enabled: process.env.NODE_ENV === 'production' ? true : false,
        debug: false,
        id: 'GTM-W87WBTN'
      }
    ],
    // https://www.npmjs.com/package/nuxt-user-agent
    'nuxt-user-agent'
  ],

  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    extractCSS: process.env.NODE_ENV === 'production',
    babel: {
      plugins: [
        [
          'import',
          {
            libraryName: 'vant',
            libraryDirectory: 'es',
            style: true
          }
        ]
      ]
    },
    transpile: ['vant'],
    postcss: {
      plugins: {
        'postcss-preset-env': this.preset,
        'postcss-custom-media': {}
      },
      preset: {
        stage: 2
      }
    }
  },

  /*
   ** Server configuration
   ** See https://nuxtjs.org/api/configuration-server/
   */
  server: {
    host: '0.0.0.0', // default: localhost,
    timing: false,
    port: 8080
  }
}
