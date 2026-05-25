import client from './client'

export const entriesApi = {
  list: async () => {
    const { data } = await client.get('/entries/')
    return data
  },

  listPending: async () => {
    const { data } = await client.get('/entries/pending/me')
    return data
  },

  get: async (id) => {
    const { data } = await client.get(`/entries/${id}`)
    return data
  },

  create: async (entry) => {
    const { data } = await client.post('/entries/', entry)
    return data
  },

  update: async (id, entry) => {
    const { data } = await client.put(`/entries/${id}`, entry)
    return data
  },

  delete: async (id) => {
    const { data } = await client.delete(`/entries/${id}`)
    return data
  },

  uploadImage: async (entryId, file, caption, isFeatured, orderIndex) => {
    const form = new FormData()
    form.append('file', file)
    if (caption) form.append('caption', caption)
    form.append('is_featured', isFeatured ? 'true' : 'false')
    form.append('order_index', orderIndex)
    const { data } = await client.post(`/images/upload/${entryId}`, form)
    return data
  },

  deleteImage: async (imageId) => {
    const { data } = await client.delete(`/images/${imageId}`)
    return data
  },

  setFeaturedImage: async (imageId, entryId) => {
    const { data } = await client.put(`/images/${imageId}/featured?entry_id=${entryId}`)
    return data
  },
}
