import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { forgotPasswordApi, confirmForgotPasswordApi } from '../api/auth'
import './styles/ChangePassword.css'
import './styles/ForgotPassword.css'

const PASSWORD_RULES = [
  { label: 'At least 8 characters',      test: (v) => v.length >= 8 },
  { label: 'Uppercase letter',           test: (v) => /[A-Z]/.test(v) },
  { label: 'Lowercase letter',           test: (v) => /[a-z]/.test(v) },
  { label: 'Number',                     test: (v) => /\d/.test(v) },
  { label: 'Special character (!@#$…)',  test: (v) => /[^A-Za-z0-9]/.test(v) },
]

export default function ForgotPassword() {
  const navigate = useNavigate()

  // step: 'email' | 'code'
  const [step,        setStep]        = useState('email')
  const [email,       setEmail]       = useState('')
  const [code,        setCode]        = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm,     setConfirm]     = useState('')
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState('')
  const [resendMsg,   setResendMsg]   = useState('')
  const [success,     setSuccess]     = useState(false)

  const allRulesPassed = PASSWORD_RULES.every((r) => r.test(newPassword))
  const passwordsMatch = newPassword === confirm && confirm.length > 0
  const canSubmitCode  = code.trim().length === 6 && allRulesPassed && passwordsMatch

  // ── Step 1 — send reset email ─────────────────────────────────────────────
  const handleSendCode = async (e) => {
    e.preventDefault()
    if (!email.trim()) { setError('Email is required.'); return }
    setLoading(true)
    setError('')
    try {
      await forgotPasswordApi(email.trim())
    } catch {
      // always show success regardless of response (security best practice)
    } finally {
      setLoading(false)
      setStep('code')
    }
  }

  // ── Step 2 — confirm reset ────────────────────────────────────────────────
  const handleConfirm = async (e) => {
    e.preventDefault()
    if (!canSubmitCode) return
    setLoading(true)
    setError('')
    try {
      await confirmForgotPasswordApi(email.trim(), code.trim(), newPassword)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2500)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to reset password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Resend code ───────────────────────────────────────────────────────────
  const handleResend = async () => {
    setResendMsg('')
    setError('')
    try {
      await forgotPasswordApi(email.trim())
      setResendMsg('A new code has been sent to your email.')
    } catch {
      setResendMsg('A new code has been sent to your email.')
    }
  }

  return (
    <div className="cp-page">
      <div className="cp-card">

        <div className="cp-card__logo">
          MIG<span className="cp-card__logo-accent">FORA</span>
        </div>

        {/* ── Success state ── */}
        {success ? (
          <div className="fp-success">
            <div className="fp-success__icon">
              <svg viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="18" stroke="#10b981" strokeWidth="1.5"/>
                <path d="M12 20l6 6 10-12" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="fp-success__title">Password reset!</h2>
            <p className="fp-success__sub">Redirecting you to login…</p>
          </div>
        ) : step === 'email' ? (
          <>
            <div className="cp-card__heading-group">
              <span className="cp-card__eyebrow">Account Recovery</span>
              <h1 className="cp-card__title">Forgot password?</h1>
              <p className="cp-card__subtitle">
                Enter your email and we'll send you a reset code.
              </p>
            </div>

            {error && <div className="cp-card__error">{error}</div>}

            <form onSubmit={handleSendCode} noValidate>
              <div className="cp-field">
                <label className="cp-field__label" htmlFor="fp-email">Email</label>
                <input
                  id="fp-email"
                  type="email"
                  className="cp-field__input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError('') }}
                  required
                  autoFocus
                />
              </div>

              <button type="submit" className="cp-card__submit" disabled={loading}>
                {loading ? <span className="cp-card__spinner" /> : 'Send Reset Code'}
              </button>

              <button
                type="button"
                className="cp-card__back"
                onClick={() => navigate('/login')}
                disabled={loading}
              >
                Back to Login
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="cp-card__heading-group">
              <span className="cp-card__eyebrow">Account Recovery</span>
              <h1 className="cp-card__title">Enter reset code</h1>
              <p className="cp-card__subtitle">
                We sent a 6-digit code to <strong>{email}</strong>. Enter it below along with your new password.
              </p>
            </div>

            {error    && <div className="cp-card__error">{error}</div>}
            {resendMsg && <div className="fp-resend-msg">{resendMsg}</div>}

            <form onSubmit={handleConfirm} noValidate>

              <div className="cp-field">
                <label className="cp-field__label" htmlFor="fp-code">6-digit code</label>
                <input
                  id="fp-code"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  className="cp-field__input fp-code-input"
                  placeholder="123456"
                  value={code}
                  onChange={(e) => { setCode(e.target.value.replace(/\D/g, '')); setError('') }}
                  autoFocus
                />
              </div>

              <div className="cp-field">
                <label className="cp-field__label" htmlFor="fp-password">New password</label>
                <input
                  id="fp-password"
                  type="password"
                  className="cp-field__input"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>

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

              <div className="cp-field">
                <label className="cp-field__label" htmlFor="fp-confirm">Confirm password</label>
                <input
                  id="fp-confirm"
                  type="password"
                  className={`cp-field__input ${
                    confirm.length > 0
                      ? passwordsMatch ? 'cp-field__input--match' : 'cp-field__input--mismatch'
                      : ''
                  }`}
                  placeholder="••••••••"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  autoComplete="new-password"
                />
                {confirm.length > 0 && !passwordsMatch && (
                  <span className="cp-field__hint cp-field__hint--error">Passwords do not match</span>
                )}
                {confirm.length > 0 && passwordsMatch && (
                  <span className="cp-field__hint cp-field__hint--ok">Passwords match</span>
                )}
              </div>

              <button
                type="submit"
                className="cp-card__submit"
                disabled={!canSubmitCode || loading}
              >
                {loading ? <span className="cp-card__spinner" /> : 'Reset Password'}
              </button>

              <div className="fp-resend-row">
                <span>Didn't receive a code?</span>
                <button type="button" className="fp-resend-btn" onClick={handleResend}>
                  Resend code
                </button>
              </div>

              <button
                type="button"
                className="cp-card__back"
                onClick={() => { setStep('email'); setError(''); setCode(''); setNewPassword(''); setConfirm('') }}
                disabled={loading}
              >
                Change email
              </button>

            </form>
          </>
        )}

        <p className="cp-card__footer">
          MIGFORA internal use only — unauthorised access is prohibited
        </p>
      </div>
    </div>
  )
}