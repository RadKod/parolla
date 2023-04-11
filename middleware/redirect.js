export default ({ route, redirect, localePath }) => {
  if (route.path.startsWith('/room') && route.query.id) {
    redirect(localePath({ name: 'CreatorMode-CreatorModeRoom', query: { id: route.query.id } }))
  }

  if (route.path.endsWith('/') && route.path !== '/') {
    redirect(route.path.slice(0, -1))
  }
}
