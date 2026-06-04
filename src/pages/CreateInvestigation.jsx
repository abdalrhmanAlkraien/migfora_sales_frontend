import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { createInvestigationApi } from '../api/investigations'
import { getPlatformApi } from '../api/platforms'
import './styles/CreateInvestigation.css'

export default function CreateInvestigation() {
  const { id }   = useParams() // platformId
  const navigate = useNavigate()

  const [platform, setPlatform] = useState(null)
  const [domain,   setDomain]   = useState('')
  const [loading,  setLoading]  = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error,    setError]    = useState('')

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getPlatformApi(id)
        setPlatform(data)
        setDomain(data.domain || '')
      } catch {
        setError('Failed to load platform.')
      } finally {
        setFetching(false)
      }
    }
    fetch()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = { platformId: Number(id) }
      if (domain.trim()) payload.domain = domain.trim()
      const { data } = await createInvestigationApi(payload)
      navigate(`/investigations/${data.id}`)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create investigation.')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <div className="create-inv__loading">Loading…</div>

  return (
    <div className="create-inv">
      <div className="create-inv__header">
        <button className="create-inv__back" onClick={() => navigate(`/platforms/${id}`)}>
          <svg viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {platform?.name || 'Platform'}
        </button>
        <h1 className="create-inv__title">New Investigation</h1>
      </div>

      <div className="create-inv__card">
        {error && <div className="create-inv__error">{error}</div>}

        <div className="create-inv__platform-info">
          <div className="create-inv__platform-label">Platform</div>
          <div className="create-inv__platform-name">{platform?.name}</div>
          {platform?.type && (
            <div className="create-inv__platform-type">{platform.type}</div>
          )}
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="create-inv__field">
            <label className="create-inv__label">
              Domain
              <span className="create-inv__hint"> — leave blank to use platform domain</span>
            </label>
            <input
              className="create-inv__input"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder={platform?.domain || 'e.g. tade.sa'}
            />
          </div>

          <div className="create-inv__footer">
            <button type="button" className="create-inv__btn create-inv__btn--ghost"
              onClick={() => navigate(`/platforms/${id}`)} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="create-inv__btn create-inv__btn--primary" disabled={loading}>
              {loading ? 'Creating…' : 'Start Investigation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}