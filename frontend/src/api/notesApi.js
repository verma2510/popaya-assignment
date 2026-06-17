import axios from 'axios'

// Create a pre configured axios instance for API requests
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// Centralized error handling for all API responses
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

export const notesApi = {
  // Fetch all notes, optionally filtering by a search query and pagination
  getAll: (search, page) => api.get('/notes', { params: { ...(search && { search }), ...(page && { page }) } }),
  getById: (id) => api.get(`/notes/${id}`),
  create: (data) => api.post('/notes', data),
  update: (id, data) => api.put(`/notes/${id}`, data),
  delete: (id) => api.delete(`/notes/${id}`),
}