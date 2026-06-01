import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { createContactApi } from '../api/contacts'
import './styles/CreateContact.css'

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

const INITIAL = {
  name: '', title: '', email: '', phone: '',
  linkedIn: '', notes: '', status: 'NEW',
}

export default function CreateContact() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [form,     setForm]     = useState(INITIAL)
  const [errors,   setErrors]   = useState({})
  const [loading,  setLoading]  = useState(false)
  const [apiError, setApiError] = useState('')

  const set = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }))
    if (errors[field]) setErrors((p) => ({ ...p, [field]: '' }))
    if (apiError) setApiError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { setErrors({ name: 'Name is required.' }); return }
    setLoading(true)
    setApiError('')
    try {
      const payload = Object.fromEntries(
        Object.entries(form).filter(([_, v]) => v !== '')
      )
      await createContactApi(id, payload)
      navigate(`/companies/${id}/contacts`)
    } catch (err) {
      setApiError(err?.response?.data?.message || 'Failed to create contact.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-contact">
      <div className="create-contact__header">
        <button className="create-contact__back" onClick={() => navigate(`/companies/${id}/contacts`)}>
          <svg viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Contacts
        </button>
        <h1 className="create-contact__title">New Contact</h1>
      </div>

      <div className="create-contact__card">
        {apiError && <div className="create-contact__api-error">{apiError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="create-contact__section-title">Basic info</div>
          <div className="create-contact__row">
            <div className="create-contact__field">
              <label className="create-contact__label">Name <span className="create-contact__req">*</span></label>
              <input
                className={`create-contact__input ${errors.name ? 'create-contact__input--error' : ''}`}
                value={form.name} onChange={set('name')} placeholder="Full name"
              />
              {errors.name && <span className="create-contact__field-error">{errors.name}</span>}
            </div>
            <div className="create-contact__field">
              <label className="create-contact__label">Title</label>
              <input className="create-contact__input" value={form.title} onChange={set('title')} placeholder="e.g. CTO" />
            </div>
          </div>

          <div className="create-contact__section-title">Contact channels</div>
          <div className="create-contact__row">
            <div className="create-contact__field">
              <label className="create-contact__label">Email</label>
              <input className="create-contact__input" type="email" value={form.email} onChange={set('email')} placeholder="email@company.com" />
            </div>
            <div className="create-contact__field">
              <label className="create-contact__label">Phone</label>
              <input className="create-contact__input" type="tel" value={form.phone} onChange={set('phone')} placeholder="+966501234567" />
            </div>
          </div>
          <div className="create-contact__field">
            <label className="create-contact__label">LinkedIn</label>
            <input className="create-contact__input" value={form.linkedIn} onChange={set('linkedIn')} placeholder="https://linkedin.com/in/..." />
          </div>

          <div className="create-contact__section-title">Sales info</div>
          <div className="create-contact__field">
            <label className="create-contact__label">Status</label>
            <select className="create-contact__input" value={form.status} onChange={set('status')}>
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div className="create-contact__section-title">Notes</div>
          <div className="create-contact__field">
            <textarea
              className="create-contact__input create-contact__textarea"
              value={form.notes} onChange={set('notes')} rows={4}
              placeholder="Add notes about this contact…"
            />
          </div>

          <div className="create-contact__footer">
            <button type="button" className="create-contact__btn create-contact__btn--ghost"
              onClick={() => navigate(`/companies/${id}/contacts`)} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="create-contact__btn create-contact__btn--primary" disabled={loading}>
              {loading ? 'Creating…' : 'Create Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}