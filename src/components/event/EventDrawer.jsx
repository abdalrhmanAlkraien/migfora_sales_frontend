import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import './styles/EventDrawer.css'

const ATTENDANCE_TYPES = [
  { value: 'IN_PERSON', label: 'In Person' },
  { value: 'VIRTUAL',   label: 'Virtual' },
  { value: 'HYBRID',    label: 'Hybrid' },
]

const STATUS_OPTIONS = [
  { value: 'UPCOMING',  label: 'Upcoming' },
  { value: 'ONGOING',   label: 'Ongoing' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

const EMPTY = {
  name: '', description: '', website: '', linkedinUrl: '',
  country: '', city: '', venue: '', startDate: '', endDate: '',
  registrationDeadline: '', attendanceType: 'IN_PERSON',
  industry: '', expectedAttendees: '', cost: '', notes: '', status: 'UPCOMING',
}

export default function EventDrawer({ open, event, onClose, onSave }) {
  const [form,    setForm]    = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  useEffect(() => {
    if (event) {
      setForm({
        name:                 event.name                 || '',
        description:          event.description          || '',
        website:              event.website              || '',
        linkedinUrl:          event.linkedinUrl          || '',
        country:              event.country              || '',
        city:                 event.city                 || '',
        venue:                event.venue                || '',
        startDate:            event.startDate            || '',
        endDate:              event.endDate              || '',
        registrationDeadline: event.registrationDeadline || '',
        attendanceType:       event.attendanceType       || 'IN_PERSON',
        industry:             event.industry             || '',
        expectedAttendees:    event.expectedAttendees    || '',
        cost:                 event.cost                 || '',
        notes:                event.notes                || '',
        status:               event.status               || 'UPCOMING',
      })
    } else {
      setForm(EMPTY)
    }
    setError('')
  }, [event, open])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim())      { setError('Event name is required.'); return }
    if (!form.startDate)        { setError('Start date is required.'); return }
    setLoading(true)
    setError('')
    try {
      const payload = Object.fromEntries(
        Object.entries(form).filter(([_, v]) => v !== '' && v !== null)
      )
      if (payload.expectedAttendees) payload.expectedAttendees = Number(payload.expectedAttendees)
      await onSave(payload)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save event.')
    } finally {
      setLoading(false)
    }
  }

  const isEditing = !!event

  return createPortal(
    <>
      <div className={`evd__overlay ${open ? 'evd__overlay--open' : ''}`} onClick={onClose}/>
      <div className={`evd ${open ? 'evd--open' : ''}`} role="dialog" aria-modal="true">

        <div className="evd__header">
          <h2 className="evd__title">{isEditing ? 'Edit Event' : 'New Event'}</h2>
          <button className="evd__close" onClick={onClose}>
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {error && <div className="evd__error">{error}</div>}

        <form className="evd__form" onSubmit={handleSubmit} noValidate>
          <div className="evd__scroll">

            <div className="evd__section-title">Event Info</div>

            <div className="evd__field">
              <label className="evd__label">Name <span className="evd__req">*</span></label>
              <input className="evd__input" value={form.name} onChange={set('name')} placeholder="e.g. LEAP 2027"/>
            </div>

            <div className="evd__field">
              <label className="evd__label">Description</label>
              <textarea className="evd__input evd__textarea" value={form.description}
                onChange={set('description')} rows={3} placeholder="Event description…"/>
            </div>

            <div className="evd__row">
              <div className="evd__field">
                <label className="evd__label">Website</label>
                <input className="evd__input" value={form.website} onChange={set('website')} placeholder="https://…"/>
              </div>
              <div className="evd__field">
                <label className="evd__label">LinkedIn URL</label>
                <input className="evd__input" value={form.linkedinUrl} onChange={set('linkedinUrl')} placeholder="https://linkedin.com/…"/>
              </div>
            </div>

            <div className="evd__section-title">Location</div>

            <div className="evd__row">
              <div className="evd__field">
                <label className="evd__label">Country</label>
                <input className="evd__input" value={form.country} onChange={set('country')} placeholder="e.g. Saudi Arabia"/>
              </div>
              <div className="evd__field">
                <label className="evd__label">City</label>
                <input className="evd__input" value={form.city} onChange={set('city')} placeholder="e.g. Riyadh"/>
              </div>
            </div>

            <div className="evd__field">
              <label className="evd__label">Venue</label>
              <input className="evd__input" value={form.venue} onChange={set('venue')} placeholder="e.g. Riyadh Front Exhibition Center"/>
            </div>

            <div className="evd__section-title">Dates</div>

            <div className="evd__row">
              <div className="evd__field">
                <label className="evd__label">Start Date <span className="evd__req">*</span></label>
                <input className="evd__input" type="date" value={form.startDate} onChange={set('startDate')}/>
              </div>
              <div className="evd__field">
                <label className="evd__label">End Date</label>
                <input className="evd__input" type="date" value={form.endDate} onChange={set('endDate')}/>
              </div>
            </div>

            <div className="evd__field">
              <label className="evd__label">Registration Deadline</label>
              <input className="evd__input" type="date" value={form.registrationDeadline} onChange={set('registrationDeadline')}/>
            </div>

            <div className="evd__section-title">Details</div>

            <div className="evd__row">
              <div className="evd__field">
                <label className="evd__label">Attendance Type</label>
                <select className="evd__input" value={form.attendanceType} onChange={set('attendanceType')}>
                  {ATTENDANCE_TYPES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="evd__field">
                <label className="evd__label">Status</label>
                <select className="evd__input" value={form.status} onChange={set('status')}>
                  {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            <div className="evd__row">
              <div className="evd__field">
                <label className="evd__label">Industry</label>
                <input className="evd__input" value={form.industry} onChange={set('industry')} placeholder="e.g. Technology"/>
              </div>
              <div className="evd__field">
                <label className="evd__label">Expected Attendees</label>
                <input className="evd__input" type="number" value={form.expectedAttendees}
                  onChange={set('expectedAttendees')} placeholder="e.g. 100000"/>
              </div>
            </div>

            <div className="evd__field">
              <label className="evd__label">Cost</label>
              <input className="evd__input" value={form.cost} onChange={set('cost')} placeholder="e.g. Free for startups"/>
            </div>

            <div className="evd__section-title">Notes</div>
            <div className="evd__field">
              <textarea className="evd__input evd__textarea" value={form.notes}
                onChange={set('notes')} rows={3} placeholder="Internal notes about this event…"/>
            </div>

          </div>

          <div className="evd__footer">
            <button type="button" className="evd__btn evd__btn--ghost" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="evd__btn evd__btn--primary" disabled={loading}>
              {loading ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </>,
    document.body
  )
}