import { useNavigate } from 'react-router-dom'
import './styles/CompanyRecentSection.css'

const INVESTIGATION_STATUS = {
  OPEN:     { label: 'Open',     cls: 'running' },
  CLOSED:   { label: 'Closed',   cls: 'done' },
  ARCHIVED: { label: 'Archived', cls: 'pending' },
}

const CONTACT_STATUS = {
  ACTIVE:   { label: 'Active',   cls: 'done' },
  INACTIVE: { label: 'Inactive', cls: 'pending' },
}

const REPORT_STATUS = {
  PENDING:    { label: 'Pending',    cls: 'pending' },
  GENERATING: { label: 'Generating', cls: 'running' },
  COMPLETED:  { label: 'Completed',  cls: 'done' },
  FAILED:     { label: 'Failed',     cls: 'failed' },
}

function InvestigationRow({ item, onClick }) {
  const s = INVESTIGATION_STATUS[item.status] || { label: item.status, cls: 'pending' }
  return (
    <div className="crs__row" onClick={() => onClick(item)} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(item)}>
      <div className="crs__row-main">
        <span className="crs__row-title">{item.domain || `Investigation #${item.id}`}</span>
        <span className="crs__row-sub">
          {item.completedTasks}/{item.totalTasks} tasks · {item.createdAt?.slice(0, 10)}
        </span>
      </div>
      <span className={`crs__badge crs__badge--${s.cls}`}>{s.label}</span>
    </div>
  )
}

function ContactRow({ item, onClick }) {
  const s = CONTACT_STATUS[item.status] || { label: item.status, cls: 'pending' }
  const initials = item.name?.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || '??'
  return (
    <div className="crs__row" onClick={() => onClick(item)} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(item)}>
      <div className="crs__avatar">{initials}</div>
      <div className="crs__row-main">
        <span className="crs__row-title">{item.name}</span>
        <span className="crs__row-sub">{item.title || '—'}</span>
      </div>
      <span className={`crs__badge crs__badge--${s.cls}`}>{s.label}</span>
    </div>
  )
}

function ReportRow({ item, onClick }) {
  const s = REPORT_STATUS[item.status] || { label: item.status, cls: 'pending' }
  return (
    <div className="crs__row" onClick={() => onClick(item)} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(item)}>
      <div className="crs__row-main">
        <span className="crs__row-title">{item.type} Report #{item.id}</span>
        <span className="crs__row-sub">{item.createdAt?.slice(0, 10)}</span>
      </div>
      <span className={`crs__badge crs__badge--${s.cls}`}>{s.label}</span>
    </div>
  )
}

const ROW_MAP = { investigation: InvestigationRow, contact: ContactRow, report: ReportRow }

export default function CompanyRecentSection({ title, items = [], total, type, showMorePath, onItemClick }) {
  const navigate = useNavigate()
  const RowComponent = ROW_MAP[type] || InvestigationRow

  return (
    <div className="crs">
      <div className="crs__header">
        <h2 className="crs__title">{title}</h2>
        {total > 0 && <span className="crs__count">{total}</span>}
      </div>

      <div className="crs__list">
        {items.length === 0 ? (
          <div className="crs__empty">No {title.toLowerCase()} yet</div>
        ) : (
          items.slice(0, 3).map((item) => (
            <RowComponent key={item.id} item={item} onClick={onItemClick} />
          ))
        )}
      </div>

      <button className="crs__show-more" onClick={() => navigate(showMorePath)}>
        {total > 0 ? `Show all ${total} ${title.toLowerCase()}` : `View ${title.toLowerCase()}`}
        <svg viewBox="0 0 14 14" fill="none" className="crs__show-more-icon">
          <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}