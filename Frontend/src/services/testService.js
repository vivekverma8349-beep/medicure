import API from '../api/axios'

export const getTests = async () => {
  const { data } = await API.get('/tests')
  return data
}
