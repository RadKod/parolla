export default model => {
  return {
    id: model.id,
    fingerprint: model.fingerprint,
    username: model.username,
    isPermanent: model.is_permanent,
    createdAt: model.created_at,
    tourScores: model.tourScores
  }
}
