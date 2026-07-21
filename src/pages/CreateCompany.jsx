import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createCompanyApi } from '../api/companies'
import './styles/CreateCompany.css'
import { getIndustriesApi } from '../api/industries'

const STATUS_OPTIONS = [
  { value: 'PROSPECT', label: 'Prospect' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'QUALIFIED', label: 'Qualified' },
  { value: 'PROPOSAL', label: 'Proposal' },
  { value: 'CLOSED_WON', label: 'Closed Won' },
  { value: 'CLOSED_LOST', label: 'Closed Lost' },
]

const SIZE_OPTIONS = [
  { value: 'STARTUP', label: 'Startup (1–10)' },
  { value: 'SME', label: 'SME (11–200)' },
  { value: 'MID', label: 'Mid-size (201–1000)' },
  { value: 'LARGE', label: 'Large (1000+)' },
]

const PLATFORM_TYPES = [
  { value: 'WEBSITE', label: 'Website' },
  { value: 'WEB_APP', label: 'Web App' },
  { value: 'MOBILE_APP', label: 'Mobile App' },
  { value: 'API', label: 'API' },
  { value: 'ADMIN_PANEL', label: 'Admin Panel' },
  { value: 'E_COMMERCE', label: 'E-Commerce' },
  { value: 'PORTAL', label: 'Portal' },
  { value: 'OTHER', label: 'Other' },
]

const EMPTY_PLATFORM = { type: 'WEBSITE', name: '', url: '', domain: '' }

const INITIAL_FORM = {
  name: '', domain: '', website: '', linkedinUrl: '',
  country: '', city: '', size: '', status: 'PROSPECT',
  leadSource: 'LINKEDIN_SEARCH',
}

const LEAD_SOURCE_OPTIONS = [
  { value: 'LINKEDIN_SEARCH', label: 'LinkedIn Search' },
  { value: 'LINKEDIN_CONTENT', label: 'LinkedIn Content' },
  { value: 'PERSONAL_NETWORK', label: 'Personal Network' },
  { value: 'REFERRAL', label: 'Referral' },
  { value: 'COLD_EMAIL', label: 'Cold Email' },
  { value: 'EVENT_CONFERENCE', label: 'Event / Conference' },
  { value: 'INBOUND_WEBSITE', label: 'Inbound Website' },
  { value: 'OTHER', label: 'Other' },
]

