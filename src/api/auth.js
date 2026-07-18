import axiosInstance from './axiosInstance'

// ─── MOCK — remove when real API is ready ───────────────────
const MOCK_ENABLED = false

const mockLogin = (data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.username === 'admin' && data.password === 'admin') {
        resolve({
          data: {
            token: 'mock-token-abc123',
            user: {
              id: 1,
              username: 'admin',
              name: 'Abdalrhman',
            },
            message: 'Login successful',
          }
        })
      } else {
        reject({
          response: {
            data: {
              message: 'Invalid username or password'
            }
          }
        })
      }
    }, 800) // simulate network delay
  })
}

const mockRegister = (data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.username === 'admin') {
        reject({
          response: { data: { message: 'Username already exists' } }
        })
      } else {
        resolve({
          data: { message: 'Registration successful' }
        })
      }
    }, 800)
  })
}
// ────────────────────────────────────────────────────────────

// ────────────────────────────────────────────────────────────

/**
 * POST /api/v1/auth/login
 * Returns either a full token response or a NEW_PASSWORD_REQUIRED challenge.
 */
export const loginApi = (email, password) => {
  if (MOCK_ENABLED) return mockLogin(email, password)
  return axiosInstance.post('/auth/login', { email, password })
}
 
/**
 * POST /api/v1/auth/change-password
 * Used on first login when backend issues NEW_PASSWORD_REQUIRED challenge.
 */
export const changePasswordApi = (email, temporaryPassword, newPassword, session) => {
  if (MOCK_ENABLED) return mockChangePassword(email, newPassword, session)
  return axiosInstance.post('/auth/change-password', {
    email,
    temporaryPassword,
    newPassword,
    session,
  })
}
 
/**
 * POST /api/v1/auth/refresh
 * Silently obtain a new accessToken using the refreshToken.
 */
export const refreshTokenApi = (refreshToken) => {
  if (MOCK_ENABLED) return mockRefreshToken(refreshToken)
  return axiosInstance.post('/auth/refresh', { refreshToken })
}

export const registerApi = (data) => {
  if (MOCK_ENABLED) return mockRegister(data)
  return axiosInstance.post('/auth/register', data)
}

export const logoutApi = () => {
  return axiosInstance.post('/auth/logout')
}

export const forgotPasswordApi = (email) =>
  axiosInstance.post('/auth/forgot-password', { email })

export const confirmForgotPasswordApi = (email, code, newPassword) =>
  axiosInstance.post('/auth/confirm-forgot-password', { email, code, newPassword })