import { useState } from 'react'
import { createPortal } from 'react-dom'
import { createReportApi } from '../../api/reports'
import { getReportApi } from '../../api/reports'
import './styles/GenerateReportModal.css'

const REPORT_TYPES = [
  {
    value: 'TECHNICAL_OVERVIEW',
    label: 'Technical Overview',
    desc: 'Full infrastructure analysis — stack, security, performance, subdomains',
    icon: (
      <svg viewBox="0 0 20 20" fill="none">
        <rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M7 6h6M7 9h6M7 12h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    value: 'SALES_ROADMAP',
    label: 'Sales Roadmap',
    desc: 'Sales-focused intel — pain points, opportunities, recommended approach',
    icon: (
      <svg viewBox="0 0 20 20" fill="none">
        <path d="M3 14l4-4 3 3 4-5 3 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="17" cy="10" r="1.5" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    ),
  },
]

const STATUS_MAP = {
  GENERATING: { label: 'Generating…', cls: 'generating' },
  COMPLETED:  { label: 'Completed',   cls: 'completed' },
  FAILED:     { label: 'Failed',      cls: 'failed' },
}

export default function GenerateReportModal({ open, investigationId, companyId, platformId, onClose, onComplete }) {
  const [selectedType, setSelectedType] = useState('TECHNICAL_OVERVIEW')
  const [phase,        setPhase]        = useState('select') // select | generating | done | failed
  const [reportId,     setReportId]     = useState(null)
  const [report,       setReport]       = useState(null)
  const [error,        setError]        = useState('')
  const [loading,      setLoading]      = useState(false)

  const reset = () => {
    setPhase('select')
    setReportId(null)
    setReport(null)
    setError('')
    setLoading(false)
    setSelectedType('TECHNICAL_OVERVIEW')
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const pollReport = (id) => {
    const MAX   = 60
    const DELAY = 5000
    let   count = 0
    let   stopped = false

    const poll = async () => {
      if (stopped) return
      try {
        const { data } = await getReportApi(id)
        if (data.status === 'COMPLETED') {
          stopped = true
          setReport(data)
          setPhase('done')
          if (onComplete) onComplete()
          return
        }
        if (data.status === 'FAILED') {
          stopped = true
          setError(data.errorMessage || 'Report generation failed.')
          setPhase('failed')
          return
        }
        count++
        if (count < MAX) setTimeout(poll, DELAY)
        else { stopped = true; setError('Timed out — check Reports page for status.'); setPhase('failed') }
      } catch {
        count++
        if (!stopped && count < MAX) setTimeout(poll, DELAY)
      }
    }
    setTimeout(poll, DELAY)
  }

  const handleGenerate = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await createReportApi({
        platformId:     Number(platformId),
        investigationId: Number(investigationId),
        type:          selectedType,
      })
      setReportId(data.id)
      setPhase('generating')
      pollReport(data.id)
    }catch (err) {
      console.log('full error:', err)
      console.log('response:', err?.response)
      console.log('response data:', err?.response?.data)
      setError(err?.response?.data?.message || err?.message || 'Failed to start report generation.')
      setPhase('failed')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return createPortal(
    <div className="grm__backdrop" role="dialog" aria-modal="true">
      <div className="grm__box">

        {/* Header */}
        <div className="grm__header">
          <h2 className="grm__title">
            {phase === 'select'     && 'Generate Report'}
            {phase === 'generating' && 'Generating Report'}
            {phase === 'done'       && 'Report Ready'}
            {phase === 'failed'     && 'Generation Failed'}
          </h2>
          <button className="grm__close" onClick={handleClose} aria-label="Close">
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Select phase */}
        {phase === 'select' && (
          <>
            <div className="grm__body">
              <p className="grm__subtitle">Choose the type of report to generate from this investigation.</p>
              <div className="grm__types">
                {REPORT_TYPES.map((t) => (
                  <button
                    key={t.value}
                    className={`grm__type ${selectedType === t.value ? 'grm__type--active' : ''}`}
                    onClick={() => setSelectedType(t.value)}
                  >
                    <div className="grm__type-icon">{t.icon}</div>
                    <div className="grm__type-text">
                      <span className="grm__type-label">{t.label}</span>
                      <span className="grm__type-desc">{t.desc}</span>
                    </div>
                    <div className={`grm__type-check ${selectedType === t.value ? 'grm__type-check--on' : ''}`} />
                  </button>
                ))}
              </div>
              <div className="grm__info">
                <svg viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M7 5h.01M7 7v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                Report generation takes 2–3 minutes. You can close this modal and check the Reports page.
              </div>
              {error && <div className="grm__error">{error}</div>}
            </div>
            <div className="grm__footer">
              <button className="grm__btn grm__btn--ghost" onClick={handleClose}>Cancel</button>
              <button className="grm__btn grm__btn--primary" onClick={handleGenerate} disabled={loading}>
                {loading ? 'Starting…' : 'Generate Report'}
              </button>
            </div>
          </>
        )}

        {/* Generating phase */}
        {phase === 'generating' && (
          <div className="grm__body grm__body--center">
            <div className="grm__spinner-wrap">
              <div className="grm__spinner" />
            </div>
            <h3 className="grm__status-title">AI is analyzing the investigation data…</h3>
            <p className="grm__status-desc">
              Generating <strong>{REPORT_TYPES.find(t => t.value === selectedType)?.label}</strong>.
              This takes 2–3 minutes.
            </p>
            <div className="grm__progress-dots">
              <span /><span /><span />
            </div>
            <button className="grm__btn grm__btn--ghost" style={{ marginTop: 24 }} onClick={handleClose}>
              Close — I'll check later
            </button>
          </div>
        )}

        {/* Done phase */}
        {phase === 'done' && report && (
          <div className="grm__body grm__body--center">
            <div className="grm__success-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="grm__status-title">Report Ready</h3>
            {report.title && <p className="grm__status-desc">{report.title}</p>}
            <div className="grm__footer" style={{ marginTop: 24 }}>
              <button className="grm__btn grm__btn--ghost" onClick={handleClose}>Close</button>
              {report.downloadUrl && (
                <a
                  href={report.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grm__btn grm__btn--primary"
                >
                  <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }}>
                    <path d="M8 2v8M5 7l3 3 3-3M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Download PDF
                </a>
              )}
            </div>
          </div>
        )}

        {/* Failed phase */}
        {phase === 'failed' && (
          <div className="grm__body grm__body--center">
            <div className="grm__failed-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="grm__status-title">Generation Failed</h3>
            <p className="grm__status-desc">{error}</p>
            <div className="grm__footer" style={{ marginTop: 24 }}>
              <button className="grm__btn grm__btn--ghost" onClick={handleClose}>Close</button>
              <button className="grm__btn grm__btn--primary" onClick={() => { setPhase('select'); setError('') }}>
                Try Again
              </button>
            </div>
          </div>
        )}

      </div>
    </div>,
    document.body
  )
}