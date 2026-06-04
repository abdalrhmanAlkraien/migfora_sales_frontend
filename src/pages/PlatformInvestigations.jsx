import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPlatformInvestigationsApi } from '../api/investigations'
import { getPlatformApi } from '../api/platforms'
import Pagination from '../components/common/Pagination'
import './styles/CompanyInvestigations.css'

const STATUS_MAP = {
  OPEN:     { label: 'Open',     cls: 'open' },
  CLOSED:   { label: 'Closed',   cls: 'closed' },
  ARCHIVED: { label: 'Archived', cls: 'archived' },
}

export default function PlatformInvestigations() {
  const { id }   = useParams() // platformId
  const navigate = useNavigate()

  const [investigations, setInvestigations] = useState([])
  const [platform,       setPlatform]       = useState(null)
  const [loading,        setLoading]        = useState(true)
  const [error,          setError]          = useState('')
  const [page,           setPage]           = useState(0)
  const [totalPages,     setTotalPages]     = useState(1)
  const [totalElements,  setTotalElements]  = useState(0)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      setError('')
      try {
        const [invRes, platformRes] = await Promise.all([
          getPlatformInvestigationsApi(id, { page, size: 20 }),
          getPlatformApi(id),
        ])
        setInvestigations(invRes.data.content)
        setTotalElements(invRes.data.totalElements)
        setTotalPages(invRes.data.totalPages)
        setPlatform(platformRes.data)
      } catch {
        setError('Failed to load investigations. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id, page])

  return (
    <div className="comp-inv">
      <div className="comp-inv__header">
        <button className="comp-inv__back" onClick={() => navigate(`/platforms/${id}`)}>
          <svg viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {platform?.name || 'Platform'}
        </button>
        <div className="comp-inv__title-row">
          <div className="comp-inv__title-left">
            <h1 className="comp-inv__title">Investigations</h1>
            {!loading && <span className="comp-inv__count">{totalElements}</span>}
          </div>
          <button
            className="comp-inv__new-btn"
            onClick={() => navigate(`/platforms/${id}/investigations/new`)}
          >
            <svg viewBox="0 0 16 16" fill="none" className="comp-inv__new-icon">
              <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            New Investigation
          </button>
        </div>
      </div>

      {error && <div className="comp-inv__error">{error}</div>}

      {loading ? (
        <div className="comp-inv__loading">Loading…</div>
      ) : investigations.length === 0 ? (
        <div className="comp-inv__empty">
          <svg viewBox="0 0 48 48" fill="none" className="comp-inv__empty-icon">
            <circle cx="20" cy="20" r="13" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M30 30l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <h3>No investigations yet</h3>
          <p>Start a new investigation for this platform.</p>
          <button
            className="comp-inv__new-btn"
            onClick={() => navigate(`/platforms/${id}/investigations/new`)}
          >
            New Investigation
          </button>
        </div>
      ) : (
        <>
          <div className="comp-inv__list">
            {investigations.map((inv) => {
              const s = STATUS_MAP[inv.status] || { label: inv.status, cls: 'open' }
              const progress = inv.totalTasks > 0
                ? Math.round((inv.completedTasks / inv.totalTasks) * 100)
                : 0
              return (
                <div
                  key={inv.id}
                  className="comp-inv__row"
                  onClick={() => navigate(`/investigations/${inv.id}`)}
                  role="button" tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(`/investigations/${inv.id}`)}
                >
                  <div className="comp-inv__row-left">
                    <div className="comp-inv__row-top">
                      <span className="comp-inv__domain">{inv.domain}</span>
                      <span className={`comp-inv__status comp-inv__status--${s.cls}`}>{s.label}</span>
                    </div>
                    <div className="comp-inv__row-meta">
                      {inv.ipAddress && <span className="comp-inv__meta-item">{inv.ipAddress}</span>}
                      <span className="comp-inv__meta-item">{inv.createdAt?.slice(0, 10)}</span>
                      {inv.failedTasks > 0 && (
                        <span className="comp-inv__meta-item comp-inv__meta-item--failed">
                          {inv.failedTasks} failed
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="comp-inv__row-right">
                    <div className="comp-inv__progress-wrap">
                      <div className="comp-inv__progress-bar">
                        <div className="comp-inv__progress-fill" style={{ width: `${progress}%` }}/>
                      </div>
                      <span className="comp-inv__progress-label">
                        {inv.completedTasks}/{inv.totalTasks}
                      </span>
                    </div>
                    <div className="comp-inv__row-actions">
                      <button
                        className="comp-inv__action-btn"
                        onClick={(e) => { e.stopPropagation(); navigate(`/investigations/${inv.id}/lab`) }}
                      >
                        Open Lab
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            totalElements={totalElements}
            itemLabel="investigations"
            onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          />
        </>
      )}
    </div>
  )
}