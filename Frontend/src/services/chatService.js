import API from '../api/axios'

export const createChat = async () => {
  const { data } = await API.post('/chat/new')
  return data
}

export const getChats = async () => {
  const { data } = await API.get('/chat')
  return data
}

export const getSingleChat = async (chatId) => {
  const { data } = await API.get(`/chat/${chatId}`)
  return data
}

export const sendMessage = async (chatId, message) => {
  const { data } = await API.post(`/chat/${chatId}/message`, { message })
  return data
}
