import { userTransformer } from '@/transformers'

const transformScoreItem = model => {
  return {
    id: model.id,
    fingerprint: model.fingerprint,
    roomId: model.room_id,
    result: model.game_result,
    user: model.user ? userTransformer(model.user) : null
  }
}

export default model => {
  return model.map(item => transformScoreItem(item))
}