export default function CreateCompany() {
  const navigate = useNavigate()

  const [form, setForm] = useState(INITIAL_FORM)
  const [platforms, setPlatforms] = useState([{ ...EMPTY_PLATFORM }])
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)
  const [notes, setNotes] = useState([])

  const addNote = () => setNotes((p) => [...p, ''])
  const removeNote = (i) => setNotes((p) => p.filter((_, idx) => idx !== i))
  const setNote = (i, val) => setNotes((p) => p.map((n, idx) => idx === i ? val : n))
  const [industries, setIndustries] = useState([])


  const set = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }))
    if (errors[field]) setErrors((p) => ({ ...p, [field]: '' }))
    if (apiError) setApiError('')
  }

  const setPlatform = (index, field) => (e) => {
    setPlatforms((p) => p.map((pl, i) =>
      i === index ? { ...pl, [field]: e.target.value } : pl
    ))
    if (errors[`platform_${index}_${field}`]) {
      setErrors((p) => ({ ...p, [`platform_${index}_${field}`]: '' }))
    }
  }

  const addPlatform = () => {
    setPlatforms((p) => [...p, { ...EMPTY_PLATFORM }])
  }

  const removePlatform = (index) => {
    if (platforms.length === 1) return // must keep at least one
    setPlatforms((p) => p.filter((_, i) => i !== index))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Company name is required.'
    platforms.forEach((pl, i) => {
      if (!pl.name.trim()) e[`platform_${i}_name`] = 'Platform name is required.'
      if (!pl.type) e[`platform_${i}_type`] = 'Type is required.'
    })
    return e
  }

  useEffect(() => {
    getIndustriesApi().then(({ data }) => setIndustries(data)).catch(() => { })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }

    setLoading(true)
    setApiError('')
    try {
      const payload = {
        ...Object.fromEntries(Object.entries(form).filter(([_, v]) => v !== '')),
        industryId: form.industryId ? Number(form.industryId) : undefined,
        platforms: platforms.map((pl) =>
          Object.fromEntries(Object.entries(pl).filter(([_, v]) => v !== ''))
        ),
        notes: notes.filter((n) => n.trim() !== ''),
      }
      const { data } = await createCompanyApi(payload)
      navigate(`/companies/${data.id}`)
    } catch (err) {
      const res = err?.response?.data
      if (res?.details) setErrors(res.details)
      else setApiError(res?.message || 'Failed to create company. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-company">
      <div className="create-company__header">
        <button className="create-company__back" onClick={() => navigate('/companies')}>
          <svg viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Companies
        </button>
        <h1 className="create-company__title">Add Company</h1>
      </div>

      <div className="create-company__card">
        {apiError && <div className="create-company__api-error">{apiError}</div>}

        <form onSubmit={handleSubmit} noValidate>

          <div className="create-company__section-title">Basic info</div>
          <div className="create-company__row">
            <div className="create-company__field">
              <label className="create-company__label">
                Company name <span className="create-company__req">*</span>
              </label>
              <input
                className={`create-company__input ${errors.name ? 'create-company__input--error' : ''}`}
                value={form.name} onChange={set('name')} placeholder="e.g. Tade SA"
              />
              {errors.name && <span className="create-company__field-error">{errors.name}</span>}
            </div>
            <div className="create-company__field">
              <label className="create-company__label">Domain</label>
              <input
                className="create-company__input"
                value={form.domain} onChange={set('domain')} placeholder="e.g. tade.sa"
              />
            </div>
          </div>

          <div className="create-company__row">
            <div className="create-company__field">
              <label className="create-company__label">Website</label>
              <input className="create-company__input" value={form.website} onChange={set('website')} placeholder="https://example.com" />
            </div>
            <div className="create-company__field">
              <label className="create-company__label">Industry</label>
              <select className="create-company__input" value={form.industryId || ''} onChange={set('industryId')}>
                <option value="">Select industry…</option>
                {industries.map((ind) => (
                  <option key={ind.id} value={ind.id}>{ind.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="create-company__row">
            <div className="create-company__field">
              <label className="create-company__label">LinkedIn URL</label>
              <input
                className="create-company__input"
                value={form.linkedinUrl}
                onChange={set('linkedinUrl')}
                placeholder="https://linkedin.com/company/soyolah"
              />
            </div>
            <div className="create-company__field">
              <label className="create-company__label">Lead Source</label>
              <select className="create-company__input" value={form.leadSource} onChange={set('leadSource')}>
                {LEAD_SOURCE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="create-company__row">
            <div className="create-company__field">
              <label className="create-company__label">Country</label>
              <input className="create-company__input" value={form.country} onChange={set('country')} placeholder="e.g. Saudi Arabia" />
            </div>
            <div className="create-company__field">
              <label className="create-company__label">City</label>
              <input className="create-company__input" value={form.city} onChange={set('city')} placeholder="e.g. Riyadh" />
            </div>
          </div>

          <div className="create-company__row">
            <div className="create-company__field">
              <label className="create-company__label">Company size</label>
              <select className="create-company__input" value={form.size} onChange={set('size')}>
                <option value="">Select size…</option>
                {SIZE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="create-company__field">
              <label className="create-company__label">Status</label>
              <select className="create-company__input" value={form.status} onChange={set('status')}>
                {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {/* Notes section */}
          <div className="create-company__section-title" style={{ marginTop: 8 }}>
            Notes
            <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, marginLeft: 8, fontSize: '.75rem', color: 'rgba(13,27,42,.35)' }}>
              — optional
            </span>
          </div>

          <div className="create-company__notes">
            {notes.map((note, i) => (
              <div key={i} className="create-company__note-row">
                <textarea
                  className="create-company__input create-company__textarea"
                  value={note}
                  onChange={(e) => setNote(i, e.target.value)}
                  rows={2}
                  placeholder={`Note ${i + 1}…`}
                />
                <button
                  type="button"
                  className="create-company__note-remove"
                  onClick={() => removeNote(i)}
                >
                  <svg viewBox="0 0 14 14" fill="none">
                    <path d="M2 3.5h10M5 3.5V2.5h4v1M5.5 6v4M8.5 6v4M3 3.5l.75 8h6.5L11 3.5"
                      stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            ))}
            <button type="button" className="create-company__add-platform" onClick={addNote}>
              <svg viewBox="0 0 16 16" fill="none">
                <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Add note
            </button>
          </div>

          {/* ── Platforms ── */}
          <div className="create-company__section-title create-company__section-title--platforms">
            Platforms
            <span className="create-company__req"> * at least one required</span>
          </div>

          <div className="create-company__platforms">
            {platforms.map((pl, i) => (
              <div key={i} className="create-company__platform-row">
                <div className="create-company__platform-header">
                  <span className="create-company__platform-num">Platform {i + 1}</span>
                  {platforms.length > 1 && (
                    <button
                      type="button"
                      className="create-company__platform-remove"
                      onClick={() => removePlatform(i)}
                    >
                      <svg viewBox="0 0 14 14" fill="none">
                        <path d="M2 3.5h10M5 3.5V2.5h4v1M5.5 6v4M8.5 6v4M3 3.5l.75 8h6.5L11 3.5"
                          stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="create-company__row">
                  <div className="create-company__field">
                    <label className="create-company__label">Type <span className="create-company__req">*</span></label>
                    <select
                      className={`create-company__input ${errors[`platform_${i}_type`] ? 'create-company__input--error' : ''}`}
                      value={pl.type} onChange={setPlatform(i, 'type')}
                    >
                      {PLATFORM_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                  <div className="create-company__field">
                    <label className="create-company__label">Name <span className="create-company__req">*</span></label>
                    <input
                      className={`create-company__input ${errors[`platform_${i}_name`] ? 'create-company__input--error' : ''}`}
                      value={pl.name} onChange={setPlatform(i, 'name')}
                      placeholder="e.g. Main Website"
                    />
                    {errors[`platform_${i}_name`] && (
                      <span className="create-company__field-error">{errors[`platform_${i}_name`]}</span>
                    )}
                  </div>
                </div>

                <div className="create-company__row">
                  <div className="create-company__field">
                    <label className="create-company__label">Domain</label>
                    <input className="create-company__input" value={pl.domain}
                      onChange={setPlatform(i, 'domain')} placeholder="e.g. tade.sa" />
                  </div>
                  <div className="create-company__field">
                    <label className="create-company__label">URL</label>
                    <input className="create-company__input" value={pl.url}
                      onChange={setPlatform(i, 'url')} placeholder="https://tade.sa" />
                  </div>
                </div>
              </div>
            ))}

            <button type="button" className="create-company__add-platform" onClick={addPlatform}>
              <svg viewBox="0 0 16 16" fill="none">
                <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Add another platform
            </button>
          </div>

          <div className="create-company__footer">
            <button type="button" className="create-company__btn create-company__btn--ghost"
              onClick={() => navigate('/companies')} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="create-company__btn create-company__btn--primary" disabled={loading}>
              {loading ? 'Creating…' : 'Create Company'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}