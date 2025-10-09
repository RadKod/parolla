import { userTransformer } from '@/transformers'

const transformScore = model => {
  return {
    id: model.id,
    roomId: model.roomId,
    results: model.results,
    user: userTransformer(model.user)
  }
}

export default model => {
  return model.map(item => transformScore(item))
}
