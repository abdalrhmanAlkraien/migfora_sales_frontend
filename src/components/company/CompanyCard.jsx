import { useNavigate } from 'react-router-dom'
import './styles/CompanyCard.css'

const STATUS_LABELS = {
  All:         'All',
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
        <div className="company-card__avatar">
          {initials}
        </div>
        <div className="company-card__meta">
          <h3 className="company-card__name">{company.name}</h3>
          <span className="company-card__domain">{company.domain || '—'}</span>
        </div>
        <span className={`company-card__status company-card__status--${(company.status || 'lead').toLowerCase()}`}>
          {STATUS_LABELS[company.status] || company.status}
        </span>
      </div>

      <div className="company-card__divider" />

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

      {company.industry && (
        <div className="company-card__footer">
          <span className="company-card__industry">{company.industry}</span>
        </div>
      )}
    </div>
  )
}