const appFetch = async ({ $axios, app }, params) => {
  const { method = 'GET', url, path, query, data, cache, headers } = params

  $axios.onRequest(config => {
    config.headers = config.headers || {}
    config.headers.common = config.headers.common || {}

    if (config.headers.common['Content-Type']) {
      config.headers.common['Content-Type'] = 'application/json'
    }

    config.headers.common['Accept-Language'] = app.i18n.locale
  })

  try {
    const promise = await $axios({
      method,
      url: url || `${app.$config.API_STRAPI}/${path}`,
      params: { ...query },
      data,
      cache,
      headers,
      timeout: 15000,
      config: {}
    })

    if (method === 'DELETE') {
      return { data: promise, error: null }
    }

    return { data: promise.data, error: null }
  } catch (error) {
    if (error.response) {
      return {
        data: null,
        error: error.response?.data?.error
          ? {
              message: error.response?.data?.error.message,
              code: error.response?.status,
              config: error.response?.config
            }
          : {
              message: error.response?.statusText,
              code: error.response?.status,
              config: error.response?.config
            }
      }
    } else {
      return {
        data: null,
        error: {
          message: error.message,
          code: error.code
        }
      }
    }
  }
}

export default ({ $axios, app }, inject) => {
  inject('appFetch', params => {
    return appFetch({ $axios, app }, params)
  })
}
