import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getInvestigationApi, getTasksLookupApi, getInvestigationContextApi } from '../api/investigations'
import LabModeSelector      from '../components/lab/LabModeSelector'
import TaskCard             from '../components/lab/TaskCard'
import PipelineBuilder      from '../components/lab/PipelineBuilder'
import RunAllPanel          from '../components/lab/RunAllPanel'
import InvestigationContext from '../components/lab/InvestigationContext'
import './styles/InvestigationLab.css'

export default function InvestigationLab() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [mode,           setMode]           = useState('one-by-one')
  const [inv,            setInv]            = useState(null)
  const [tasks,          setTasks]          = useState([])
  const [context,        setContext]        = useState(null)
  const [loading,        setLoading]        = useState(true)
  const [contextLoading, setContextLoading] = useState(true)
  const [error,          setError]          = useState('')

  const fetchContext = useCallback(async () => {
    setContextLoading(true)
    try {
      const { data } = await getInvestigationContextApi(id)
      setContext(data)
    } catch {
      // context failure is non-fatal — just show empty state
    } finally {
      setContextLoading(false)
    }
  }, [id])

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      setError('')
      try {
        const [invRes, lookupRes] = await Promise.all([
          getInvestigationApi(id),
          getTasksLookupApi(),
        ])
        const invData = invRes.data
        setInv(invData)

        // merge lookup tasks with actual run status from inv.tasks
        const runMap = (invData.tasks || []).reduce((acc, t) => {
          acc[t.type] = t
          return acc
        }, {})

        const merged = lookupRes.data.map((task) => ({
          ...task,
          runStatus:   runMap[task.type]?.status   || null,
          completedAt: runMap[task.type]?.completedAt || null,
          taskId:      runMap[task.type]?.id        || null,
        }))

        setTasks(merged)
      } catch {
        setError('Failed to load lab. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
    fetchContext()
  }, [id, fetchContext])

  if (loading) return <div className="lab__loading">Loading lab…</div>
  if (error)   return <div className="lab__error">{error}</div>
  return (
    <div className="lab">

      {/* ── Header ── */}
      <div className="lab__header">
        <button className="lab__back" onClick={() => navigate(`/investigations/${id}`)}>
          <svg viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Investigation
        </button>
        <div className="lab__title-row">
          <div className="lab__title-left">
            <div className="lab__domain-badge">
              <svg viewBox="0 0 14 14" fill="none" className="lab__domain-icon">
                <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M7 1.5C7 1.5 5.5 3.5 5.5 7s1.5 5.5 1.5 5.5M7 1.5C7 1.5 8.5 3.5 8.5 7S7 12.5 7 12.5M1.5 7h11" stroke="currentColor" strokeWidth="1.2"/>
              </svg>
              {inv.domain}
            </div>
            {inv.ipAddress && (
              <span className="lab__ip">{inv.ipAddress}</span>
            )}
          </div>
          <span className="lab__company-link" onClick={() => navigate(`/companies/${inv.companyId}`)}>
            {inv.companyName}
          </span>
        </div>
      </div>

      {/* ── Section 1: Investigation Context ── */}
      <InvestigationContext
        context={context}
        tasks={inv?.tasks || []}
        loading={contextLoading}
        onRefresh={fetchContext}
      />

      {/* ── Section 2: Task runner ── */}
      <div className="lab__tasks-section">
        <div className="lab__tasks-header">
          <h3 className="lab__tasks-title">Run Tasks</h3>
        </div>

        <LabModeSelector mode={mode} onChange={setMode} />

        {mode === 'run-all' && (
          <RunAllPanel
            investigationId={id}
            domain={inv.domain}
            tasks={tasks}
            onComplete={fetchContext}
          />
        )}

        {mode === 'one-by-one' && (
          <div className="lab__cards-grid">
            {tasks.map((task) => (
              <TaskCard
                key={task.type}
                task={task}
                investigationId={id}
                mode="manual"
                onComplete={fetchContext}
              />
            ))}
          </div>
        )}

        {mode === 'pipeline' && (
          <PipelineBuilder
            tasks={tasks}
            investigationId={id}
            onComplete={fetchContext}
          />
        )}
      </div>

    </div>
  )
}