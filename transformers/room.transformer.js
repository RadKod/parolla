export default model => {
  return {
    title: model.title,
    isPublic: model.is_public,
    id: model.room
  }
}
