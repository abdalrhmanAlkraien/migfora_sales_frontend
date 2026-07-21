import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import ConfirmDialog from '../common/ConfirmDialog'
import './styles/FollowUpDrawer.css'

const TYPES = ['CALL', 'VISIT', 'MEETING', 'EMAIL', 'WHATSAPP', 'LINKEDIN', 'SMS', 'PROPOSAL', 'DEMO']
const STATUSES = ['SCHEDULED','DONE','MISSED']

const TYPE_LABELS = {
  CALL:     'Call',
  VISIT:    'Visit',
  MEETING:  'Meeting',
  EMAIL:    'Email',
  WHATSAPP: 'WhatsApp',
  LINKEDIN: 'LinkedIn',
  SMS:      'SMS',
  PROPOSAL: 'Proposal',
  DEMO:     'Demo',
}

const STATUS_LABELS = { SCHEDULED:'Scheduled', DONE:'Done', MISSED:'Missed' }

const EMPTY = { type: 'CALL', scheduledAt: '', notes: '', outcome: '', status: 'SCHEDULED' }

export default function FollowUpDrawer({ open, followUp, onClose, onSave, onDelete }) {
  const [form,       setForm]       = useState(EMPTY)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState('')

  useEffect(() => {
    if (followUp) {
      setForm({
        type:        followUp.type,
        scheduledAt: followUp.scheduledAt?.slice(0, 16) || '',
        notes:       followUp.notes    || '',
        outcome:     followUp.outcome  || '',
        status:      followUp.status,
      })
    } else {
      setForm(EMPTY)
    }
    setError('')
  }, [followUp, open])

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
    if (!form.scheduledAt) { setError('Please set a date.'); return }
    setLoading(true)
    setError('')
    try {
      await onSave(form)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const isEditing = !!followUp

  return createPortal(
    <>
      <div className={`fud__overlay ${open ? 'fud__overlay--open' : ''}`} onClick={onClose} aria-hidden="true" />
      <div className={`fud ${open ? 'fud--open' : ''}`} role="dialog" aria-modal="true">

        <div className="fud__header">
          <h2 className="fud__title">{isEditing ? 'Edit Follow-up' : 'New Follow-up'}</h2>
          <button className="fud__close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {error && <div className="fud__error">{error}</div>}

        <form className="fud__form" onSubmit={handleSubmit} noValidate>
          <div className="fud__scroll">

            <div className="fud__field">
              <label className="fud__label">Type</label>
              <div className="fud__type-group">
                {TYPES.map((t) => (
                  <button key={t} type="button"
                    className={`fud__type-btn ${form.type === t ? 'fud__type-btn--active' : ''}`}
                    onClick={() => setForm((p) => ({ ...p, type: t }))}>
                    {TYPE_LABELS[t]}
                  </button>
                ))}
              </div>
            </div>

            <div className="fud__field">
              <label className="fud__label">Date & Time <span className="fud__req">*</span></label>
              <input className="fud__input" type="datetime-local"
                value={form.scheduledAt} onChange={set('scheduledAt')} required />
            </div>

            <div className="fud__field">
              <label className="fud__label">Status</label>
              <div className="fud__status-group">
                {STATUSES.map((s) => (
                  <button key={s} type="button"
                    className={`fud__status-btn fud__status-btn--${s.toLowerCase()} ${form.status === s ? 'fud__status-btn--active' : ''}`}
                    onClick={() => setForm((p) => ({ ...p, status: s }))}>
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>

            <div className="fud__field">
              <label className="fud__label">Notes</label>
              <textarea className="fud__input fud__textarea"
                value={form.notes} onChange={set('notes')} rows={3}
                placeholder="What was discussed, goals for this interaction…" />
            </div>

            {form.status === 'DONE' && (
              <div className="fud__field">
                <label className="fud__label">Outcome</label>
                <textarea className="fud__input fud__textarea"
                  value={form.outcome} onChange={set('outcome')} rows={3}
                  placeholder="What was the result? Next steps?" />
              </div>
            )}

          </div>

          <div className="fud__footer">
            {isEditing && (
              <button type="button" className="fud__btn fud__btn--delete"
                onClick={() => setDeleteOpen(true)} disabled={loading}>
                Delete
              </button>
            )}
            <div className="fud__footer-right">
              <button type="button" className="fud__btn fud__btn--ghost"
                onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="fud__btn fud__btn--primary" disabled={loading}>
                {loading ? 'Saving…' : isEditing ? 'Save Changes' : 'Add Follow-up'}
              </button>
            </div>
          </div>
        </form>

      </div>

      <ConfirmDialog
        isOpen={deleteOpen}
        title="Delete follow-up"
        message="Are you sure you want to delete this follow-up?"
        confirmLabel="Delete"
        isDanger
        onConfirm={() => { setDeleteOpen(false); onDelete(followUp.id) }}
        onCancel={() => setDeleteOpen(false)}
      />
    </>,
    document.body
  )
}