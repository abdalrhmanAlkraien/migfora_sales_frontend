import axios from 'axios'

// ── Bootstrap ────────────────────────────────────────────────────────────────
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// ── Helpers ───────────────────────────────────────────────────────────────────
const getAccessToken  = () => localStorage.getItem('migfora_access_token')
const getRefreshToken = () => localStorage.getItem('migfora_refresh_token')

const clearAuth = () => {
  localStorage.removeItem('migfora_access_token')
  localStorage.removeItem('migfora_refresh_token')
  localStorage.removeItem('migfora_id_token')
  localStorage.removeItem('migfora_user')
}

// ── Request interceptor ───────────────────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken()
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor — auto-refresh on 401 ───────────────────────────────
let isRefreshing  = false
let failedQueue   = []  // requests that arrived while refresh was in-flight

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Only attempt refresh on 401, and only once per request
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = getRefreshToken()

      // No refresh token available — hard logout
      if (!refreshToken) {
        clearAuth()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      if (isRefreshing) {
        // Queue this request until the ongoing refresh resolves
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`
          return axiosInstance(originalRequest)
        }).catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
          { refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        )

        const newAccessToken  = data.accessToken
        const newRefreshToken = data.refreshToken
        const newIdToken      = data.idToken

        // Persist new tokens
        localStorage.setItem('migfora_access_token',  newAccessToken)
        localStorage.setItem('migfora_refresh_token', newRefreshToken)
        localStorage.setItem('migfora_id_token',      newIdToken)

        // Sync Zustand store without importing it here (avoids circular deps)
        // The store reads from localStorage on next render automatically
        window.dispatchEvent(new CustomEvent('migfora:tokens-refreshed', {
          detail: { accessToken: newAccessToken, refreshToken: newRefreshToken, idToken: newIdToken }
        }))

        axiosInstance.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`
        originalRequest.headers['Authorization']        = `Bearer ${newAccessToken}`

        processQueue(null, newAccessToken)
        return axiosInstance(originalRequest)

      } catch (refreshError) {
        processQueue(refreshError, null)
        clearAuth()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance