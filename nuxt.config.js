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
    title: 'parolla - Kelime oyunu',
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
      /*
       * Vendor
       */
      // > Bootstrap Vendor
      'bootstrap/scss/_functions.scss',
      'bootstrap/scss/_variables.scss',
      'bootstrap/scss/_mixins.scss',

      /*
       * Overrides (This overrides not includes actual styles. | variables, mixins etc.)
       */
      // > Bootstrap Overrides
      '@/assets/style/scss/overrides/bootstrap/_grid.override.scss',
      '@/assets/style/scss/overrides/bootstrap/_spacing.override.scss',
      // Plugins
      //--
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
    trailingSlash: false,
    middleware: ['redirect']
  },

  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    { src: '~/plugins/vuex-persist', ssr: false }, // https://www.npmjs.com/package/vuex-persist
    { src: '~/plugins/ua-injector', ssr: false },
    { src: '~/plugins/theme-color', ssr: false },
    { src: '~/plugins/global-meta-tags-setter', ssr: false },
    { src: '~/plugins/iconify', ssr: false }, // https://www.npmjs.com/package/@iconify/vue
    { src: '~/plugins/vue-timeago', ssr: false } // https://vue-timeago.egoist.sh
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
    // https://i18n.nuxtjs.org
    [
      '@nuxtjs/i18n',
      {
        lazy: true,
        locales: [
          {
            name: 'Turkish',
            title: 'Türkçe',
            code: 'tr',
            iso: 'tr-TR',
            file: 'tr.js'
          },
          {
            name: 'English',
            title: 'English',
            code: 'en',
            iso: 'en-US',
            file: 'en.js'
          }
        ],
        langDir: 'locales/',
        defaultLocale: 'tr',
        strategy: 'prefix_except_default',
        detectBrowserLanguage: false,
        detectBrowserLanguage: false,
        parsePages: false,
        pages: {
          'Main/index': {
            tr: '/',
            en: '/'
          },
          'DailyMode/index': {
            tr: '/gunluk',
            en: '/daily'
          },
          'UnlimitedMode/index': {
            tr: '/limitsiz',
            en: '/unlimited'
          },
          'CreatorMode/CreatorModeIntro/index': {
            tr: '/yaratici/basla',
            en: '/creator/start'
          },
          'CreatorMode/index': {
            tr: '/yaratici',
            en: '/creator'
          },
          'CreatorMode/CreatorModeRooms/index': {
            tr: '/yaratici/odalar',
            en: '/creator/rooms'
          },
          'CreatorMode/CreatorModeMyRooms/index': {
            tr: '/yaratici/odalarim',
            en: '/creator/my-rooms'
          },
          'CreatorMode/CreatorModeCompose/index': {
            tr: '/yaratici/olustur',
            en: '/creator/compose'
          },
          'CreatorMode/CreatorModeRoom/index': {
            tr: '/oda',
            en: '/room'
          }
        }
      }
    ],
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
    'nuxt-user-agent',
    // https://www.npmjs.com/package/nuxt-client-init-module
    'nuxt-client-init-module'
  ],

  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    standalone: true, // for ESM import
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
      postcssOptions: {
        plugins: {
          'postcss-preset-env': this.preset
        }
      },
      preset: {
        stage: 2
      }
    }
  },

  /*
   ** Server configuration
   ** See https://nuxtjs.org/api/configuration-server
   */
  server: {
    host: '0.0.0.0', // default: localhost,
    timing: false,
    port: 3000
  }
}
