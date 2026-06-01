import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createCompanyApi } from '../api/companies'
import './styles/CreateCompany.css'

const STATUS_OPTIONS = [
  { value: 'PROSPECT',    label: 'Prospect' },
  { value: 'CONTACTED',   label: 'Contacted' },
  { value: 'QUALIFIED',   label: 'Qualified' },
  { value: 'PROPOSAL',    label: 'Proposal' },
  { value: 'CLOSED_WON',  label: 'Closed Won' },
  { value: 'CLOSED_LOST', label: 'Closed Lost' },
]

const SIZE_OPTIONS = [
  { value: 'STARTUP', label: 'Startup (1–10)' },
  { value: 'SME',     label: 'SME (11–200)' },
  { value: 'MID',     label: 'Mid-size (201–1000)' },
  { value: 'LARGE',   label: 'Large (1000+)' },
]

const INITIAL_FORM = {
  name:     '',
  domain:   '',
  website:  '',
  industry: '',
  country:  '',
  city:     '',
  size:     '',
  status:   'PROSPECT',
  notes:    '',
}

export default function CreateCompany() {
  const navigate = useNavigate()

  const [form,    setForm]    = useState(INITIAL_FORM)
  const [errors,  setErrors]  = useState({})
  const [apiError,setApiError]= useState('')
  const [loading, setLoading] = useState(false)

  const set = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }))
    if (errors[field]) setErrors((p) => ({ ...p, [field]: '' }))
    if (apiError)       setApiError('')
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Company name is required.'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }

    setLoading(true)
    setApiError('')

    try {
      // build payload — omit empty optional fields
      const payload = Object.fromEntries(
        Object.entries(form).filter(([_, v]) => v !== '')
      )
      const { data } = await createCompanyApi(payload)
      navigate(`/companies/${data.id}`)
    } catch (err) {
      const res = err?.response?.data
      if (res?.details) {
        // field-level validation errors from backend
        setErrors(res.details)
      } else {
        setApiError(res?.message || 'Failed to create company. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-company">

      <div className="create-company__header">
        <button className="create-company__back" onClick={() => navigate('/companies')}>
          <svg viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Companies
        </button>
        <h1 className="create-company__title">Add Company</h1>
      </div>

      <div className="create-company__card">

        {apiError && (
          <div className="create-company__api-error">{apiError}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>

          <div className="create-company__section-title">Basic info</div>

          <div className="create-company__row">
            <div className="create-company__field">
              <label className="create-company__label">
                Company name <span className="create-company__req">*</span>
              </label>
              <input
                className={`create-company__input ${errors.name ? 'create-company__input--error' : ''}`}
                value={form.name}
                onChange={set('name')}
                placeholder="e.g. Tade SA"
              />
              {errors.name && <span className="create-company__field-error">{errors.name}</span>}
            </div>

            <div className="create-company__field">
              <label className="create-company__label">Domain</label>
              <input
                className={`create-company__input ${errors.domain ? 'create-company__input--error' : ''}`}
                value={form.domain}
                onChange={set('domain')}
                placeholder="e.g. tade.sa"
              />
              {errors.domain && <span className="create-company__field-error">{errors.domain}</span>}
            </div>
          </div>

          <div className="create-company__row">
            <div className="create-company__field">
              <label className="create-company__label">Website</label>
              <input
                className="create-company__input"
                value={form.website}
                onChange={set('website')}
                placeholder="https://example.com"
              />
            </div>
            <div className="create-company__field">
              <label className="create-company__label">Industry</label>
              <input
                className="create-company__input"
                value={form.industry}
                onChange={set('industry')}
                placeholder="e.g. E-Commerce"
              />
            </div>
          </div>

          <div className="create-company__row">
            <div className="create-company__field">
              <label className="create-company__label">Country</label>
              <input
                className="create-company__input"
                value={form.country}
                onChange={set('country')}
                placeholder="e.g. Saudi Arabia"
              />
            </div>
            <div className="create-company__field">
              <label className="create-company__label">City</label>
              <input
                className="create-company__input"
                value={form.city}
                onChange={set('city')}
                placeholder="e.g. Riyadh"
              />
            </div>
          </div>

          <div className="create-company__row">
            <div className="create-company__field">
              <label className="create-company__label">Company size</label>
              <select className="create-company__input" value={form.size} onChange={set('size')}>
                <option value="">Select size…</option>
                {SIZE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className="create-company__field">
              <label className="create-company__label">Status</label>
              <select className="create-company__input" value={form.status} onChange={set('status')}>
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="create-company__section-title" style={{ marginTop: '8px' }}>
            Notes
          </div>

          <div className="create-company__field">
            <textarea
              className="create-company__input create-company__textarea"
              value={form.notes}
              onChange={set('notes')}
              rows={4}
              placeholder="Add internal notes about this company…"
            />
          </div>

          <div className="create-company__footer">
            <button
              type="button"
              className="create-company__btn create-company__btn--ghost"
              onClick={() => navigate('/companies')}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="create-company__btn create-company__btn--primary"
              disabled={loading}
            >
              {loading ? 'Creating…' : 'Create Company'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}