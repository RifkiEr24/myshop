import apiClient from './axios'

const login = async (username: string, password: string) => {
  const res = await apiClient.post('/auth/login', { username, password })
  return res.data
}

const getUser = async () => {
  const res = await apiClient.get(`/auth/me`)
  return res.data
}

const refreshToken = async (token: string) => {
  const res = await apiClient.post('/auth/refresh', { refreshToken: token })
  return res.data
}

export { login, getUser, refreshToken }
