import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const apiClient = axios.create({
  baseURL: 'https://dummyjson.com/',
  timeout: 15000,
})

// attach token
apiClient.interceptors.request.use((config) => {
  const auth = useAuthStore()
  if (auth.bearer) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = auth.bearer
  }
  return config
})

// refresh on 401 (single-flight queue)
let refreshing = false
let waiters: Array<() => void> = []

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const auth = useAuthStore()
    const original = error.config as any

    if (error?.response?.status === 401 && !original._retry && auth.refreshToken) {
      try {
        if (refreshing) {
          await new Promise<void>((resolve) => waiters.push(resolve))
        } else {
          refreshing = true
          original._retry = true
          const newAccess = await auth.refresh()
          refreshing = false
          waiters.forEach((fn) => fn())
          waiters = []
          original.headers = original.headers ?? {}
          original.headers.Authorization = `Bearer ${newAccess}`
        }
        return apiClient(original)
      } catch (e) {
        refreshing = false
        waiters = []
        auth.signOut()
      }
    }
    return Promise.reject(error)
  },
)

export default apiClient
