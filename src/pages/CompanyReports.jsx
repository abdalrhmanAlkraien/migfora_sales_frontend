import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCompanyReportsApi, deleteReportApi } from '../api/reports'
import ConfirmDialog from '../components/common/ConfirmDialog'
import Pagination    from '../components/common/Pagination'
import './styles/CompanyReports.css'

const STATUS_MAP = {
  GENERATING: { label: 'Generating', cls: 'generating' },
  COMPLETED:  { label: 'Completed',  cls: 'completed' },
  FAILED:     { label: 'Failed',     cls: 'failed' },
  PENDING:    { label: 'Pending',    cls: 'pending' },
}

const TYPE_LABELS = {
  TECHNICAL_OVERVIEW: 'Technical Overview',
  SALES_ROADMAP:      'Sales Roadmap',
}

export default function CompanyReports() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [reports,       setReports]       = useState([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState('')
  const [page,          setPage]          = useState(0)
  const [totalPages,    setTotalPages]    = useState(1)
  const [totalElements, setTotalElements] = useState(0)
  const [deleteTarget,  setDeleteTarget]  = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      setError('')
      try {
        const { data } = await getCompanyReportsApi(id, { page, size: 20 })
        setReports(data.content)
        setTotalElements(data.totalElements)
        setTotalPages(data.totalPages)
      } catch {
        setError('Failed to load reports.')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id, page])

  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      await deleteReportApi(deleteTarget.id)
      setReports((p) => p.filter((r) => r.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch {
      // handle error
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="company-reports">
      <div className="company-reports__header">
        <button className="company-reports__back" onClick={() => navigate(`/companies/${id}`)}>
          <svg viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Company
        </button>
        <div className="company-reports__title-row">
          <div className="company-reports__title-left">
            <h1 className="company-reports__title">Reports</h1>
            {!loading && <span className="company-reports__count">{totalElements}</span>}
          </div>
        </div>
      </div>

      {error && <div className="company-reports__error">{error}</div>}

      {loading ? (
        <div className="company-reports__loading">Loading…</div>
      ) : reports.length === 0 ? (
        <div className="company-reports__empty">
          <svg viewBox="0 0 48 48" fill="none" className="company-reports__empty-icon">
            <rect x="8" y="4" width="32" height="40" rx="3" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M16 14h16M16 20h16M16 26h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <p>No reports yet</p>
          <span>Generate a report from an investigation to see it here.</span>
        </div>
      ) : (
        <>
          <div className="company-reports__list">
            {reports.map((report) => {
              const s = STATUS_MAP[report.status] || { label: report.status, cls: 'pending' }
              return (
                <div key={report.id} className="company-reports__row">
                  <div className="company-reports__row-left">
                    <div className="company-reports__row-icon">
                      <svg viewBox="0 0 16 16" fill="none">
                        <rect x="2.5" y="1.5" width="11" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                        <path d="M5.5 5.5h5M5.5 8h5M5.5 10.5h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div className="company-reports__row-info">
                      <div className="company-reports__row-top">
                        <span className="company-reports__row-title">
                          {report.title || TYPE_LABELS[report.type] || report.type}
                        </span>
                        <span className={`company-reports__status company-reports__status--${s.cls}`}>
                          {s.label}
                        </span>
                      </div>
                      <div className="company-reports__row-meta">
                        <span>{TYPE_LABELS[report.type]}</span>
                        <span>·</span>
                        <span>Investigation #{report.investigationId}</span>
                        <span>·</span>
                        <span>{report.createdAt?.slice(0, 10)}</span>
                        {report.aiProvider && (
                          <>
                            <span>·</span>
                            <span>{report.aiProvider}</span>
                          </>
                        )}
                      </div>
                      {report.status === 'FAILED' && report.errorMessage && (
                        <p className="company-reports__error-msg">{report.errorMessage}</p>
                      )}
                    </div>
                  </div>

                  <div className="company-reports__row-actions">
                    {report.status === 'COMPLETED' && (
                      <>
                        <button
                          className="company-reports__action-btn"
                          onClick={() => navigate(`/reports/${report.id}`)}
                        >
                          View
                        </button>
                        {report.downloadUrl && (
                          <a
                            href={report.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="company-reports__action-btn company-reports__action-btn--download"
                          >
                            <svg viewBox="0 0 14 14" fill="none">
                              <path d="M7 2v7M4.5 6.5L7 9l2.5-2.5M2 11h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            PDF
                          </a>
                        )}
                      </>
                    )}
                    <button
                      className="company-reports__action-btn company-reports__action-btn--delete"
                      onClick={() => setDeleteTarget(report)}
                    >
                      <svg viewBox="0 0 14 14" fill="none">
                        <path d="M2 3.5h10M5 3.5V2.5h4v1M5.5 6v4M8.5 6v4M3 3.5l.75 8h6.5L11 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            totalElements={totalElements}
            itemLabel="reports"
            onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          />
        </>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete report"
        message={`Delete "${deleteTarget?.title || TYPE_LABELS[deleteTarget?.type]}"? This cannot be undone.`}
        confirmLabel="Delete"
        isDanger
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}