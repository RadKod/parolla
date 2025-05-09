export default ({ app, $auth }) => {
  $auth.onRedirect(to => {
    return app.localePath(to)
  })
}
