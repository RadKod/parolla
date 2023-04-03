export default model => {
  return {
    id: model.room,
    title: model.title,
    isPublic: model.is_public,
    alphabet: model.alphabet,
    questions: model.questions
  }
}
