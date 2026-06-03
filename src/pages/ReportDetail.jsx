import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getReportApi, deleteReportApi } from '../api/reports'
import ConfirmDialog from '../components/common/ConfirmDialog'
import './styles/ReportDetail.css'

const TYPE_LABELS = {
  TECHNICAL_OVERVIEW: 'Technical Overview',
  SALES_ROADMAP:      'Sales Roadmap',
}

// Simple markdown renderer — handles headers, bold, tables, lists, code, hr
function MarkdownRenderer({ content }) {
  if (!content) return null

  const lines = content.split('\n')
  const elements = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // HR
    if (/^---+$/.test(line.trim())) {
      elements.push(<hr key={i} className="md__hr" />)
      i++; continue
    }

    // H1
    if (line.startsWith('# ')) {
      elements.push(<h1 key={i} className="md__h1">{parseLine(line.slice(2))}</h1>)
      i++; continue
    }

    // H2
    if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="md__h2">{parseLine(line.slice(3))}</h2>)
      i++; continue
    }

    // H3
    if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="md__h3">{parseLine(line.slice(4))}</h3>)
      i++; continue
    }

    // Table
    if (line.startsWith('|')) {
      const tableLines = []
      while (i < lines.length && lines[i].startsWith('|')) {
        tableLines.push(lines[i])
        i++
      }
      elements.push(<MdTable key={`t${i}`} lines={tableLines} />)
      continue
    }

    // Bullet list
    if (line.startsWith('- ')) {
      const items = []
      while (i < lines.length && lines[i].startsWith('- ')) {
        items.push(lines[i].slice(2))
        i++
      }
      elements.push(
        <ul key={`ul${i}`} className="md__ul">
          {items.map((item, j) => <li key={j} className="md__li">{parseLine(item)}</li>)}
        </ul>
      )
      continue
    }

    // Empty line
    if (line.trim() === '') {
      i++; continue
    }

    // Paragraph
    elements.push(<p key={i} className="md__p">{parseLine(line)}</p>)
    i++
  }

  return <div className="md">{elements}</div>
}

function MdTable({ lines }) {
  const rows = lines
    .filter((l) => !l.replace(/[\s|:-]/g, '').trim() === '')
    .map((l) => l.split('|').filter((_, i, a) => i > 0 && i < a.length - 1).map((c) => c.trim()))
  const separator = rows[1]?.every((c) => /^[-:]+$/.test(c))
  const header = rows[0]
  const body   = separator ? rows.slice(2) : rows.slice(1)

  return (
    <div className="md__table-wrap">
      <table className="md__table">
        {header && (
          <thead>
            <tr>{header.map((h, i) => <th key={i}>{parseLine(h)}</th>)}</tr>
          </thead>
        )}
        <tbody>
          {body.map((row, i) => (
            <tr key={i}>{row.map((cell, j) => <td key={j}>{parseLine(cell)}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function parseLine(text) {
  const parts = []
  const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g
  let last = 0, match

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index))
    const val = match[0]
    if (val.startsWith('`'))   parts.push(<code key={match.index} className="md__code">{val.slice(1, -1)}</code>)
    else if (val.startsWith('**')) parts.push(<strong key={match.index}>{val.slice(2, -2)}</strong>)
    else parts.push(<em key={match.index}>{val.slice(1, -1)}</em>)
    last = match.index + val.length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

export default function ReportDetail() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [report,        setReport]        = useState(null)
  const [loading,       setLoading]       = useState(true)
  const [notFound,      setNotFound]      = useState(false)
  const [deleteOpen,    setDeleteOpen]    = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const { data } = await getReportApi(id)
        setReport(data)
      } catch {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      await deleteReportApi(id)
      navigate(`/companies/${report.companyId}/reports`)
    } catch {
      setDeleteLoading(false)
    }
  }

  if (loading) return <div className="report-detail__loading">Loading…</div>
  if (notFound) return <div className="report-detail__loading">Report not found.</div>

  return (
    <div className="report-detail">

      <div className="report-detail__header">
        <button className="report-detail__back"
          onClick={() => navigate(`/companies/${report.companyId}/reports`)}>
          <svg viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Reports
        </button>

        <div className="report-detail__title-row">
          <div className="report-detail__title-left">
            <h1 className="report-detail__title">
              {report.title || TYPE_LABELS[report.type] || report.type}
            </h1>
            <span className={`report-detail__status report-detail__status--${report.status.toLowerCase()}`}>
              {report.status}
            </span>
          </div>
          <div className="report-detail__actions">
            {report.downloadUrl && (
              <a
                href={report.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="report-detail__btn report-detail__btn--primary"
              >
                <svg viewBox="0 0 16 16" fill="none" className="report-detail__btn-icon">
                  <path d="M8 2v8M5 7l3 3 3-3M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Download PDF
              </a>
            )}
            <button
              className="report-detail__btn report-detail__btn--danger"
              onClick={() => setDeleteOpen(true)}
            >
              <svg viewBox="0 0 16 16" fill="none" className="report-detail__btn-icon">
                <path d="M2 4h12M5.5 4V2.5h5V4M6.5 7v5M9.5 7v5M3 4l1 9.5h8L13 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Meta cards */}
      <div className="report-detail__meta-grid">
        <div className="report-detail__meta-card">
          <span className="report-detail__meta-label">Type</span>
          <span className="report-detail__meta-value">{TYPE_LABELS[report.type]}</span>
        </div>
        <div className="report-detail__meta-card">
          <span className="report-detail__meta-label">Company</span>
          <span className="report-detail__meta-value">{report.companyName}</span>
        </div>
        <div className="report-detail__meta-card">
          <span className="report-detail__meta-label">Created</span>
          <span className="report-detail__meta-value">{report.createdAt?.slice(0, 10)}</span>
        </div>
        {report.generatedAt && (
          <div className="report-detail__meta-card">
            <span className="report-detail__meta-label">Generated</span>
            <span className="report-detail__meta-value">{report.generatedAt?.slice(0, 16).replace('T', ' ')}</span>
          </div>
        )}
        {report.aiModel && (
          <div className="report-detail__meta-card">
            <span className="report-detail__meta-label">AI Model</span>
            <span className="report-detail__meta-value">{report.aiModel}</span>
          </div>
        )}
        {report.tokenCount && (
          <div className="report-detail__meta-card">
            <span className="report-detail__meta-label">Tokens</span>
            <span className="report-detail__meta-value">{report.tokenCount.toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* Failed state */}
      {report.status === 'FAILED' && (
        <div className="report-detail__failed">
          <svg viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M10 6v4M10 13h.01" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <div>
            <p className="report-detail__failed-title">Report generation failed</p>
            <p className="report-detail__failed-msg">{report.errorMessage}</p>
          </div>
        </div>
      )}

      {/* Content */}
      {report.content && (
        <div className="report-detail__content-card">
          <MarkdownRenderer content={report.content} />
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteOpen}
        title="Delete report"
        message={`Delete "${report.title || TYPE_LABELS[report.type]}"? This cannot be undone.`}
        confirmLabel="Delete"
        isDanger
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />

    </div>
  )
}