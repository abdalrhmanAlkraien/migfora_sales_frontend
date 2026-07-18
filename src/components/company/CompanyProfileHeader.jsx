import './styles/CompanyProfileHeader.css'

const STATUS_MAP = {
  PROSPECT:     { label: 'Prospect',    cls: 'prospect' },
  CONTACTED:    { label: 'Contacted',   cls: 'contacted' },
  QUALIFIED:    { label: 'Qualified',   cls: 'qualified' },
  PROPOSAL:     { label: 'Proposal',    cls: 'proposal' },
  CLOSED_WON:   { label: 'Closed Won',  cls: 'won' },
  CLOSED_LOST:  { label: 'Closed Lost', cls: 'lost' },
}

const LEAD_SOURCE_LABELS = {
  LINKEDIN_SEARCH:  'LinkedIn Search',
  LINKEDIN_CONTENT: 'LinkedIn Content',
  PERSONAL_NETWORK: 'Personal Network',
  REFERRAL:         'Referral',
  COLD_EMAIL:       'Cold Email',
  EVENT_CONFERENCE: 'Event / Conference',
  INBOUND_WEBSITE:  'Inbound Website',
  OTHER:            'Other',
}

export default function CompanyProfileHeader({ company, onEdit, onDelete }) {
  const initials = company.name
    .split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()

  const status = STATUS_MAP[company.status] || { label: company.status, cls: 'prospect' }

  return (
    <div className="cph">
      <div className="cph__left">
        <div className="cph__avatar">{initials}</div>
        <div className="cph__info">
          <div className="cph__top-row">
            <h1 className="cph__name">{company.name}</h1>
            <span className={`cph__status cph__status--${status.cls}`}>
              {status.label}
            </span>
          </div>
        <div className="cph__meta-row">
          {company.industry && (
            <span className="cph__meta-item">
              <svg viewBox="0 0 16 16" fill="none" className="cph__meta-icon">
                <rect x="1.5" y="7" width="4" height="7.5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                <rect x="6"   y="4" width="4" height="10.5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                <rect x="10.5" y="1.5" width="4" height="13" rx="1" stroke="currentColor" strokeWidth="1.2"/>
              </svg>
              {company.industry}
            </span>
          )}
          {company.size && (
            <span className="cph__meta-item">
              <svg viewBox="0 0 16 16" fill="none" className="cph__meta-icon">
                <circle cx="8" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M2.5 14c0-3.038 2.462-5.5 5.5-5.5s5.5 2.462 5.5 5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              {company.size}
            </span>
          )}
          {company.country && (
            <span className="cph__meta-item">
              <svg viewBox="0 0 16 16" fill="none" className="cph__meta-icon">
                <path d="M8 1.5A4.5 4.5 0 0 1 12.5 6c0 3-4.5 8.5-4.5 8.5S3.5 9 3.5 6A4.5 4.5 0 0 1 8 1.5Z" stroke="currentColor" strokeWidth="1.2"/>
                <circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
              </svg>
              {company.city ? `${company.city}, ` : ''}{company.country}
            </span>
          )}
          {company.website && (
            <span className="cph__meta-item">
              <svg viewBox="0 0 16 16" fill="none" className="cph__meta-icon">
                <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M8 1.5C8 1.5 6 4 6 8s2 6.5 2 6.5M8 1.5C8 1.5 10 4 10 8s-2 6.5-2 6.5M1.5 8h13" stroke="currentColor" strokeWidth="1.2"/>
              </svg>
              {company.website?.replace(/^https?:\/\//, '')}
            </span>
          )}
        </div>

{/* Second row — badges */}
<div className="cph__badges-row">
  {company.leadSource && (
    <span className="cph__badge cph__badge--source">
      <svg viewBox="0 0 12 12" fill="none" className="cph__badge-icon">
        <path d="M6 1.5L1.5 10.5h9L6 1.5Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/>
      </svg>
      {LEAD_SOURCE_LABELS[company.leadSource] || company.leadSource}
    </span>
  )}
  {company.linkedinUrl && (
    
      <a href={company.linkedinUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="cph__badge cph__badge--linkedin"
    >
      <svg viewBox="0 0 12 12" fill="none" className="cph__badge-icon">
        <rect x="1" y="1" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.1"/>
        <path d="M3.5 5v3.5M3.5 3.5v.01M6 8.5V6.5c0-.8.7-1.5 1.5-1.5S9 5.7 9 6.5v2M6 5v3.5"
          stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
      </svg>
      LinkedIn Profile
    </a>
  )}
</div>
          {company.notes && (
            <p className="cph__notes">{company.notes}</p>
          )}
        </div>
      </div>

      <div className="cph__actions">
        {company.website && (
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="cph__action-btn cph__action-btn--ghost"
          >
            <svg viewBox="0 0 16 16" fill="none" className="cph__btn-icon">
              <path d="M6.5 3H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V9.5M9.5 2H14v4.5M14 2l-7 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Visit
          </a>
        )}
        <button className="cph__action-btn cph__action-btn--ghost" onClick={onEdit}>
          <svg viewBox="0 0 16 16" fill="none" className="cph__btn-icon">
            <path d="M2 14h2.5l7.5-7.5-2.5-2.5L2 11.5V14ZM11.5 2l2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Edit
        </button>
        <button className="cph__action-btn cph__action-btn--danger" onClick={onDelete}>
          <svg viewBox="0 0 16 16" fill="none" className="cph__btn-icon">
            <path d="M2 4h12M5.5 4V2.5h5V4M6.5 7v5M9.5 7v5M3 4l1 9.5h8L13 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Delete
        </button>
      </div>
    </div>
  )
}