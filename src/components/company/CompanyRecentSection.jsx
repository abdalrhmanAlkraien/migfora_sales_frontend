import { useNavigate } from 'react-router-dom'
import './styles/CompanyRecentSection.css'

const INVESTIGATION_STATUS = {
  OPEN:     { label: 'Open',     cls: 'running' },
  CLOSED:   { label: 'Closed',   cls: 'done' },
  ARCHIVED: { label: 'Archived', cls: 'pending' },
}

const CONTACT_STATUS = {
  NEW:           { label: 'New',          cls: 'pending' },
  CONTACTED:     { label: 'Contacted',    cls: 'running' },
  INTERESTED:    { label: 'Interested',   cls: 'running' },
  MEETING_SET:   { label: 'Meeting Set',  cls: 'running' },
  PROPOSAL_SENT: { label: 'Proposal',     cls: 'running' },
  NEGOTIATING:   { label: 'Negotiating',  cls: 'running' },
  WON:           { label: 'Won',          cls: 'done' },
  LOST:          { label: 'Lost',         cls: 'failed' },
  ON_HOLD:       { label: 'On Hold',      cls: 'pending' },
}

const REPORT_STATUS = {
  PENDING:    { label: 'Pending',    cls: 'pending' },
  GENERATING: { label: 'Generating', cls: 'running' },
  COMPLETED:  { label: 'Completed',  cls: 'done' },
  FAILED:     { label: 'Failed',     cls: 'failed' },
}

const PLATFORM_STATUS = {
  ACTIVE:            { label: 'Active',         cls: 'done' },
  INACTIVE:          { label: 'Inactive',       cls: 'pending' },
  UNDER_DEVELOPMENT: { label: 'In Development', cls: 'running' },
  DECOMMISSIONED:    { label: 'Decommissioned', cls: 'failed' },
}

const PLATFORM_TYPE_LABELS = {
  WEBSITE:     'Website',
  WEB_APP:     'Web App',
  MOBILE_APP:  'Mobile App',
  API:         'API',
  ADMIN_PANEL: 'Admin Panel',
  E_COMMERCE:  'E-Commerce',
  PORTAL:      'Portal',
  OTHER:       'Other',
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

function PlatformRow({ item, onClick }) {
  const s = PLATFORM_STATUS[item.status] || PLATFORM_STATUS.ACTIVE
  return (
    <div className="crs__row" onClick={() => onClick(item)} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(item)}>
      <div className="crs__row-main">
        <span className="crs__row-title">{item.name}</span>
        <span className="crs__row-sub">
          {PLATFORM_TYPE_LABELS[item.type] || item.type}
          {item.domain ? ` · ${item.domain}` : ''}
          {item.investigationsCount !== undefined ? ` · ${item.investigationsCount} investigations` : ''}
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
      <div className="crs__row-actions">
        {item.linkedIn && (
          
            <a href={item.linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="crs__linkedin"
            onClick={(e) => e.stopPropagation()}
            title="LinkedIn Profile"
          >
            <svg viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="14" height="14" rx="3" fill="#0a66c2"/>
              <path d="M4.5 6.5v5M4.5 4.5v.01M7.5 11.5V8.5c0-1.1 1-2 2-2s2 .9 2 2v3M7.5 6.5v5"
                stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </a>
        )}
        <span className={`crs__badge crs__badge--${s.cls}`}>{s.label}</span>
      </div>
    </div>
  )
}

function ReportRow({ item, onClick }) {
  const s = REPORT_STATUS[item.status] || { label: item.status, cls: 'pending' }
  const TYPE_LABELS = { TECHNICAL_OVERVIEW: 'Technical Overview', SALES_ROADMAP: 'Sales Roadmap' }
  return (
    <div className="crs__row" onClick={() => onClick(item)} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(item)}>
      <div className="crs__row-main">
        <span className="crs__row-title">
          {item.title || TYPE_LABELS[item.type] || `Report #${item.id}`}
        </span>
        <span className="crs__row-sub">
          {item.platformName ? `${item.platformName} · ` : ''}{item.createdAt?.slice(0, 10)}
        </span>
      </div>
      <span className={`crs__badge crs__badge--${s.cls}`}>{s.label}</span>
    </div>
  )
}

const ROW_MAP = {
  investigation: InvestigationRow,
  platform:      PlatformRow,
  contact:       ContactRow,
  report:        ReportRow,
}

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