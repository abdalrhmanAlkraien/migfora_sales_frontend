import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import './styles/CompanyEditDrawer.css'

const STATUS_OPTIONS = [
  'PROSPECT','CONTACTED','QUALIFIED','PROPOSAL','CLOSED_WON','CLOSED_LOST'
]
const SIZE_OPTIONS = [
  '1-10','11-50','51-200','201-500','501-1000','1000+'
]

export default function CompanyEditDrawer({ open, company, onClose, onSave }) {
  const [form,    setForm]    = useState({})
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

    useEffect(() => {
    if (company) setForm({ ...company })
    }, [company])

    useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
    }, [open, onClose])

    useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
    }, [open])

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name?.trim()) { setError('Company name is required.'); return }
    setError('')
    setLoading(true)

    try {
      // build patch payload — only send fields that changed
      const changed = Object.fromEntries(
        Object.entries(form).filter(([k, v]) => v !== (company[k] ?? ''))
      )
      await onSave(changed)
    } catch (err) {
      const res = err?.response?.data
      setError(res?.message || 'Failed to save changes. Please try again.')
    } finally {
      setLoading(false)
    }
  }


// ... all your existing code stays the same, only the return changes:

return createPortal(
  <>
    <div
      className={`ced__overlay ${open ? 'ced__overlay--open' : ''}`}
      onClick={onClose}
      aria-hidden="true"
    />
    <div
      className={`ced ${open ? 'ced--open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Edit company"
    >
  <>
      <div
        className={`ced__overlay ${open ? 'ced__overlay--open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`ced ${open ? 'ced--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Edit company"
      >
        <div className="ced__header">
          <h2 className="ced__title">Edit Company</h2>
          <button className="ced__close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {error && <div className="ced__error">{error}</div>}

        <form className="ced__form" onSubmit={handleSubmit} noValidate>
          <div className="ced__scroll">

            <div className="ced__section-title">Basic info</div>

            <div className="ced__field">
              <label className="ced__label">Company name <span className="ced__req">*</span></label>
              <input className="ced__input" value={form.name || ''} onChange={set('name')} required />
            </div>
            <div className="ced__field">
              <label className="ced__label">Domain</label>
              <input className="ced__input" value={form.domain || ''} onChange={set('domain')} placeholder="example.com" />
            </div>
            <div className="ced__field">
              <label className="ced__label">Website</label>
              <input className="ced__input" value={form.website || ''} onChange={set('website')} placeholder="https://example.com" />
            </div>
            <div className="ced__row">
              <div className="ced__field">
                <label className="ced__label">Industry</label>
                <input className="ced__input" value={form.industry || ''} onChange={set('industry')} />
              </div>
              <div className="ced__field">
                <label className="ced__label">Size</label>
                <select className="ced__input" value={form.size || ''} onChange={set('size')}>
                  <option value="">Select…</option>
                  {SIZE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="ced__row">
              <div className="ced__field">
                <label className="ced__label">Country</label>
                <input className="ced__input" value={form.country || ''} onChange={set('country')} />
              </div>
              <div className="ced__field">
                <label className="ced__label">City</label>
                <input className="ced__input" value={form.city || ''} onChange={set('city')} />
              </div>
            </div>

            <div className="ced__section-title" style={{marginTop:'20px'}}>Status & notes</div>

            <div className="ced__field">
              <label className="ced__label">Status</label>
              <select className="ced__input" value={form.status || ''} onChange={set('status')}>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            <div className="ced__field">
              <label className="ced__label">Notes</label>
              <textarea
                className="ced__input ced__textarea"
                value={form.notes || ''}
                onChange={set('notes')}
                rows={4}
                placeholder="Add internal notes about this company…"
              />
            </div>
          </div>

          <div className="ced__footer">
            <button type="button" className="ced__btn ced__btn--ghost" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="ced__btn ced__btn--primary" disabled={loading}>
              {loading ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </>
    </div>
  </>,
  document.body
)
}