import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getInvestigationApi } from '../api/investigations'
import TaskResultDrawer from '../components/investigation/TaskResultDrawer'
import GenerateReportModal from '../components/report/GenerateReportModal'
import './styles/InvestigationDetail.css'

const STATUS_MAP = {
  OPEN:     { label: 'Open',     cls: 'open' },
  CLOSED:   { label: 'Closed',   cls: 'closed' },
  ARCHIVED: { label: 'Archived', cls: 'archived' },
}

const TASK_STATUS_MAP = {
  COMPLETED: { label: 'Completed', cls: 'completed' },
  FAILED:    { label: 'Failed',    cls: 'failed' },
  PENDING:   { label: 'Pending',   cls: 'pending' },
  RUNNING:   { label: 'Running',   cls: 'running' },
}

export default function InvestigationDetail() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [inv,          setInv]          = useState(null)
  const [loading,      setLoading]      = useState(true)
  const [notFound,     setNotFound]     = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [drawerOpen,   setDrawerOpen]   = useState(false)
  const [reportModalOpen, setReportModalOpen] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const { data } = await getInvestigationApi(id)
        setInv(data)
      } catch (err) {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  const openResult = (task) => {
    // parse result string if it's JSON
    const parsed = { ...task }
    if (task.result && typeof task.result === 'string') {
      try {
        parsed.result = JSON.parse(task.result)
      } catch {
        parsed.result = task.result // keep as raw string if not JSON
      }
    }
    setSelectedTask(parsed)
    setDrawerOpen(true)
  }

  if (loading) return <div className="inv-detail__loading">Loading…</div>

  if (notFound) return (
    <div className="inv-detail__loading">
      Investigation not found.{' '}
      <button
        onClick={() => navigate(-1)}
        style={{ color: 'var(--color-orange)', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        Go back
      </button>
    </div>
  )

  const status   = STATUS_MAP[inv.status] || { label: inv.status, cls: 'open' }
  const tasks    = inv.tasks || []
  const completed = tasks.filter((t) => t.status === 'COMPLETED').length
  const failed    = tasks.filter((t) => t.status === 'FAILED').length
  const progress  = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0

  return (
    <div className="inv-detail">

      <div className="inv-detail__header">
        <button className="inv-detail__back"
          onClick={() => navigate(`/companies/${inv.companyId}/investigations`)}>
          <svg viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {inv.companyName}
        </button>

        <div className="inv-detail__title-row">
          <div className="inv-detail__title-left">
            <h1 className="inv-detail__domain">{inv.domain}</h1>
            <span className={`inv-detail__status inv-detail__status--${status.cls}`}>
              {status.label}
            </span>
          </div>
          <div className="inv-detail__actions">
            <button
              className="inv-detail__btn inv-detail__btn--ghost"
              onClick={() => navigate(`/investigations/${id}/lab`)}
            >
              <svg viewBox="0 0 16 16" fill="none" className="inv-detail__btn-icon">
                <path d="M6 2h4M8 2v3.5M5 5.5h6l1.5 8H3.5L5 5.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Open Lab
            </button>
            <button
              className="inv-detail__btn inv-detail__btn--primary"
              onClick={() => setReportModalOpen(true)}
            >
              <svg viewBox="0 0 16 16" fill="none" className="inv-detail__btn-icon">
                <rect x="2.5" y="1.5" width="11" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M5.5 5.5h5M5.5 8h5M5.5 10.5h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              Generate Report
            </button>
          </div>
        </div>
      </div>

      <div className="inv-detail__meta-grid">
        <div className="inv-detail__meta-card">
          <span className="inv-detail__meta-label">IP Address</span>
          <span className="inv-detail__meta-value">{inv.ipAddress || '—'}</span>
        </div>
        <div className="inv-detail__meta-card">
          <span className="inv-detail__meta-label">Triggered by</span>
          <span className="inv-detail__meta-value">{inv.triggeredBy}</span>
        </div>
        <div className="inv-detail__meta-card">
          <span className="inv-detail__meta-label">Created</span>
          <span className="inv-detail__meta-value">{inv.createdAt?.slice(0, 10)}</span>
        </div>
        <div className="inv-detail__meta-card">
          <span className="inv-detail__meta-label">Last updated</span>
          <span className="inv-detail__meta-value">{inv.updatedAt?.slice(0, 10)}</span>
        </div>
      </div>

      <div className="inv-detail__progress-card">
        <div className="inv-detail__progress-header">
          <span className="inv-detail__progress-title">Task Progress</span>
          <span className="inv-detail__progress-fraction">
            {completed}/{tasks.length} completed
            {failed > 0 && (
              <span className="inv-detail__progress-failed"> · {failed} failed</span>
            )}
          </span>
        </div>
        <div className="inv-detail__progress-bar">
          <div className="inv-detail__progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="inv-detail__progress-pct">{progress}%</span>
      </div>

      <div className="inv-detail__tasks-card">
        <div className="inv-detail__tasks-header">
          <h2 className="inv-detail__tasks-title">Tasks</h2>
          <button
            className="inv-detail__btn inv-detail__btn--sm inv-detail__btn--ghost"
            onClick={() => navigate(`/investigations/${id}/lab`)}
          >
            Run more tasks in Lab →
          </button>
        </div>

        <div className="inv-detail__tasks-list">
          {tasks.length === 0 ? (
            <div className="inv-detail__tasks-empty">
              No tasks yet — open the Lab to run tasks.
            </div>
          ) : (
            tasks.map((task) => {
              const ts = TASK_STATUS_MAP[task.status] || { label: task.status, cls: 'pending' }
              return (
                <div key={task.id} className="inv-detail__task-row">
                  <div className="inv-detail__task-left">
                    <span className={`inv-detail__task-dot inv-detail__task-dot--${ts.cls}`} />
                    <span className="inv-detail__task-type">{task.type}</span>
                  </div>
                  <div className="inv-detail__task-right">
                    {task.completedAt && (
                      <span className="inv-detail__task-time">
                        {task.completedAt.slice(0, 16).replace('T', ' ')}
                      </span>
                    )}
                    <span className={`inv-detail__task-badge inv-detail__task-badge--${ts.cls}`}>
                      {ts.label}
                    </span>
                    {task.status === 'COMPLETED' && (
                      <button
                        className="inv-detail__task-view"
                        onClick={() => openResult(task)}
                      >
                        View result
                      </button>
                    )}
                    {task.status === 'FAILED' && task.errorMessage && (
                      <button
                        className="inv-detail__task-view inv-detail__task-view--error"
                        onClick={() => openResult(task)}
                      >
                        View error
                      </button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      <GenerateReportModal
        open={reportModalOpen}
        investigationId={id}
        platformId={inv?.platformId}
        onClose={() => setReportModalOpen(false)}
        onComplete={() => setReportModalOpen(false)}
      />

      <TaskResultDrawer
        open={drawerOpen}
        task={selectedTask}
        onClose={() => setDrawerOpen(false)}
      />

    </div>
  )
}