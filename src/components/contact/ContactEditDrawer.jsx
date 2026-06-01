import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import './styles/ContactEditDrawer.css'

const STATUS_OPTIONS = [
  { value: 'NEW',           label: 'New' },
  { value: 'CONTACTED',     label: 'Contacted' },
  { value: 'INTERESTED',    label: 'Interested' },
  { value: 'MEETING_SET',   label: 'Meeting Set' },
  { value: 'PROPOSAL_SENT', label: 'Proposal Sent' },
  { value: 'NEGOTIATING',   label: 'Negotiating' },
  { value: 'WON',           label: 'Won' },
  { value: 'LOST',          label: 'Lost' },
  { value: 'ON_HOLD',       label: 'On Hold' },
]

export default function ContactEditDrawer({ open, contact, onClose, onSave }) {
  const [form,    setForm]    = useState({})
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  useEffect(() => {
    if (contact) setForm({ ...contact })
    setError('')
  }, [contact, open])

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
    if (!form.name?.trim()) { setError('Name is required.'); return }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600)) // replace with API
    onSave(form)
    setLoading(false)
  }

  return createPortal(
    <>
      <div
        className={`ced-contact__overlay ${open ? 'ced-contact__overlay--open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`ced-contact ${open ? 'ced-contact--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Edit contact"
      >
        <div className="ced-contact__header">
          <h2 className="ced-contact__title">Edit Contact</h2>
          <button className="ced-contact__close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {error && <div className="ced-contact__error">{error}</div>}

        <form className="ced-contact__form" onSubmit={handleSubmit} noValidate>
          <div className="ced-contact__scroll">

            <div className="ced-contact__section-title">Basic info</div>

            <div className="ced-contact__row">
              <div className="ced-contact__field">
                <label className="ced-contact__label">Name <span className="ced-contact__req">*</span></label>
                <input className="ced-contact__input" value={form.name || ''} onChange={set('name')} placeholder="Full name" />
              </div>
              <div className="ced-contact__field">
                <label className="ced-contact__label">Title</label>
                <input className="ced-contact__input" value={form.title || ''} onChange={set('title')} placeholder="e.g. CTO" />
              </div>
            </div>

            <div className="ced-contact__section-title">Contact channels</div>

            <div className="ced-contact__field">
              <label className="ced-contact__label">Email</label>
              <input className="ced-contact__input" type="email" value={form.email || ''} onChange={set('email')} placeholder="email@company.com" />
            </div>
            <div className="ced-contact__field">
              <label className="ced-contact__label">Phone</label>
              <input className="ced-contact__input" type="tel" value={form.phone || ''} onChange={set('phone')} placeholder="+966501234567" />
            </div>
            <div className="ced-contact__field">
              <label className="ced-contact__label">LinkedIn</label>
              <input className="ced-contact__input" value={form.linkedIn || ''} onChange={set('linkedIn')} placeholder="linkedin.com/in/..." />
            </div>
            <div className="ced-contact__field">
              <label className="ced-contact__label">Facebook</label>
              <input className="ced-contact__input" value={form.facebook || ''} onChange={set('facebook')} placeholder="facebook.com/..." />
            </div>

            <div className="ced-contact__section-title">Sales info</div>

            <div className="ced-contact__row">
              <div className="ced-contact__field">
                <label className="ced-contact__label">Status</label>
                <select className="ced-contact__input" value={form.status || 'NEW'} onChange={set('status')}>
                  {STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div className="ced-contact__field">
                <label className="ced-contact__label">Next Follow-up Date</label>
                <input
                  className="ced-contact__input"
                  type="date"
                  value={form.nextFollowUpDate || ''}
                  onChange={set('nextFollowUpDate')}
                />
              </div>
            </div>

            <div className="ced-contact__section-title">Notes</div>
            <div className="ced-contact__field">
              <textarea
                className="ced-contact__input ced-contact__textarea"
                value={form.notes || ''}
                onChange={set('notes')}
                rows={4}
                placeholder="Add notes about this contact…"
              />
            </div>

          </div>

          <div className="ced-contact__footer">
            <button type="button" className="ced-contact__btn ced-contact__btn--ghost"
              onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="ced-contact__btn ced-contact__btn--primary" disabled={loading}>
              {loading ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </>,
    document.body
  )
}