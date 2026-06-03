import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { changePasswordApi } from '../api/auth'
import useAuthStore from '../store/authStore'
import appConfig from '../config/appConfig'
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
  const { challengeSession, challengeEmail, temporaryPassword, setAuth, clearAuth } = useAuthStore()

  const [newPassword,     setNewPassword]     = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error,           setError]           = useState('')
  const [loading,         setLoading]         = useState(false)

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
        challengeEmail,
        temporaryPassword,
        newPassword,
        challengeSession
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
    <div className="cp-page">
      <div className="cp-card">

        {/* Logo */}
        <div className="cp-card__logo">
          MIG<span className="cp-card__logo-accent">FORA</span>
        </div>

        {/* Heading */}
        <div className="cp-card__heading-group">
          <span className="cp-card__eyebrow">Security Setup</span>
          <h1 className="cp-card__title">Set your password</h1>
          <p className="cp-card__subtitle">
            First login — create a secure password to continue.
          </p>
        </div>

        {error && (
          <div className="cp-card__error" role="alert">{error}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>

          {/* New password */}
          <div className="cp-field">
            <label className="cp-field__label" htmlFor="new-password">
              New password
            </label>
            <input
              id="new-password"
              type="password"
              className="cp-field__input"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          {/* Password rules */}
          {newPassword.length > 0 && (
            <ul className="cp-rules">
              {PASSWORD_RULES.map((rule) => (
                <li
                  key={rule.label}
                  className={`cp-rules__item ${rule.test(newPassword) ? 'cp-rules__item--pass' : ''}`}
                >
                  <svg viewBox="0 0 12 12" fill="none" className="cp-rules__icon">
                    {rule.test(newPassword)
                      ? <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      : <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2"/>
                    }
                  </svg>
                  {rule.label}
                </li>
              ))}
            </ul>
          )}

          {/* Confirm password */}
          <div className="cp-field">
            <label className="cp-field__label" htmlFor="confirm-password">
              Confirm password
            </label>
            <input
              id="confirm-password"
              type="password"
              className={`cp-field__input ${
                confirmPassword.length > 0
                  ? passwordsMatch
                    ? 'cp-field__input--match'
                    : 'cp-field__input--mismatch'
                  : ''
              }`}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            {confirmPassword.length > 0 && !passwordsMatch && (
              <span className="cp-field__hint cp-field__hint--error">
                Passwords do not match
              </span>
            )}
            {confirmPassword.length > 0 && passwordsMatch && (
              <span className="cp-field__hint cp-field__hint--ok">
                Passwords match
              </span>
            )}
          </div>

          {/* Actions */}
          <button
            type="submit"
            className="cp-card__submit"
            disabled={!canSubmit}
          >
            {loading
              ? <span className="cp-card__spinner" />
              : 'Set Password & Sign In'
            }
          </button>

          <button
            type="button"
            className="cp-card__back"
            onClick={() => { clearAuth(); navigate('/login', { replace: true }) }}
            disabled={loading}
          >
            Back to Login
          </button>

        </form>

        <p className="cp-card__footer">
          MIGFORA internal use only — unauthorised access is prohibited
        </p>

      </div>
    </div>
  )
}