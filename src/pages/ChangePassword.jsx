import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { changePasswordApi } from '../api/auth'
import useAuthStore from '../store/authStore'
import appConfig from '../config/appConfig'
import './styles/Login.css'
import './styles/ChangePassword.css'

const PASSWORD_RULES = [
  { label: 'At least 8 characters',     test: (v) => v.length >= 8 },
  { label: 'Uppercase letter',          test: (v) => /[A-Z]/.test(v) },
  { label: 'Lowercase letter',          test: (v) => /[a-z]/.test(v) },
  { label: 'Number',                    test: (v) => /\d/.test(v) },
  { label: 'Special character (!@#$…)', test: (v) => /[^A-Za-z0-9]/.test(v) },
]

export default function ChangePassword() {
  const navigate = useNavigate()
  const { challengeSession, challengeEmail, setAuth, clearAuth } = useAuthStore()

  const [newPassword,     setNewPassword]     = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error,           setError]           = useState('')
  const [loading,         setLoading]         = useState(false)

  // Guard — no active challenge → back to login
  useEffect(() => {
    if (!challengeSession || !challengeEmail) {
      navigate('/login', { replace: true })
    }
  }, [challengeSession, challengeEmail, navigate])

  const allRulesPassed = PASSWORD_RULES.every((r) => r.test(newPassword))
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0
  const canSubmit      = allRulesPassed && passwordsMatch && !loading

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setError('')
    setLoading(true)

    try {
      const { data } = await changePasswordApi(
        challengeEmail, newPassword, challengeSession
      )
      setAuth(
        data[appConfig.auth.accessTokenKey],
        data[appConfig.auth.refreshTokenKey],
        data[appConfig.auth.idTokenKey],
        data[appConfig.auth.userKey]
      )
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(
        err?.response?.data?.[appConfig.auth.messageKey] ||
        'Failed to update password. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login">
      <div className="login__card change-password__card">
        <div className="login__brand">
          <span className="login__brand-m">M</span>
          <span className="login__brand-text">IGFORA</span>
        </div>
        <p className="login__subtitle">Security Setup</p>
        <h1 className="login__heading">Set your password</h1>
        <p className="change-password__info">
          First login — please create a secure password to continue.
        </p>

        {error && <div className="form-error" role="alert">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="new-password">New password</label>
            <input
              id="new-password" type="password" className="form-input"
              placeholder="••••••••" value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required autoComplete="new-password"
            />
          </div>

          {newPassword.length > 0 && (
            <ul className="change-password__rules">
              {PASSWORD_RULES.map((rule) => (
                <li key={rule.label}
                  className={`change-password__rule ${rule.test(newPassword) ? 'change-password__rule--pass' : ''}`}
                >
                  <span className="change-password__rule-icon" aria-hidden="true">
                    {rule.test(newPassword) ? '✓' : '○'}
                  </span>
                  {rule.label}
                </li>
              ))}
            </ul>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="confirm-password">Confirm password</label>
            <input
              id="confirm-password" type="password"
              className={`form-input ${
                confirmPassword.length > 0
                  ? passwordsMatch
                    ? 'change-password__input--match'
                    : 'change-password__input--mismatch'
                  : ''
              }`}
              placeholder="••••••••" value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required autoComplete="new-password"
            />
            {confirmPassword.length > 0 && !passwordsMatch && (
              <span className="change-password__match-hint">
                Passwords do not match
              </span>
            )}
          </div>

          <button type="submit" className="form-btn" disabled={!canSubmit}>
            {loading
              ? <span className="login__spinner" aria-label="Updating…" />
              : 'Set Password & Sign In'
            }
          </button>
          <button type="button" className="form-btn-ghost"
            onClick={() => { clearAuth(); navigate('/login', { replace: true }) }}
            disabled={loading}
          >
            Back to Login
          </button>
        </form>

        <p className="login__footer-note">
          MIGFORA internal use only — unauthorised access is prohibited
        </p>
      </div>
    </div>
  )
}