import Vue from 'vue'
import VueTimeago from 'vue-timeago'

Vue.use(VueTimeago, {
  name: 'Timeago',
  locale: 'tr',
  locales: {
    tr: require('date-fns/locale/tr'),
    en: require('date-fns/locale/en')
  }
})
