// composables/useSocket.ts
import { io, Socket } from 'socket.io-client'
import type { ChatMessage, User } from '~/types/chat'

export const useSocket = () => {
  let socket: Socket | null = null
  const chatStore = useChatStore()

  const connect = (user: User) => {
    if (socket?.connected) return socket

    // Connect to WebSocket server
    socket = io(window.location.origin, {
      transports: ['websocket', 'polling']
    })

    socket.on('connect', () => {
      console.log('Connected to WebSocket server')
      chatStore.setConnectionStatus(true)
      
      // Join the chat with user info
      socket?.emit('join', {
        userId: user.id,
        username: user.username,
        avatar: user.avatar
      })
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server')
      chatStore.setConnectionStatus(false)
    })

    socket.on('message_history', (messages: ChatMessage[]) => {
      chatStore.setMessages(messages)
    })

    socket.on('new_message', (message: ChatMessage) => {
      chatStore.addMessage(message)
    })

    socket.on('users_update', (users: User[]) => {
      chatStore.updateUsers(users)
    })

    socket.on('user_typing', (typingData: { userId: string, username: string, isTyping: boolean }) => {
      chatStore.updateTyping(typingData)
    })

    return socket
  }

  const disconnect = () => {
    if (socket) {
      socket.disconnect()
      socket = null
      chatStore.setConnectionStatus(false)
    }
  }

  const sendMessage = (message: string, roomId?: string) => {
    if (socket && message.trim()) {
      socket.emit('send_message', { message: message.trim(), roomId })
    }
  }

  const sendTyping = (isTyping: boolean) => {
    if (socket) {
      socket.emit('typing', { isTyping })
    }
  }

  return {
    connect,
    disconnect,
    sendMessage,
    sendTyping,
    socket: readonly(ref(socket))
  }
}
