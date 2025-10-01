import { defineStore } from 'pinia'
import { login, getUser, refreshToken } from '@/services/auth'

type User = { id: string; name: string; email?: string } | null

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User,
    accessToken: '' as string,
    refreshToken: '' as string,
  }),
  getters: {
    isAuthenticated: (s) => !!s.accessToken,
    bearer: (s) => (s.accessToken ? `Bearer ${s.accessToken}` : ''),
  },
  actions: {
    async signIn(username: string, password: string) {
      const data = await login(username, password)
      // expect { accessToken, refreshToken } from your API
      this.accessToken = data.accessToken
      this.refreshToken = data.refreshToken
      this.user = await getUser()
    },
    async refresh() {
      if (!this.refreshToken) throw new Error('No refresh token')
      const data = await refreshToken(this.refreshToken)
      this.accessToken = data.accessToken
      // refresh token may rotate; keep if returned
      if (data.refreshToken) this.refreshToken = data.refreshToken
      return this.accessToken
    },
    async fetchUser() {
      this.user = await getUser()
    },
    signOut() {
      this.user = null
      this.accessToken = ''
      this.refreshToken = ''
    },
  },
})
