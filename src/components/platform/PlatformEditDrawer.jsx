import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import './styles/PlatformEditDrawer.css'

const STATUS_OPTIONS = [
  { value: 'ACTIVE',            label: 'Active' },
  { value: 'INACTIVE',          label: 'Inactive' },
  { value: 'UNDER_DEVELOPMENT', label: 'Under Development' },
  { value: 'DECOMMISSIONED',    label: 'Decommissioned' },
]

export default function PlatformEditDrawer({ open, platform, onClose, onSave }) {
  const [form,    setForm]    = useState({})
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  useEffect(() => {
    if (platform) setForm({
      name:            platform.name            || '',
      status:          platform.status          || 'ACTIVE',
      url:             platform.url             || '',
      domain:          platform.domain          || '',
      technology:      platform.technology      || '',
      hostingProvider: platform.hostingProvider || '',
      notes:           platform.notes           || '',
    })
    setError('')
  }, [platform, open])

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
    if (!form.name.trim()) { setError('Name is required.'); return }
    setLoading(true)
    setError('')
    try {
      const changed = Object.fromEntries(
        Object.entries(form).filter(([k, v]) => v !== (platform[k] ?? ''))
      )
      await onSave(changed)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save.')
    } finally {
      setLoading(false)
    }
  }

  return createPortal(
    <>
      <div className={`ped__overlay ${open ? 'ped__overlay--open' : ''}`} onClick={onClose} aria-hidden="true"/>
      <div className={`ped ${open ? 'ped--open' : ''}`} role="dialog" aria-modal="true">

        <div className="ped__header">
          <h2 className="ped__title">Edit Platform</h2>
          <button className="ped__close" onClick={onClose}>
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {error && <div className="ped__error">{error}</div>}

        <form className="ped__form" onSubmit={handleSubmit} noValidate>
          <div className="ped__scroll">

            <div className="ped__section-title">Basic info</div>
            <div className="ped__field">
              <label className="ped__label">Name <span className="ped__req">*</span></label>
              <input className="ped__input" value={form.name || ''} onChange={set('name')} placeholder="Platform name"/>
            </div>
            <div className="ped__field">
              <label className="ped__label">Status</label>
              <select className="ped__input" value={form.status || 'ACTIVE'} onChange={set('status')}>
                {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="ped__row">
              <div className="ped__field">
                <label className="ped__label">Domain</label>
                <input className="ped__input" value={form.domain || ''} onChange={set('domain')} placeholder="e.g. tade.sa"/>
              </div>
              <div className="ped__field">
                <label className="ped__label">URL</label>
                <input className="ped__input" value={form.url || ''} onChange={set('url')} placeholder="https://tade.sa"/>
              </div>
            </div>

            <div className="ped__section-title">Technical info</div>
            <div className="ped__row">
              <div className="ped__field">
                <label className="ped__label">Technology</label>
                <input className="ped__input" value={form.technology || ''} onChange={set('technology')} placeholder="e.g. Next.js"/>
              </div>
              <div className="ped__field">
                <label className="ped__label">Hosting</label>
                <input className="ped__input" value={form.hostingProvider || ''} onChange={set('hostingProvider')} placeholder="e.g. Hetzner"/>
              </div>
            </div>

            <div className="ped__section-title">Notes</div>
            <div className="ped__field">
              <textarea className="ped__input ped__textarea" value={form.notes || ''} onChange={set('notes')} rows={3}/>
            </div>

          </div>

          <div className="ped__footer">
            <button type="button" className="ped__btn ped__btn--ghost" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="ped__btn ped__btn--primary" disabled={loading}>
              {loading ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </>,
    document.body
  )
}