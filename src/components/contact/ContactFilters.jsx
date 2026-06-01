import './styles/ContactFilters.css'

const STATUSES = [
  'All','NEW','CONTACTED','INTERESTED','MEETING_SET',
  'PROPOSAL_SENT','NEGOTIATING','WON','LOST','ON_HOLD'
]
const STATUS_LABELS = {
  All: 'All', NEW: 'New', CONTACTED: 'Contacted', INTERESTED: 'Interested',
  MEETING_SET: 'Meeting Set', PROPOSAL_SENT: 'Proposal', NEGOTIATING: 'Negotiating',
  WON: 'Won', LOST: 'Lost', ON_HOLD: 'On Hold',
}

export default function ContactFilters({ search, status, onSearch, onStatus }) {
  return (
    <div className="contact-filters">
      <div className="contact-filters__search-wrap">
        <svg className="contact-filters__search-icon" viewBox="0 0 20 20" fill="none">
          <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M13 13l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <input
          className="contact-filters__search"
          type="text"
          placeholder="Search contacts…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
        {search && (
          <button className="contact-filters__clear" onClick={() => onSearch('')}>×</button>
        )}
      </div>
      <div className="contact-filters__statuses">
        {STATUSES.map((s) => (
          <button
            key={s}
            className={`contact-filters__status-btn ${status === s ? 'contact-filters__status-btn--active' : ''}`}
            onClick={() => onStatus(s)}
          >
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>
    </div>
  )
}