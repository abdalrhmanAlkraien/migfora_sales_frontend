import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import './styles/UserEditDrawer.css'

export default function UserEditDrawer({ open, user, onClose, onSave, isSelf = false }) {
  const [form,    setForm]    = useState({})
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  useEffect(() => {
    if (user) setForm({
      name:        user.name        || '',
      familyName:  user.familyName  || '',
      phoneNumber: user.phoneNumber || '',
      role:        user.groups?.includes('admin_group') ? 'admin_group' : 'sales',
    })
    setError('')
  }, [user, open])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const set = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('First name is required.'); return }
    if (!form.familyName.trim()) { setError('Last name is required.'); return }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600)) // replace with API
    onSave({
      ...user,
      name:        form.name,
      familyName:  form.familyName,
      phoneNumber: form.phoneNumber,
      groups:      [form.role],
      isAdmin:     form.role === 'admin_group',
    })
    setLoading(false)
  }

  return createPortal(
    <>
      <div
        className={`ued__overlay ${open ? 'ued__overlay--open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div className={`ued ${open ? 'ued--open' : ''}`} role="dialog" aria-modal="true">

        <div className="ued__header">
          <div>
            <h2 className="ued__title">Edit User</h2>
            {user && (
              <p className="ued__subtitle">{user.email}</p>
            )}
          </div>
          <button className="ued__close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {error && <div className="ued__error">{error}</div>}

        <form className="ued__form" onSubmit={handleSubmit} noValidate>
          <div className="ued__scroll">

            <div className="ued__section-title">Basic Info</div>

            <div className="ued__row">
              <div className="ued__field">
                <label className="ued__label">First Name <span className="ued__req">*</span></label>
                <input
                  className="ued__input"
                  value={form.name || ''}
                  onChange={set('name')}
                  placeholder="First name"
                />
              </div>
              <div className="ued__field">
                <label className="ued__label">Last Name <span className="ued__req">*</span></label>
                <input
                  className="ued__input"
                  value={form.familyName || ''}
                  onChange={set('familyName')}
                  placeholder="Last name"
                />
              </div>
            </div>

            <div className="ued__field">
              <label className="ued__label">Phone</label>
              <input
                className="ued__input"
                type="tel"
                value={form.phoneNumber || ''}
                onChange={set('phoneNumber')}
                placeholder="+966501234567"
              />
            </div>



            <div className="ued__section-title" style={{ marginTop: 8 }}>Role</div>

            {!isSelf && (
                <>
                <div className="ued__section-title" style={{ marginTop: 8 }}>Role</div>
                    <div className="ued__role-group">
                    {[
                        { value: 'sales',       label: 'Sales',  desc: 'Can manage companies, contacts, investigations' },
                        { value: 'admin_group', label: 'Admin',  desc: 'Full access including user management' },
                    ].map((r) => (
                        <button
                        key={r.value}
                        type="button"
                        className={`ued__role-btn ${form.role === r.value ? 'ued__role-btn--active' : ''}`}
                        onClick={() => setForm((p) => ({ ...p, role: r.value }))}
                        >
                        <div className="ued__role-top">
                            <span className="ued__role-label">{r.label}</span>
                            <div className={`ued__role-check ${form.role === r.value ? 'ued__role-check--on' : ''}`} />
                        </div>
                        <span className="ued__role-desc">{r.desc}</span>
                        </button>
                    ))}
                    </div>
                </>
            )}  


          </div>

          <div className="ued__footer">
            <button
              type="button"
              className="ued__btn ued__btn--ghost"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ued__btn ued__btn--primary"
              disabled={loading}
            >
              {loading ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>

      </div>
    </>,
    document.body
  )
}