import { useState } from 'react'
import { createPortal } from 'react-dom'
import { inviteUserApi } from '../../api/users'
import './styles/InviteUserModal.css'

const EMPTY = { name: '', familyName: '', email: '', phoneNumber: '', role: 'sales' }

export default function InviteUserModal({ open, onClose, onInvite }) {
  const [form,     setForm]     = useState(EMPTY)
  const [errors,   setErrors]   = useState({})
  const [loading,  setLoading]  = useState(false)
  const [apiError, setApiError] = useState('')

  const set = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }))
    if (errors[field]) setErrors((p) => ({ ...p, [field]: '' }))
    if (apiError) setApiError('')
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim())       e.name       = 'Required'
    if (!form.familyName.trim()) e.familyName = 'Required'
    if (!form.email.trim())      e.email      = 'Required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    setApiError('')
    try {
      await inviteUserApi({
        name:        form.name,
        familyName:  form.familyName,
        email:       form.email,
        phoneNumber: form.phoneNumber || undefined,
        role:        form.role,
      })
      setForm(EMPTY)
      onInvite()
    } catch (err) {
      setApiError(err?.response?.data?.message || 'Failed to invite user. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => { setForm(EMPTY); setErrors({}); setApiError(''); onClose() }

  if (!open) return null

  return createPortal(
    <>
      <div className="ium__overlay" onClick={handleClose} />
      <div className="ium__box" role="dialog" aria-modal="true">
        <div className="ium__header">
          <h2 className="ium__title">Invite User</h2>
          <button className="ium__close" onClick={handleClose}>
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {apiError && <div className="ium__api-error">{apiError}</div>}

        <form className="ium__form" onSubmit={handleSubmit} noValidate>
          <div className="ium__scroll">

            <div className="ium__row">
              <div className="ium__field">
                <label className="ium__label">First Name <span className="ium__req">*</span></label>
                <input className={`ium__input ${errors.name ? 'ium__input--error' : ''}`}
                  value={form.name} onChange={set('name')} placeholder="First name" />
                {errors.name && <span className="ium__error">{errors.name}</span>}
              </div>
              <div className="ium__field">
                <label className="ium__label">Last Name <span className="ium__req">*</span></label>
                <input className={`ium__input ${errors.familyName ? 'ium__input--error' : ''}`}
                  value={form.familyName} onChange={set('familyName')} placeholder="Last name" />
                {errors.familyName && <span className="ium__error">{errors.familyName}</span>}
              </div>
            </div>

            <div className="ium__field">
              <label className="ium__label">Email <span className="ium__req">*</span></label>
              <input className={`ium__input ${errors.email ? 'ium__input--error' : ''}`}
                type="email" value={form.email} onChange={set('email')} placeholder="user@migfora.com" />
              {errors.email && <span className="ium__error">{errors.email}</span>}
            </div>

            <div className="ium__field">
              <label className="ium__label">Phone</label>
              <input className="ium__input" type="tel" value={form.phoneNumber}
                onChange={set('phoneNumber')} placeholder="+966501234567" />
            </div>

            <div className="ium__field">
              <label className="ium__label">Role</label>
              <div className="ium__role-group">
                {[
                  { value: 'sales',       label: 'Sales', desc: 'Can manage companies, contacts, investigations' },
                  { value: 'admin_group', label: 'Admin', desc: 'Full access including user management' },
                ].map((r) => (
                  <button
                    key={r.value} type="button"
                    className={`ium__role-btn ${form.role === r.value ? 'ium__role-btn--active' : ''}`}
                    onClick={() => setForm((p) => ({ ...p, role: r.value }))}
                  >
                    <div className="ium__role-top">
                      <span className="ium__role-label">{r.label}</span>
                      <div className={`ium__role-check ${form.role === r.value ? 'ium__role-check--on' : ''}`} />
                    </div>
                    <span className="ium__role-desc">{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          <div className="ium__footer">
            <button type="button" className="ium__btn ium__btn--ghost"
              onClick={handleClose} disabled={loading}>Cancel</button>
            <button type="submit" className="ium__btn ium__btn--primary" disabled={loading}>
              {loading ? 'Inviting…' : 'Send Invitation'}
            </button>
          </div>
        </form>
      </div>
    </>,
    document.body
  )
}