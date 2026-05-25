import client from './client'

export const authApi = {
  login: async (username, password) => {
    const form = new FormData()
    form.append('username', username)
    form.append('password', password)
    const { data } = await client.post('/auth/token', form)
    return data
  },

  getMe: async (token) => {
    const { data } = await client.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
    return data
  },
}
