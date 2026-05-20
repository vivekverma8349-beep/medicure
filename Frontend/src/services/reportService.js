import API from '../api/axios'

export const analyzeReport = async (file) => {
  const formData = new FormData()
  formData.append('report', file)
  const { data } = await API.post('/analysis/analyze-report', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return data
}

export const getReports = async () => {
  const { data } = await API.get('/reports')
  return data
}
