import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// ── Token helpers ─────────────────────────────────────────────────────────────
const getAccessToken   = () => localStorage.getItem('migfora_access_token')
const getRefreshToken  = () => localStorage.getItem('migfora_refresh_token')
const getTokenExpiry   = () => Number(localStorage.getItem('migfora_token_expiry') || 0)

const clearAuth = () => {
  localStorage.removeItem('migfora_access_token')
  localStorage.removeItem('migfora_refresh_token')
  localStorage.removeItem('migfora_id_token')
  localStorage.removeItem('migfora_token_expiry')
  localStorage.removeItem('migfora_user')
}

const isTokenExpiringSoon = () => {
  const expiry = getTokenExpiry()
  if (!expiry) return true
  const fiveMinutes = 5 * 60 * 1000
  return Date.now() >= expiry - fiveMinutes
}

// ── Refresh logic ─────────────────────────────────────────────────────────────
let isRefreshing = false
let failedQueue  = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => error ? p.reject(error) : p.resolve(token))
  failedQueue = []
}

const doRefresh = async () => {
  const refreshToken = getRefreshToken()
  if (!refreshToken) throw new Error('No refresh token')

  const { data } = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
    { refreshToken },
    { headers: { 'Content-Type': 'application/json' } }
  )

  const newAccessToken  = data.accessToken
  const newRefreshToken = data.refreshToken ?? refreshToken
  const newIdToken      = data.idToken
  // expiresIn is in seconds (e.g. 3600) — store as absolute timestamp
  const expiry = Date.now() + (data.expiresIn ?? 3600) * 1000

  localStorage.setItem('migfora_access_token',  newAccessToken)
  localStorage.setItem('migfora_refresh_token', newRefreshToken)
  localStorage.setItem('migfora_id_token',      newIdToken)
  localStorage.setItem('migfora_token_expiry',  String(expiry))

  axiosInstance.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`

  window.dispatchEvent(new CustomEvent('migfora:tokens-refreshed', {
    detail: { accessToken: newAccessToken, refreshToken: newRefreshToken, idToken: newIdToken }
  }))

  return newAccessToken
}

// ── Request interceptor — proactive refresh before every call ─────────────────
axiosInstance.interceptors.request.use(
  async (config) => {
    // skip refresh for the refresh endpoint itself
    if (config.url?.includes('/auth/refresh')) {
      return config
    }

    if (isTokenExpiringSoon()) {
      if (isRefreshing) {
        // wait for the in-flight refresh to complete
        const token = await new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
        config.headers['Authorization'] = `Bearer ${token}`
        return config
      }

      isRefreshing = true
      try {
        const newToken = await doRefresh()
        processQueue(null, newToken)
        config.headers['Authorization'] = `Bearer ${newToken}`
      } catch (err) {
        processQueue(err, null)
        clearAuth()
        window.location.href = '/login'
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    } else {
      const token = getAccessToken()
      if (token) config.headers['Authorization'] = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor — reactive refresh on 401/403 ───────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    const status = error.response?.status
    if ((status === 401 || status === 403) && !originalRequest._retry) {
      originalRequest._retry = true

      if (!getRefreshToken()) {
        clearAuth()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`
          return axiosInstance(originalRequest)
        }).catch((err) => Promise.reject(err))
      }

      isRefreshing = true
      try {
        const newToken = await doRefresh()
        processQueue(null, newToken)
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`
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