import client from './client'

export const usersApi = {
  list: async () => {
    const { data } = await client.get('/users/')
    return data
  },
}
