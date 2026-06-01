import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCompanyApi } from '../api/companies'
import { createInvestigationApi } from '../api/investigations'
import './styles/CreateInvestigation.css'

export default function CreateInvestigation() {
  const { id }   = useParams() // companyId
  const navigate = useNavigate()

  const [domain,      setDomain]      = useState('')
  const [companyName, setCompanyName] = useState('')
  const [loading,     setLoading]     = useState(false)
  const [fetching,    setFetching]    = useState(true)
  const [error,       setError]       = useState('')

  // pre-fill domain from company
  useEffect(() => {
    const fetch = async () => {
      setFetching(true)
      try {
        const { data } = await getCompanyApi(id)
        setDomain(data.domain || '')
        setCompanyName(data.name)
      } catch {
        setError('Failed to load company details.')
      } finally {
        setFetching(false)
      }
    }
    fetch()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!domain.trim()) { setError('Domain is required.'); return }
    setLoading(true)
    setError('')
    try {
      const { data } = await createInvestigationApi({
        companyId: Number(id),
        domain: domain.trim(),
      })
      navigate(`/investigations/${data.id}/lab`)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create investigation.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-inv">
      <div className="create-inv__header">
        <button className="create-inv__back"
          onClick={() => navigate(`/companies/${id}/investigations`)}>
          <svg viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {companyName || 'Investigations'}
        </button>
        <h1 className="create-inv__title">New Investigation</h1>
        <p className="create-inv__subtitle">Start a new recon session for this company</p>
      </div>

      <div className="create-inv__card">
        {error && <div className="create-inv__error">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="create-inv__field">
            <label className="create-inv__label">
              Domain <span className="create-inv__req">*</span>
            </label>
            <div className="create-inv__domain-wrap">
              <svg viewBox="0 0 16 16" fill="none" className="create-inv__domain-icon">
                <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M8 1.5C8 1.5 6 4 6 8s2 6.5 2 6.5M8 1.5C8 1.5 10 4 10 8s-2 6.5-2 6.5M1.5 8h13" stroke="currentColor" strokeWidth="1.2"/>
              </svg>
              <input
                className="create-inv__input create-inv__input--domain"
                value={fetching ? 'Loading…' : domain}
                onChange={(e) => { setDomain(e.target.value); setError('') }}
                placeholder="e.g. tade.sa"
                disabled={fetching}
              />
            </div>
            <p className="create-inv__hint">Pre-filled from company. You can override it.</p>
          </div>

          <div className="create-inv__info-box">
            <svg viewBox="0 0 16 16" fill="none" className="create-inv__info-icon">
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M8 7v4M8 5h.01" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            <p>After creating the investigation you'll be taken directly to the Lab where you can run tasks.</p>
          </div>

          <div className="create-inv__footer">
            <button
              type="button"
              className="create-inv__btn create-inv__btn--ghost"
              onClick={() => navigate(`/companies/${id}/investigations`)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="create-inv__btn create-inv__btn--primary"
              disabled={loading || fetching}
            >
              {loading ? 'Creating…' : 'Create & Open Lab'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}