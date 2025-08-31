export default model => {
  return {
    blocked: model.blocked,
    confirmed: model.confirmed,
    createdAt: model.createdAt,
    documentId: model.documentId,
    email: model.email,
    id: model.id,
    provider: model.provider,
    publishedAt: model.publishedAt,
    updatedAt: model.updatedAt,
    username: model.username
  }
}
