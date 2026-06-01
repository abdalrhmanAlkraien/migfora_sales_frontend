import { useState } from 'react'
import { validatePipelineApi, createPipelineApi, runPipelineApi } from '../../api/investigations'
import './styles/PipelineBuilder.css'

const TASK_STATUS_MAP = {
  PENDING:  { label: 'Pending',  cls: 'pending' },
  BLOCKED:  { label: 'Blocked',  cls: 'blocked' },
  SKIPPED:  { label: 'Skipped',  cls: 'skipped' },
}

export default function PipelineBuilder({ tasks, investigationId }) {
  const [pipeline,    setPipeline]    = useState([])
  const [pipelineName,setPipelineName]= useState('')
  const [errors,      setErrors]      = useState([])
  const [validating,  setValidating]  = useState(false)
  const [saving,      setSaving]      = useState(false)
  const [running,     setRunning]     = useState(false)
  const [valid,       setValid]       = useState(null)
  const [savedId,     setSavedId]     = useState(null)
  const [runResult,   setRunResult]   = useState(null)
  const [apiError,    setApiError]    = useState('')

  const availableTasks = tasks.filter(
    (t) => !pipeline.find((s) => s.taskType === t.type)
  )

  const addTask = (taskType) => {
    setPipeline((p) => [...p, { taskType, stopOnFailure: false, continueOnCdn: true, notes: '' }])
    setValid(null); setErrors([]); setSavedId(null); setRunResult(null)
  }

  const removeStep = (index) => {
    setPipeline((p) => p.filter((_, i) => i !== index))
    setValid(null); setErrors([]); setSavedId(null); setRunResult(null)
  }

  const toggleField = (index, field) => {
    setPipeline((p) => p.map((s, i) => i === index ? { ...s, [field]: !s[field] } : s))
    setValid(null); setSavedId(null)
  }

  const moveStep = (from, to) => {
    const next = [...pipeline]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    setPipeline(next)
    setValid(null); setErrors([]); setSavedId(null); setRunResult(null)
  }

  const buildSteps = () =>
    pipeline.map((s, i) => ({
      executionOrder: i + 1,
      taskType:       s.taskType,
      stopOnFailure:  s.stopOnFailure,
      continueOnCdn:  s.continueOnCdn,
      notes:          s.notes || null,
    }))

  const handleValidate = async () => {
    if (pipeline.length === 0) return
    setValidating(true); setErrors([]); setValid(null); setApiError('')
    try {
      const { data } = await validatePipelineApi({
        name:  pipelineName || 'Custom Pipeline',
        steps: buildSteps(),
      })
      setValid(data.valid)
      setErrors(data.errors || [])
    } catch {
      setApiError('Validation request failed. Please try again.')
      setValid(false)
    } finally {
      setValidating(false)
    }
  }

  const handleSave = async () => {
    if (!valid || pipeline.length === 0) return
    setSaving(true); setApiError('')
    try {
      const { data } = await createPipelineApi({
        name:  pipelineName || 'Custom Pipeline',
        steps: buildSteps(),
      })
      setSavedId(data.id)
    } catch (err) {
      setApiError(err?.response?.data?.message || 'Failed to save pipeline.')
    } finally {
      setSaving(false)
    }
  }

  const handleRun = async () => {
    if (!savedId) return
    setRunning(true); setApiError(''); setRunResult(null)
    try {
      const { data } = await runPipelineApi(savedId, Number(investigationId))
      setRunResult(data)
    } catch (err) {
      setApiError(err?.response?.data?.message || 'Failed to run pipeline.')
    } finally {
      setRunning(false)
    }
  }

  const getStepError = (index) =>
    errors.find((e) => e.executionOrder === index + 1)

  return (
    <div className="pipeline">
      <div className="pipeline__layout">

        {/* ── Available tasks ── */}
        <div className="pipeline__sidebar">
          <h3 className="pipeline__sidebar-title">Available Tasks</h3>
          <p className="pipeline__sidebar-hint">Click to add to pipeline</p>
          <div className="pipeline__available">
            {availableTasks.length === 0 ? (
              <p className="pipeline__no-tasks">All tasks added</p>
            ) : (
              availableTasks.map((t) => (
                <button
                  key={t.type}
                  className="pipeline__available-task"
                  onClick={() => addTask(t.type)}
                >
                  <span className="pipeline__available-type">{t.type}</span>
                  <span className="pipeline__available-tool">{t.tool}</span>
                  {t.dependsOn && (
                    <span className="pipeline__available-dep">needs {t.dependsOn}</span>
                  )}
                  {t.externalApi && (
                    <span className="pipeline__available-ext">external API</span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* ── Pipeline builder ── */}
        <div className="pipeline__main">

          {/* name input */}
          <div className="pipeline__name-field">
            <input
              className="pipeline__name-input"
              value={pipelineName}
              onChange={(e) => setPipelineName(e.target.value)}
              placeholder="Pipeline name (optional)"
            />
          </div>

          <div className="pipeline__steps-header">
            <h3 className="pipeline__steps-title">
              Steps
              {pipeline.length > 0 && (
                <span className="pipeline__step-count">{pipeline.length}</span>
              )}
            </h3>
            {pipeline.length > 0 && (
              <button
                className="pipeline__validate-btn"
                onClick={handleValidate}
                disabled={validating || saving || running}
              >
                {validating ? 'Validating…' : 'Validate'}
              </button>
            )}
          </div>

          {apiError && (
            <div className="pipeline__api-error">{apiError}</div>
          )}

          {valid === true && errors.length === 0 && (
            <div className="pipeline__valid-msg">✓ Pipeline is valid</div>
          )}

          {valid === false && errors.length > 0 && (
            <div className="pipeline__invalid-msg">
              <div className="pipeline__invalid-icon">
                <svg viewBox="0 0 16 16" fill="none">
                  <path d="M8 1.5L1.5 13.5h13L8 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                  <path d="M8 6v3.5M8 11.5h.01" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="pipeline__invalid-body">
                <span className="pipeline__invalid-title">
                  {errors.length} error{errors.length > 1 ? 's' : ''} found
                </span>
                <span className="pipeline__invalid-sub">
                  Fix the highlighted steps before running the pipeline
                </span>
              </div>
            </div>
          )}

          {pipeline.length === 0 ? (
            <div className="pipeline__empty">
              <svg viewBox="0 0 48 48" fill="none" className="pipeline__empty-icon">
                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M16 24h16M24 16v16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <p>Add tasks from the left to build your pipeline</p>
            </div>
          ) : (
            <div className="pipeline__steps">
              {pipeline.map((step, i) => {
                const stepError = getStepError(i)
                return (
                  <div key={step.taskType}>
                    <div className={`pipeline__step ${stepError ? 'pipeline__step--error' : ''} ${valid === true && !stepError ? 'pipeline__step--valid' : ''}`}>
                      <div className="pipeline__step-order">{i + 1}</div>
                      <div className="pipeline__step-body">
                        <div className="pipeline__step-top">
                          <span className="pipeline__step-type">{step.taskType}</span>
                          <div className="pipeline__step-controls">
                            <label className="pipeline__toggle-label">
                              <input type="checkbox" checked={step.stopOnFailure}
                                onChange={() => toggleField(i, 'stopOnFailure')} />
                              Stop on fail
                            </label>
                            <label className="pipeline__toggle-label">
                              <input type="checkbox" checked={step.continueOnCdn}
                                onChange={() => toggleField(i, 'continueOnCdn')} />
                              Continue on CDN
                            </label>
                            {i > 0 && (
                              <button className="pipeline__move-btn" onClick={() => moveStep(i, i - 1)}>↑</button>
                            )}
                            {i < pipeline.length - 1 && (
                              <button className="pipeline__move-btn" onClick={() => moveStep(i, i + 1)}>↓</button>
                            )}
                            <button className="pipeline__remove-btn" onClick={() => removeStep(i)}>
                              <svg viewBox="0 0 12 12" fill="none">
                                <path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                        {stepError && (
                          <p className="pipeline__step-error-msg">{stepError.error}</p>
                        )}
                      </div>
                    </div>
                    {i < pipeline.length - 1 && (
                      <div className="pipeline__connector">
                        <div className="pipeline__connector-line" />
                        <svg viewBox="0 0 10 6" fill="none" className="pipeline__connector-arrow">
                          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* action buttons — save then run */}
          {pipeline.length > 0 && (
            <div className="pipeline__actions">
              {valid === true && !savedId && (
                <button
                  className="pipeline__save-btn"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Saving…' : 'Save Pipeline'}
                </button>
              )}
              {savedId && (
                <button
                  className="pipeline__run-btn"
                  onClick={handleRun}
                  disabled={running}
                >
                  {running ? (
                    <><span className="pipeline__run-spinner" /> Running…</>
                  ) : (
                    <>
                      Run Pipeline
                      <svg viewBox="0 0 14 14" fill="none">
                        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3"/>
                        <path d="M5.5 5l4 2-4 2V5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                      </svg>
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* run result */}
          {runResult && (
            <div className={`pipeline__run-result pipeline__run-result--${runResult.status.toLowerCase()}`}>
              <div className="pipeline__run-result-header">
                <span className="pipeline__run-result-name">{runResult.pipelineName}</span>
                <span className={`pipeline__run-result-status pipeline__run-result-status--${runResult.status === 'FULLY_QUEUED' ? 'success' : 'partial'}`}>
                  {runResult.status === 'FULLY_QUEUED' ? 'Fully queued' : 'Partially queued'}
                </span>
              </div>
              <div className="pipeline__run-result-steps">
                {runResult.taskResults.map((t) => {
                  const ts = TASK_STATUS_MAP[t.taskStatus] || { label: t.taskStatus, cls: 'pending' }
                  return (
                    <div key={t.executionOrder} className="pipeline__run-result-row">
                      <span className="pipeline__run-result-order">{t.executionOrder}</span>
                      <span className="pipeline__run-result-type">{t.taskType}</span>
                      {t.cdnDetected && (
                        <span className="pipeline__run-result-cdn">CDN: {t.cdnProvider}</span>
                      )}
                      {t.blockedReason && (
                        <span className="pipeline__run-result-blocked">{t.blockedReason}</span>
                      )}
                      <span className={`pipeline__run-result-badge pipeline__run-result-badge--${ts.cls}`}>
                        {ts.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}