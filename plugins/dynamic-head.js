export default ({ app }) => {
  const extendedApp = app

  const headFile = require(`@/system/head/main/${extendedApp.i18n.locale || extendedApp.i18n.defaultLocale}.js`)

  if (extendedApp.head) {
    extendedApp.head.htmlAttrs.lang = extendedApp.i18n.locale
    extendedApp.head.htmlAttrs.dir = extendedApp.i18n.localeProperties.dir

    const setTitle = () => {
      extendedApp.head.title = headFile.title
    }

    const setMeta = () => {
      extendedApp.head.meta = headFile.meta
    }

    setTitle()
    setMeta()
  }
}
