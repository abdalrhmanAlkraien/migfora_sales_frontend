import { useState } from 'react'
import { createPortal } from 'react-dom'
import './styles/ResetPasswordModal.css'

export default function ResetPasswordModal({ open, user, isAdmin, onClose, onReset }) {
  const [form,    setForm]    = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const set = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }))
    if (errors[field]) setErrors((p) => ({ ...p, [field]: '' }))
  }

  const strength = (pw) => {
    let score = 0
    if (pw.length >= 8)         score++
    if (/[A-Z]/.test(pw))       score++
    if (/[0-9]/.test(pw))       score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    return score
  }

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthCls   = ['', 'weak', 'fair', 'good', 'strong']
  const pw            = form.newPassword
  const pwStrength    = strength(pw)

  const validate = () => {
    const e = {}
    if (!isAdmin && !form.currentPassword) e.currentPassword = 'Required'
    if (!form.newPassword)                 e.newPassword = 'Required'
    else if (form.newPassword.length < 8)  e.newPassword = 'Min 8 characters'
    if (form.newPassword !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    return e
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setSuccess(true)
    setLoading(false)
  }

  const handleClose = () => {
    setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setErrors({})
    setSuccess(false)
    onClose()
  }

  if (!open) return null

  return createPortal(
    <>
      <div className="rpm__overlay" onClick={handleClose} />
      <div className="rpm__box" role="dialog" aria-modal="true">

        <div className="rpm__header">
          <div>
            <h2 className="rpm__title">Reset Password</h2>
            {user && (
              <p className="rpm__subtitle">
                {isAdmin ? `For ${user.name} ${user.familyName}` : 'Change your password'}
              </p>
            )}
          </div>
          <button className="rpm__close" onClick={handleClose}>
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {success ? (
          <div className="rpm__success">
            <div className="rpm__success-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="rpm__success-title">Password Updated</p>
            <p className="rpm__success-desc">
              {isAdmin
                ? `Password for ${user?.name} has been reset successfully.`
                : 'Your password has been changed successfully.'}
            </p>
            <button className="rpm__btn rpm__btn--primary" style={{ marginTop: 20 }} onClick={handleClose}>
              Done
            </button>
          </div>
        ) : (
          <form className="rpm__form" onSubmit={handleSubmit} noValidate>
            <div className="rpm__scroll">

              {!isAdmin && (
                <div className="rpm__field">
                  <label className="rpm__label">Current Password <span className="rpm__req">*</span></label>
                  <input className={`rpm__input ${errors.currentPassword ? 'rpm__input--error' : ''}`}
                    type="password" value={form.currentPassword} onChange={set('currentPassword')}
                    placeholder="Enter current password" />
                  {errors.currentPassword && <span className="rpm__error">{errors.currentPassword}</span>}
                </div>
              )}

              {isAdmin && (
                <div className="rpm__admin-note">
                  <svg viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M7 5h.01M7 7v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  A temporary password will be set. The user must change it on next login.
                </div>
              )}

              <div className="rpm__field">
                <label className="rpm__label">New Password <span className="rpm__req">*</span></label>
                <input className={`rpm__input ${errors.newPassword ? 'rpm__input--error' : ''}`}
                  type="password" value={form.newPassword} onChange={set('newPassword')}
                  placeholder="Enter new password" />
                {errors.newPassword && <span className="rpm__error">{errors.newPassword}</span>}
                {pw && (
                  <div className="rpm__strength">
                    <div className="rpm__strength-bars">
                      {[1,2,3,4].map((i) => (
                        <div key={i} className={`rpm__strength-bar ${pwStrength >= i ? `rpm__strength-bar--${strengthCls[pwStrength]}` : ''}`} />
                      ))}
                    </div>
                    <span className={`rpm__strength-label rpm__strength-label--${strengthCls[pwStrength]}`}>
                      {strengthLabel[pwStrength]}
                    </span>
                  </div>
                )}
              </div>

              <div className="rpm__field">
                <label className="rpm__label">Confirm Password <span className="rpm__req">*</span></label>
                <input className={`rpm__input ${errors.confirmPassword ? 'rpm__input--error' : ''}`}
                  type="password" value={form.confirmPassword} onChange={set('confirmPassword')}
                  placeholder="Confirm new password" />
                {errors.confirmPassword && <span className="rpm__error">{errors.confirmPassword}</span>}
              </div>

              <div className="rpm__rules">
                {[
                  { label: 'At least 8 characters', ok: pw.length >= 8 },
                  { label: 'Uppercase letter',       ok: /[A-Z]/.test(pw) },
                  { label: 'Number',                 ok: /[0-9]/.test(pw) },
                  { label: 'Special character',      ok: /[^A-Za-z0-9]/.test(pw) },
                ].map((r) => (
                  <div key={r.label} className={`rpm__rule ${r.ok ? 'rpm__rule--ok' : ''}`}>
                    <svg viewBox="0 0 12 12" fill="none">
                      {r.ok
                        ? <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                        : <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2"/>
                      }
                    </svg>
                    {r.label}
                  </div>
                ))}
              </div>

            </div>

            <div className="rpm__footer">
              <button type="button" className="rpm__btn rpm__btn--ghost"
                onClick={handleClose} disabled={loading}>Cancel</button>
              <button type="submit" className="rpm__btn rpm__btn--primary" disabled={loading}>
                {loading ? 'Updating…' : 'Update Password'}
              </button>
            </div>
          </form>
        )}

      </div>
    </>,
    document.body
  )
}