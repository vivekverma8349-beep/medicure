import API from '../api/axios'

export const registerUser = async (formData) => {
  const { data } = await API.post('/auth/register', formData)
  return data
}

export const loginUser = async (formData) => {
  const { data } = await API.post('/auth/login', formData)
  return data
}
