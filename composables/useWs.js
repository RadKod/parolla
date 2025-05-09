import WebSocket from 'isomorphic-ws'
import { useContext } from '@nuxtjs/composition-api'

export default () => {
  const context = useContext()

  const token = context.$auth.strategy.token.get()
  const wsUrl = `${process.env.WS_URL}?token=${token}`

  // Create WebSocket instance
  const ws = new WebSocket(wsUrl)

  ws.onopen = () => {
    console.info('Connected to WebSocket server')
  }

  ws.onclose = () => {
    console.info('Disconnected from WebSocket server')
  }

  ws.onerror = error => {
    console.error('WebSocket error:', error)
  }

  return ws
}
