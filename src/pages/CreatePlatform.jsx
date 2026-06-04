import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { createPlatformApi } from '../api/platforms'
import './styles/CreatePlatform.css'

const PLATFORM_TYPES = [
  { value: 'WEBSITE',     label: 'Website' },
  { value: 'WEB_APP',     label: 'Web App' },
  { value: 'MOBILE_APP',  label: 'Mobile App' },
  { value: 'API',         label: 'API' },
  { value: 'ADMIN_PANEL', label: 'Admin Panel' },
  { value: 'E_COMMERCE',  label: 'E-Commerce' },
  { value: 'PORTAL',      label: 'Portal' },
  { value: 'OTHER',       label: 'Other' },
]

const INITIAL = {
  type: 'WEBSITE', name: '', url: '', domain: '',
  description: '', technology: '', hostingProvider: '', notes: '',
}

export default function CreatePlatform() {
  const { id }   = useParams() // companyId
  const navigate = useNavigate()

  const [form,     setForm]     = useState(INITIAL)
  const [errors,   setErrors]   = useState({})
  const [apiError, setApiError] = useState('')
  const [loading,  setLoading]  = useState(false)

  const set = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }))
    if (errors[field]) setErrors((p) => ({ ...p, [field]: '' }))
    if (apiError) setApiError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { setErrors({ name: 'Platform name is required.' }); return }
    setLoading(true)
    setApiError('')
    try {
      const payload = Object.fromEntries(
        Object.entries(form).filter(([_, v]) => v !== '')
      )
      const { data } = await createPlatformApi(id, payload)
      navigate(`/platforms/${data.id}`)
    } catch (err) {
      const res = err?.response?.data
      if (res?.details) setErrors(res.details)
      else setApiError(res?.message || 'Failed to create platform.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-platform">
      <div className="create-platform__header">
        <button className="create-platform__back"
          onClick={() => navigate(`/companies/${id}/platforms`)}>
          <svg viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Platforms
        </button>
        <h1 className="create-platform__title">New Platform</h1>
      </div>

      <div className="create-platform__card">
        {apiError && <div className="create-platform__api-error">{apiError}</div>}

        <form onSubmit={handleSubmit} noValidate>

          <div className="create-platform__section-title">Platform info</div>
          <div className="create-platform__row">
            <div className="create-platform__field">
              <label className="create-platform__label">Type</label>
              <select className="create-platform__input" value={form.type} onChange={set('type')}>
                {PLATFORM_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div className="create-platform__field">
              <label className="create-platform__label">Name <span className="create-platform__req">*</span></label>
              <input
                className={`create-platform__input ${errors.name ? 'create-platform__input--error' : ''}`}
                value={form.name} onChange={set('name')} placeholder="e.g. Main Website"
              />
              {errors.name && <span className="create-platform__field-error">{errors.name}</span>}
            </div>
          </div>

          <div className="create-platform__row">
            <div className="create-platform__field">
              <label className="create-platform__label">Domain</label>
              <input className="create-platform__input" value={form.domain}
                onChange={set('domain')} placeholder="e.g. tade.sa"/>
            </div>
            <div className="create-platform__field">
              <label className="create-platform__label">URL</label>
              <input className="create-platform__input" value={form.url}
                onChange={set('url')} placeholder="https://tade.sa"/>
            </div>
          </div>

          <div className="create-platform__section-title">Technical info</div>
          <div className="create-platform__row">
            <div className="create-platform__field">
              <label className="create-platform__label">Technology</label>
              <input className="create-platform__input" value={form.technology}
                onChange={set('technology')} placeholder="e.g. Next.js + Nginx"/>
            </div>
            <div className="create-platform__field">
              <label className="create-platform__label">Hosting Provider</label>
              <input className="create-platform__input" value={form.hostingProvider}
                onChange={set('hostingProvider')} placeholder="e.g. Hetzner"/>
            </div>
          </div>

          <div className="create-platform__field">
            <label className="create-platform__label">Description</label>
            <input className="create-platform__input" value={form.description}
              onChange={set('description')} placeholder="Short description of this platform"/>
          </div>

          <div className="create-platform__section-title">Notes</div>
          <div className="create-platform__field">
            <textarea className="create-platform__input create-platform__textarea"
              value={form.notes} onChange={set('notes')} rows={3}
              placeholder="Internal notes about this platform…"/>
          </div>

          <div className="create-platform__footer">
            <button type="button" className="create-platform__btn create-platform__btn--ghost"
              onClick={() => navigate(`/companies/${id}/platforms`)} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="create-platform__btn create-platform__btn--primary" disabled={loading}>
              {loading ? 'Creating…' : 'Create Platform'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}