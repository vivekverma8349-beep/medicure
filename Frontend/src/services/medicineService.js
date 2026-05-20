import API from '../api/axios'

export const getMedicines = async () => {
  const { data } = await API.get('/medicines')
  return data
}
