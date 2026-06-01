import { useState } from 'react'
import { checkTaskApi, runTasksApi, getTaskResultApi } from '../../api/investigations'
import './styles/TaskCard.css'

const STATUS_MAP = {
  IDLE:      { label: 'Not run',   cls: 'idle' },
  PENDING:   { label: 'Pending',   cls: 'pending' },
  RUNNING:   { label: 'Running',   cls: 'running' },
  COMPLETED: { label: 'Completed', cls: 'completed' },
  FAILED:    { label: 'Failed',    cls: 'failed' },
  BLOCKED:   { label: 'Blocked',   cls: 'blocked' },
}

export default function TaskCard({ task, investigationId, mode }) {
  const [status,      setStatus]      = useState('IDLE')
  const [expanded,    setExpanded]    = useState(false)
  const [result,      setResult]      = useState(null)
  const [checkResult, setCheckResult] = useState(null)
  const [checking,    setChecking]    = useState(false)
  const [checkError,  setCheckError]  = useState('')
  const [taskId,      setTaskId]      = useState(null)

  const s = STATUS_MAP[status] || STATUS_MAP.IDLE

  const handleCheck = async () => {
    setChecking(true)
    setCheckError('')
    setCheckResult(null)
    try {
      const { data } = await checkTaskApi(investigationId, task.type)
      setCheckResult(data)
    } catch {
      setCheckError('Failed to check task status. Please try again.')
    } finally {
      setChecking(false)
    }
  }

    const pollResult = async (createdTaskId) => {
    const MAX_POLLS = 30
    const INTERVAL  = 3000
    let   count     = 0

    const poll = async () => {
        try {
        const { data } = await getTaskResultApi(investigationId, createdTaskId)

        setStatus(data.status)

        if (data.status === 'COMPLETED') {
      // ... existing ...
      
    }
    if (data.status === 'FAILED') {
      // ... existing ...
      if (onComplete) onComplete() // ← refresh context even on failure
      return
    }
        if (data.status === 'COMPLETED') {
            let parsed = data.result
            if (parsed && typeof parsed === 'string') {
            try { parsed = JSON.parse(parsed) } catch { /* keep as string */ }
            }
            setResult(parsed || data.rawOutput || 'No result data.')
            setExpanded(true)
            if (onComplete) onComplete()
            return
        }

        if (data.status === 'FAILED') {
            setResult(data.errorMessage || 'Task failed with no error message.')
            setExpanded(true)
            if (onComplete) onComplete()
            return
        }

        if (data.status === 'BLOCKED') {
            setResult(data.errorMessage || 'Task blocked by dependency.')
            return
        }

        // still PENDING or RUNNING — keep polling
        count++
        if (count < MAX_POLLS) {
            setTimeout(poll, INTERVAL)
        } else {
            setStatus('FAILED')
            setResult('Task timed out — check Investigation Detail for status.')
        }
        } catch {
        count++
        if (count < MAX_POLLS) setTimeout(poll, INTERVAL)
        }
    }

    setTimeout(poll, INTERVAL)
    }

  const handleRun = async () => {
    setStatus('PENDING')
    setResult(null)
    setExpanded(false)
    try {
      const { data } = await runTasksApi(investigationId, [task.type])
      const created  = data[0]

      if (created.status === 'BLOCKED') {
        setStatus('BLOCKED')
        setResult(created.errorMessage || 'Task blocked by dependency.')
        return
      }

      setTaskId(created.id)
      setStatus('RUNNING')
      pollResult(created.id)
    } catch (err) {
      setStatus('FAILED')
      setResult(err?.response?.data?.message || 'Failed to start task.')
    }
  }

  const canRun     = checkResult?.canRun ?? null
  const cdnWarning = checkResult?.cdnWarning ?? false
  const reason     = checkResult?.reason ?? ''

  return (
    <div className={`task-card task-card--${s.cls}`}>

      <div className="task-card__header">
        <div className="task-card__left">
          <span className={`task-card__dot task-card__dot--${s.cls}`} />
          <div className="task-card__info">
            <span className="task-card__type">{task.type}</span>
            <span className="task-card__tool">{task.tool}</span>
          </div>
        </div>
        <div className="task-card__right">
          {task.externalApi && (
            <span className="task-card__ext-badge">external</span>
          )}
          <span className={`task-card__badge task-card__badge--${s.cls}`}>
            {s.label}
          </span>
          {(status === 'COMPLETED' || status === 'FAILED') && (
            <button
              className="task-card__expand"
              onClick={() => setExpanded((p) => !p)}
              aria-label={expanded ? 'Collapse' : 'Expand'}
            >
              <svg viewBox="0 0 12 12" fill="none"
                style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      <p className="task-card__desc">{task.description}</p>

      {task.dependsOn && checkResult === null && status === 'IDLE' && (
        <div className="task-card__dep-hint">
          <svg viewBox="0 0 12 12" fill="none" className="task-card__dep-icon">
            <path d="M6 1v6M3 4l3-3 3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M1 9h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          Depends on {task.dependsOn}
        </div>
      )}

      {checkError && (
        <div className="task-card__check-error">{checkError}</div>
      )}

      {cdnWarning && (
        <div className="task-card__cdn-warning">
          <svg viewBox="0 0 14 14" fill="none" className="task-card__cdn-icon">
            <path d="M7 1.5L1.5 11.5h11L7 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
            <path d="M7 6v2.5M7 10h.01" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <span>
            <strong>{checkResult.cdnProvider}</strong> CDN detected —
            results may reflect CDN infrastructure, not origin server
          </span>
        </div>
      )}

      {canRun === false && (
        <div className="task-card__blocked-msg">
          <svg viewBox="0 0 14 14" fill="none" className="task-card__blocked-icon">
            <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M4.5 4.5l5 5M9.5 4.5l-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          {reason}
        </div>
      )}

      {canRun === true && !cdnWarning && status === 'IDLE' && (
        <div className="task-card__ready">
          <svg viewBox="0 0 14 14" fill="none" className="task-card__ready-icon">
            <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M4.5 7l2 2 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {checkResult.resolvedIp
            ? `Ready — resolved to ${checkResult.resolvedIp}`
            : 'Ready to run'
          }
        </div>
      )}

      {status === 'BLOCKED' && result && (
        <div className="task-card__blocked-msg">
          <svg viewBox="0 0 14 14" fill="none" className="task-card__blocked-icon">
            <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M4.5 4.5l5 5M9.5 4.5l-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          {result}
        </div>
      )}

      {mode === 'manual' && (
        <div className="task-card__actions">
          {status === 'IDLE' && canRun === null && (
            <button
              className="task-card__btn task-card__btn--check"
              onClick={handleCheck}
              disabled={checking}
            >
              {checking
                ? <><span className="task-card__btn-spinner" /> Checking…</>
                : 'Check & Run'
              }
            </button>
          )}
          {status === 'IDLE' && canRun === true && (
            <button
              className="task-card__btn task-card__btn--run"
              onClick={handleRun}
            >
              Run {task.type}
            </button>
          )}
          {status === 'IDLE' && canRun === false && (
            <button
              className="task-card__btn task-card__btn--recheck"
              onClick={handleCheck}
              disabled={checking}
            >
              {checking ? 'Checking…' : 'Re-check'}
            </button>
          )}
          {(status === 'PENDING' || status === 'RUNNING') && (
            <div className="task-card__running-indicator">
              <span className="task-card__spinner" />
              {status === 'PENDING' ? 'Queued…' : 'Running…'}
            </div>
          )}
          {(status === 'COMPLETED' || status === 'FAILED') && (
            <button
              className="task-card__btn task-card__btn--recheck"
              onClick={() => {
                setStatus('IDLE')
                setCheckResult(null)
                setResult(null)
                setExpanded(false)
                setTaskId(null)
              }}
            >
              Run again
            </button>
          )}
        </div>
      )}

      {expanded && result && (
        <div className="task-card__result">
          {typeof result === 'object' ? (
            <div className="task-card__result-kv">
              {Object.entries(result).map(([k, v]) => (
                <div key={k} className="task-card__result-row">
                  <span className="task-card__result-key">{k}</span>
                  <span className="task-card__result-val">
                    {Array.isArray(v) ? v.join(', ') : String(v)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <pre className="task-card__result-pre">{String(result)}</pre>
          )}
        </div>
      )}

    </div>
  )
}