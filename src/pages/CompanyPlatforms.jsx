import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCompanyApi, getCompanyInvestigationsApi, getCompanyReportsApi } from '../api/companies'
import { getCompanyPlatformsApi } from '../api/platforms'
import CompanyRecentSection from '../components/company/CompanyRecentSection'
import SectionDivider from '../components/common/SectionDivider'

import './styles/CompanyPlatforms.css'

const TYPE_MAP = {
  WEBSITE:     { label: 'Website',     color: '#2563eb',  bg: 'rgba(59,130,246,.1)' },
  WEB_APP:     { label: 'Web App',     color: '#7c3aed',  bg: 'rgba(124,58,237,.1)' },
  MOBILE_APP:  { label: 'Mobile App',  color: '#059669',  bg: 'rgba(16,185,129,.1)' },
  API:         { label: 'API',         color: '#b96d00',  bg: 'rgba(255,153,0,.12)' },
  ADMIN_PANEL: { label: 'Admin Panel', color: '#c2410c',  bg: 'rgba(249,115,22,.12)' },
  E_COMMERCE:  { label: 'E-Commerce',  color: '#0d9488',  bg: 'rgba(20,184,166,.1)' },
  PORTAL:      { label: 'Portal',      color: '#4b5563',  bg: 'rgba(107,114,128,.1)' },
  OTHER:       { label: 'Other',       color: '#6b7280',  bg: 'rgba(107,114,128,.08)' },
}

const STATUS_MAP = {
  ACTIVE:            { label: 'Active',         cls: 'active' },
  INACTIVE:          { label: 'Inactive',       cls: 'inactive' },
  UNDER_DEVELOPMENT: { label: 'In Development', cls: 'dev' },
  DECOMMISSIONED:    { label: 'Decommissioned', cls: 'decom' },
}

export default function CompanyPlatforms() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [platforms,      setPlatforms]      = useState([])
  const [company,        setCompany]        = useState(null)
  const [investigations, setInvestigations] = useState([])
  const [reports,        setReports]        = useState([])
  const [loading,        setLoading]        = useState(true)
  const [error,          setError]          = useState('')

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      setError('')
      try {
        const [platformsRes, companyRes, invRes, repRes] = await Promise.all([
          getCompanyPlatformsApi(id),
          getCompanyApi(id),
          getCompanyInvestigationsApi(id, { page: 0, size: 3 }),
          getCompanyReportsApi(id, { page: 0, size: 3 }),
        ])
        setPlatforms(Array.isArray(platformsRes.data) ? platformsRes.data : [])
        setCompany(companyRes.data)
        setInvestigations(invRes.data.content)
        setReports(repRes.data.content)
      } catch {
        setError('Failed to load platforms.')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  return (
    <div className="company-platforms">
      <div className="company-platforms__header">
        <button className="company-platforms__back" onClick={() => navigate(`/companies/${id}`)}>
          <svg viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {company?.name || 'Company'}
        </button>
        <div className="company-platforms__title-row">
          <div className="company-platforms__title-left">
            <h1 className="company-platforms__title">Platforms</h1>
            {!loading && <span className="company-platforms__count">{platforms.length}</span>}
          </div>
          <button
            className="company-platforms__add-btn"
            onClick={() => navigate(`/companies/${id}/platforms/new`)}
          >
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            New Platform
          </button>
        </div>
      </div>

      {error && <div className="company-platforms__error">{error}</div>}

      {loading ? (
        <div className="company-platforms__loading">Loading…</div>
      ) : (
        <>
          {/* Platforms grid */}
        <SectionDivider label="All Platforms" />

          {platforms.length === 0 ? (
            <div className="company-platforms__empty">
              <svg viewBox="0 0 48 48" fill="none" className="company-platforms__empty-icon">
                <rect x="6" y="10" width="36" height="28" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M6 18h36" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M14 14h.01M19 14h.01M24 14h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <h3>No platforms yet</h3>
              <p>Add the digital platforms belonging to this company.</p>
              <button
                className="company-platforms__add-btn"
                onClick={() => navigate(`/companies/${id}/platforms/new`)}
              >
                Add Platform
              </button>
            </div>
          ) : (
            <div className="company-platforms__grid">
              {platforms.map((pl) => {
                const t = TYPE_MAP[pl.type]    || TYPE_MAP.OTHER
                const s = STATUS_MAP[pl.status] || STATUS_MAP.ACTIVE
                return (
                  <div
                    key={pl.id}
                    className="platform-card"
                    onClick={() => navigate(`/platforms/${pl.id}`)}
                    role="button" tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && navigate(`/platforms/${pl.id}`)}
                  >
                    <div className="platform-card__header">
                      <div className="platform-card__icon" style={{ background: t.bg, color: t.color }}>
                        <svg viewBox="0 0 20 20" fill="none">
                          <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.4"/>
                          <path d="M2 8h16" stroke="currentColor" strokeWidth="1.4"/>
                          <path d="M6 6h.01M8.5 6h.01M11 6h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <div className="platform-card__title-group">
                        <span className="platform-card__name">{pl.name}</span>
                        <span className="platform-card__type" style={{ background: t.bg, color: t.color }}>
                          {t.label}
                        </span>
                      </div>
                      <span className={`platform-card__status platform-card__status--${s.cls}`}>
                        {s.label}
                      </span>
                    </div>

                    {(pl.domain || pl.url) && (
                      <div className="platform-card__domain">
                        {pl.domain || pl.url?.replace(/^https?:\/\//, '')}
                      </div>
                    )}

                    {pl.technology && (
                      <div className="platform-card__tech">{pl.technology}</div>
                    )}

                    <div className="platform-card__stats">
                      <div className="platform-card__stat">
                        <span className="platform-card__stat-value">{pl.investigationsCount ?? 0}</span>
                        <span className="platform-card__stat-label">Investigations</span>
                      </div>
                      <div className="platform-card__stat">
                        <span className="platform-card__stat-value">{pl.reportsCount ?? 0}</span>
                        <span className="platform-card__stat-label">Reports</span>
                      </div>
                    </div>

                    <div className="platform-card__arrow">
                      <svg viewBox="0 0 14 14" fill="none">
                        <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Recent sections */}
         <SectionDivider label="Recent Activity" />
          <div className="company-platforms__recent">
            <CompanyRecentSection
              title="Recent Investigations"
              items={investigations}
              total={company?.investigationsCount ?? 0}
              type="investigation"
              showMorePath={`/companies/${id}/investigations`}
              onItemClick={(item) => navigate(`/investigations/${item.id}`)}
            />
            <CompanyRecentSection
              title="Recent Reports"
              items={reports}
              total={company?.reportsCount ?? 0}
              type="report"
              showMorePath={`/companies/${id}/reports`}
              onItemClick={(item) => navigate(`/reports/${item.id}`)}
            />
          </div>
        </>
      )}
    </div>
  )
}