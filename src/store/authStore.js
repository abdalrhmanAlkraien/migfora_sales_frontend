import { create } from 'zustand'

const LS_ACCESS_TOKEN  = 'migfora_access_token'
const LS_REFRESH_TOKEN = 'migfora_refresh_token'
const LS_ID_TOKEN      = 'migfora_id_token'
const LS_USER          = 'migfora_user'

const useAuthStore = create((set) => ({
  // ── state ──────────────────────────────────────────────────────────────────
  token:        localStorage.getItem(LS_ACCESS_TOKEN)  || null,
  refreshToken: localStorage.getItem(LS_REFRESH_TOKEN) || null,
  idToken:      localStorage.getItem(LS_ID_TOKEN)      || null,
  user:         JSON.parse(localStorage.getItem(LS_USER) || 'null'),

  // Temporary session for NEW_PASSWORD_REQUIRED challenge
  // Never persisted to localStorage — intentionally in-memory only
  challengeSession: null,
  challengeEmail:   null,

  // ── actions ────────────────────────────────────────────────────────────────

  /** Called after a successful login or refresh */
  setAuth: (accessToken, refreshToken, idToken, user, expiresIn = 3600) => {
    const expiry = Date.now() + expiresIn * 1000
    localStorage.setItem(LS_ACCESS_TOKEN,  accessToken)
    localStorage.setItem(LS_REFRESH_TOKEN, refreshToken)
    localStorage.setItem(LS_ID_TOKEN,      idToken)
    localStorage.setItem(LS_USER,          JSON.stringify(user))
    localStorage.setItem('migfora_token_expiry', String(expiry))
    set({
      token: accessToken,
      refreshToken,
      idToken,
      user,
      challengeSession: null,
      challengeEmail:   null,
    })
  },

  /** Called when backend returns NEW_PASSWORD_REQUIRED challenge */
temporaryPassword: null,

// update setChallenge to also store the temporary password:
setChallenge: (session, email, temporaryPassword) => set({
  challengeSession: session,
  challengeEmail:   email,
  temporaryPassword,
}),

// add to clearAuth:
clearAuth: () => set({
  token:             null,
  refreshToken:      null,
  idToken:           null,
  user:              null,
  challengeSession:  null,
  challengeEmail:    null,
  temporaryPassword: null,
}),

  /** Silently update tokens after a refresh call (keeps user object intact) */
  updateTokens: (accessToken, refreshToken, idToken) => {
    localStorage.setItem(LS_ACCESS_TOKEN,  accessToken)
    localStorage.setItem(LS_REFRESH_TOKEN, refreshToken)
    localStorage.setItem(LS_ID_TOKEN,      idToken)
    set({ token: accessToken, refreshToken, idToken })
  },
}))

export default useAuthStore