import './styles/CompanyFilters.css'

const STATUSES = ['All', 'PROSPECT', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'CLOSED_WON', 'CLOSED_LOST']

const STATUS_LABELS = {
  All:         'All',
  PROSPECT:    'Prospect',
  CONTACTED:   'Contacted',
  QUALIFIED:   'Qualified',
  PROPOSAL:    'Proposal',
  CLOSED_WON:  'Won',
  CLOSED_LOST: 'Lost',
}

const SORT_OPTIONS = [
  { value: 'createdAt,desc', label: 'Recently Added' },
  { value: 'name,asc',       label: 'Name A–Z' },
  { value: 'name,desc',      label: 'Name Z–A' },
]

export default function CompanyFilters({ search, status, sort, onSearch, onStatus, onSort }) {
  return (
    <div className="company-filters">

      <div className="company-filters__search-wrap">
        <svg className="company-filters__search-icon" viewBox="0 0 20 20" fill="none">
          <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M13 13l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <input
          className="company-filters__search"
          type="text"
          placeholder="Search companies or domains…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
        {search && (
          <button className="company-filters__clear" onClick={() => onSearch('')} aria-label="Clear search">
            ×
          </button>
        )}
      </div>

      <div className="company-filters__right">
        <div className="company-filters__status-group">
          {STATUSES.map((s) => (
            <button
              key={s}
              className={`company-filters__status-btn ${status === s ? 'company-filters__status-btn--active' : ''}`}
              onClick={() => onStatus(s)}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>

        <select
          className="company-filters__sort"
          value={sort}
          onChange={(e) => onSort(e.target.value)}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

    </div>
  )
}