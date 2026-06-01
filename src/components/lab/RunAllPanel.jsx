import { useState } from 'react'
import { runAllTasksApi, getInvestigationApi } from '../../api/investigations'
import './styles/RunAllPanel.css'

export default function RunAllPanel({ investigationId, domain, tasks }) {
  const [options, setOptions] = useState({
    includeShodan:  true,
    includeCensys:  false,
    includeIpInfo:  true,
  })

  const [status,   setStatus]   = useState('idle') // idle | running | done | failed
  const [progress, setProgress] = useState({ total: 0, completed: 0, failed: 0 })
  const [error,    setError]    = useState('')

  const toggle = (key) =>
    setOptions((p) => ({ ...p, [key]: !p[key] }))

  const pollProgress = (taskIds) => {
    const MAX_POLLS = 60
    const INTERVAL  = 3000
    let   count     = 0

    const poll = async () => {
      try {
        const { data } = await getInvestigationApi(investigationId)
        const relevant = data.tasks?.filter((t) => taskIds.includes(t.id)) || []
        const completed = relevant.filter((t) => t.status === 'COMPLETED').length
        const failed    = relevant.filter((t) => t.status === 'FAILED' || t.status === 'BLOCKED').length
        const done      = completed + failed

        setProgress({ total: taskIds.length, completed, failed })

        if (done >= taskIds.length) {
          setStatus('done')
          return
        }

        count++
        if (count < MAX_POLLS) {
          setTimeout(poll, INTERVAL)
        } else {
          setStatus('done') // stop polling, user can check detail
        }
      } catch {
        count++
        if (count < MAX_POLLS) setTimeout(poll, INTERVAL)
      }
    }

    setTimeout(poll, INTERVAL)
  }

  const handleRunAll = async () => {
    setStatus('running')
    setError('')
    setProgress({ total: 0, completed: 0, failed: 0 })
    try {
      const { data } = await runAllTasksApi(investigationId, {
        includeShodan: options.includeShodan,
        includeCensys: options.includeCensys,
        includeIpInfo: options.includeIpInfo,
      })
      const taskIds = data.map((t) => t.id)
      setProgress({ total: taskIds.length, completed: 0, failed: 0 })
      pollProgress(taskIds)
    } catch (err) {
      setStatus('failed')
      setError(err?.response?.data?.message || 'Failed to trigger tasks. Please try again.')
    }
  }

  const progressPct = progress.total > 0
    ? Math.round(((progress.completed + progress.failed) / progress.total) * 100)
    : 0

  const nonExternalTasks = tasks.filter((t) => !t.externalApi)
  const externalTasks    = tasks.filter((t) => t.externalApi)

  return (
    <div className="run-all">

      <div className="run-all__info">
        <div className="run-all__icon">
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M9 8l7 4-7 4V8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <h3 className="run-all__title">Run all tasks</h3>
          <p className="run-all__desc">
            Triggers all tasks as a backend job on <strong>{domain}</strong>.
            The system handles ordering and dependencies automatically.
          </p>
        </div>
      </div>

      {/* included tasks preview */}
      <div className="run-all__section-title">Included tasks</div>
      <div className="run-all__tasks-preview">
        {nonExternalTasks.map((t) => (
          <span key={t.type} className="run-all__task-chip">{t.type}</span>
        ))}
      </div>

      {/* external API toggles */}
      {externalTasks.length > 0 && (
        <>
          <div className="run-all__section-title">
            External APIs
            <span className="run-all__section-hint">may incur costs or rate limits</span>
          </div>
          <div className="run-all__toggles">
            {externalTasks.map((t) => {
              const key = `include${t.type.charAt(0) + t.type.slice(1).toLowerCase()}`
              const optionKey = Object.keys(options).find(
                (k) => k.toLowerCase() === `include${t.type.toLowerCase()}`
              )
              if (!optionKey) return null
              return (
                <label key={t.type} className={`run-all__toggle ${options[optionKey] ? 'run-all__toggle--on' : ''}`}>
                  <div className="run-all__toggle-left">
                    <span className="run-all__toggle-type">{t.type}</span>
                    <span className="run-all__toggle-tool">{t.tool}</span>
                  </div>
                  <div
                    className={`run-all__toggle-switch ${options[optionKey] ? 'run-all__toggle-switch--on' : ''}`}
                    onClick={() => toggle(optionKey)}
                    role="switch"
                    aria-checked={options[optionKey]}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && toggle(optionKey)}
                  >
                    <div className="run-all__toggle-thumb" />
                  </div>
                </label>
              )
            })}
          </div>
        </>
      )}

      {/* progress */}
      {(status === 'running' || status === 'done') && progress.total > 0 && (
        <div className="run-all__progress">
          <div className="run-all__progress-header">
            <span className="run-all__progress-label">
              {status === 'done' ? 'Completed' : 'Running…'}
            </span>
            <span className="run-all__progress-fraction">
              {progress.completed + progress.failed}/{progress.total}
              {progress.failed > 0 && (
                <span className="run-all__progress-failed"> · {progress.failed} failed</span>
              )}
            </span>
          </div>
          <div className="run-all__progress-bar">
            <div
              className={`run-all__progress-fill ${progress.failed > 0 ? 'run-all__progress-fill--mixed' : ''}`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="run-all__error">{error}</div>
      )}

      {status === 'done' && (
        <div className="run-all__success">
          All tasks finished — go to Investigation Detail to view results.
        </div>
      )}

      <div className="run-all__footer">
        <button
          className="run-all__btn"
          onClick={handleRunAll}
          disabled={status === 'running'}
        >
          {status === 'running' && <span className="run-all__spinner" />}
          {status === 'idle'    && 'Trigger All Tasks'}
          {status === 'running' && 'Running…'}
          {status === 'done'    && 'Run Again'}
          {status === 'failed'  && 'Retry'}
        </button>
      </div>

    </div>
  )
}