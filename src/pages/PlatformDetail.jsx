// src/pages/PlatformDetail.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPlatformApi, updatePlatformApi, deletePlatformApi } from '../api/platforms'
import { getPlatformInvestigationsApi } from '../api/investigations'
import { getPlatformReportsApi } from '../api/reports'
import PlatformEditDrawer from '../components/platform/PlatformEditDrawer'
import CompanyRecentSection from '../components/company/CompanyRecentSection'
import ConfirmDialog from '../components/common/ConfirmDialog'
import useAuthStore from '../store/authStore'
import './styles/PlatformDetail.css'
import SectionDivider from '../components/common/SectionDivider'

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

export default function PlatformDetail() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const user     = useAuthStore((s) => s.user)
  const groups   = user?.['cognito:groups'] || user?.groups || []
  const isAdmin  = groups.includes('admin_group')

  const [platform,       setPlatform]       = useState(null)
  const [investigations, setInvestigations] = useState([])
  const [reports,        setReports]        = useState([])
  const [loading,        setLoading]        = useState(true)
  const [notFound,       setNotFound]       = useState(false)
  const [editOpen,       setEditOpen]       = useState(false)
  const [deleteOpen,     setDeleteOpen]     = useState(false)
  const [deleteLoading,  setDeleteLoading]  = useState(false)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const [platformRes, invRes, repRes] = await Promise.all([
          getPlatformApi(id),
          getPlatformInvestigationsApi(id, { page: 0, size: 3 }),
          getPlatformReportsApi(id, { page: 0, size: 3 }),
        ])
        setPlatform(platformRes.data)
        setInvestigations(invRes.data.content)
        setReports(repRes.data.content)
      } catch (err) {
        if (err?.response?.status === 400 || err?.response?.status === 404) setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  const handleEditSave = async (form) => {
    try {
      const { data } = await updatePlatformApi(id, form)
      setPlatform(data)
      setEditOpen(false)
    } catch (err) { throw err }
  }

  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      await deletePlatformApi(id)
      navigate(`/companies/${platform.companyId}`)
    } catch { setDeleteLoading(false) }
  }

  if (loading)  return <div className="platform-detail__loading">Loading…</div>
  if (notFound) return <div className="platform-detail__loading">Platform not found.</div>

  const t = TYPE_MAP[platform.type] || TYPE_MAP.OTHER

  return (
    <div className="platform-detail">

      <div className="platform-detail__header">
        <button className="platform-detail__back"
          onClick={() => navigate(`/companies/${platform.companyId}`)}>
          <svg viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {platform.companyName}
        </button>

        <div className="platform-detail__title-row">
          <div className="platform-detail__identity">
            <div className="platform-detail__icon" style={{ background: t.bg, color: t.color }}>
              <svg viewBox="0 0 20 20" fill="none">
                <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M2 8h16" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M6 6h.01M8.5 6h.01M11 6h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div className="platform-detail__name-row">
                <h1 className="platform-detail__name">{platform.name}</h1>
                <span className="platform-detail__type-badge" style={{ background: t.bg, color: t.color }}>
                  {t.label}
                </span>
              </div>
              {platform.domain && (
                <span className="platform-detail__domain">{platform.domain}</span>
              )}
            </div>
          </div>

          <div className="platform-detail__actions">
            <button
              className="platform-detail__new-inv-btn"
              onClick={() => navigate(`/platforms/${id}/investigations/new`)}
            >
              <svg viewBox="0 0 16 16" fill="none">
                <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              New Investigation
            </button>
            <button className="platform-detail__btn platform-detail__btn--ghost"
              onClick={() => setEditOpen(true)}>
              <svg viewBox="0 0 16 16" fill="none" className="platform-detail__btn-icon">
                <path d="M2 14h2.5l7.5-7.5-2.5-2.5L2 11.5V14ZM11.5 2l2.5 2.5"
                  stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Edit
            </button>
            {isAdmin && (
              <button className="platform-detail__btn platform-detail__btn--danger"
                onClick={() => setDeleteOpen(true)}>
                <svg viewBox="0 0 16 16" fill="none" className="platform-detail__btn-icon">
                  <path d="M2 4h12M5.5 4V2.5h5V4M6.5 7v5M9.5 7v5M3 4l1 9.5h8L13 4"
                    stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      <SectionDivider label="Platform detail" />

      {/* Info cards */}
      <div className="platform-detail__meta-grid">
        {[
          { label: 'Status',          value: platform.status },
          { label: 'URL',             value: platform.url },
          { label: 'Technology',      value: platform.technology },
          { label: 'Hosting',         value: platform.hostingProvider },
          { label: 'Investigations',  value: platform.investigationsCount ?? 0 },
          { label: 'Reports',         value: platform.reportsCount ?? 0 },
        ].map((f) => (f.value !== undefined && f.value !== null && f.value !== '') && (
          <div key={f.label} className="platform-detail__meta-card">
            <span className="platform-detail__meta-label">{f.label}</span>
            <span className="platform-detail__meta-value">{f.value}</span>
          </div>
        ))}
      </div>

      {platform.notes && (
        <div className="platform-detail__notes-card">
          <p className="platform-detail__notes">{platform.notes}</p>
        </div>
      )}

      {/* Recent sections */}
      <SectionDivider label="Recent Activity" />
      <div className="platform-detail__sections">
        <CompanyRecentSection
          title="Investigations"
          items={investigations}
          total={platform.investigationsCount ?? 0}
          type="investigation"
          showMorePath={`/platforms/${id}/investigations`}
          onItemClick={(item) => navigate(`/investigations/${item.id}`)}
        />
        <CompanyRecentSection
          title="Reports"
          items={reports}
          total={platform.reportsCount ?? 0}
          type="report"
          showMorePath={`/platforms/${id}/reports`}
          onItemClick={(item) => navigate(`/reports/${item.id}`)}
        />
      </div>

      <PlatformEditDrawer
        open={editOpen}
        platform={platform}
        onClose={() => setEditOpen(false)}
        onSave={handleEditSave}
      />

      <ConfirmDialog
        isOpen={deleteOpen}
        title="Delete platform"
        message={`Delete "${platform.name}"? All investigations and reports for this platform will also be removed. This cannot be undone.`}
        confirmLabel="Delete"
        isDanger
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />

    </div>
  )
}