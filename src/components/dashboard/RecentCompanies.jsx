import './styles/RecentCompanies.css'

const STATUS_COLORS = {
  PROSPECT:    { bg: 'rgba(13,27,42,.07)',   color: 'rgba(13,27,42,.5)' },
  CONTACTED:   { bg: 'rgba(59,130,246,.1)',  color: '#2563eb' },
  QUALIFIED:   { bg: 'rgba(124,58,237,.1)',  color: '#7c3aed' },
  PROPOSAL:    { bg: 'rgba(245,158,11,.1)',  color: '#b45309' },
  CLOSED_WON:  { bg: 'rgba(16,185,129,.1)',  color: '#059669' },
  CLOSED_LOST: { bg: 'rgba(220,38,38,.1)',   color: '#dc2626' },
}

const STATUS_LABELS = {
  PROSPECT: 'Prospect', CONTACTED: 'Contacted', QUALIFIED: 'Qualified',
  PROPOSAL: 'Proposal', CLOSED_WON: 'Won', CLOSED_LOST: 'Lost',
}

export default function RecentCompanies({ companies, loading, onItemClick }) {
  return (
    <div className="dash-companies">
      <div className="dash-companies__header">
        <h2 className="dash-companies__title">Recent Companies</h2>
      </div>

      {loading ? (
        <div className="dash-companies__loading">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="dash-companies__skeleton-row" />
          ))}
        </div>
      ) : companies.length === 0 ? (
        <div className="dash-companies__empty">
          <p>No companies yet</p>
        </div>
      ) : (
        <div className="dash-companies__list">
          {companies.map((c) => {
            const s = STATUS_COLORS[c.status] || STATUS_COLORS.PROSPECT
            return (
              <div
                key={c.id}
                className="dash-companies__item"
                onClick={() => onItemClick(c)}
                role="button" tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onItemClick(c)}
              >
                <div className="dash-companies__item-left">
                  <div className="dash-companies__avatar">
                    {c.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="dash-companies__info">
                    <span className="dash-companies__name">{c.name}</span>
                    <span className="dash-companies__domain">{c.domain || c.website?.replace(/^https?:\/\//, '') || '—'}</span>
                  </div>
                </div>
                <span
                  className="dash-companies__status"
                  style={{ background: s.bg, color: s.color }}
                >
                  {STATUS_LABELS[c.status] || c.status}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}