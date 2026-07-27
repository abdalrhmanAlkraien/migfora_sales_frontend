import { useNavigate } from 'react-router-dom'
import './styles/CompanyCard.css'

const STATUS_LABELS = {
  PROSPECT:    'Prospect',
  CONTACTED:   'Contacted',
  QUALIFIED:   'Qualified',
  PROPOSAL:    'Proposal',
  CLOSED_WON:  'Won',
  CLOSED_LOST: 'Lost',
}

export default function CompanyCard({ company }) {
  const navigate = useNavigate()

  const initials = company.name
    ? company.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : '??'

  return (
    <div
      className="company-card"
      onClick={() => navigate(`/companies/${company.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/companies/${company.id}`)}
    >
      <div className="company-card__header">
        <div className="company-card__avatar">{initials}</div>
        <div className="company-card__meta">
          <h3 className="company-card__name">{company.name}</h3>
          <span className="company-card__domain">{company.domain || '—'}</span>
        </div>
        <div className="company-card__header-right">
          <span className={`company-card__status company-card__status--${(company.status || 'prospect').toLowerCase()}`}>
            {STATUS_LABELS[company.status] || company.status}
          </span>
          {company.linkedinUrl && (
            
              <a href={company.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="company-card__linkedin"
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
        </div>
      </div>

      <div className="company-card__divider"/>

      <div className="company-card__stats">
        <div className="company-card__stat">
          <span className="company-card__stat-value">{company.investigationsCount ?? 0}</span>
          <span className="company-card__stat-label">Investigations</span>
        </div>
        <div className="company-card__stat">
          <span className="company-card__stat-value">{company.contactsCount ?? 0}</span>
          <span className="company-card__stat-label">Contacts</span>
        </div>
        <div className="company-card__stat">
          <span className="company-card__stat-value">{company.reportsCount ?? 0}</span>
          <span className="company-card__stat-label">Reports</span>
        </div>
      </div>

      {company.industryName && (
        <div className="company-card__footer">
          <span className="company-card__industry">{company.industryName}</span>
        </div>
      )}
    </div>
  )
}