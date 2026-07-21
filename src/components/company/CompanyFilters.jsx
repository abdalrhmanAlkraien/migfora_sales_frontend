import { useState, useEffect, useRef } from 'react'
import { getIndustriesApi } from '../../api/industries'
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

export default function CompanyFilters({
  search, status, sort, industryIds,
  onSearch, onStatus, onSort, onIndustryIds,
}) {
  const [industries,     setIndustries]     = useState([])
  const [dropdownOpen,   setDropdownOpen]   = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    getIndustriesApi().then(({ data }) => setIndustries(data)).catch(() => {})
  }, [])

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const toggleIndustry = (id) => {
    const current = industryIds || []
    const updated = current.includes(id)
      ? current.filter((i) => i !== id)
      : [...current, id]
    onIndustryIds(updated)
  }

  const clearIndustries = () => onIndustryIds([])

  const selectedCount = (industryIds || []).length

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
          <button className="company-filters__clear" onClick={() => onSearch('')} aria-label="Clear search">×</button>
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

        {/* Industry multi-select */}
        <div className="company-filters__industry-wrap" ref={dropdownRef}>
          <button
            className={`company-filters__industry-btn ${selectedCount > 0 ? 'company-filters__industry-btn--active' : ''}`}
            onClick={() => setDropdownOpen((p) => !p)}
          >
            <svg viewBox="0 0 14 14" fill="none" className="company-filters__industry-icon">
              <rect x="1.5" y="7" width="3" height="5.5" rx=".5" stroke="currentColor" strokeWidth="1.1"/>
              <rect x="5.5" y="4" width="3" height="8.5" rx=".5" stroke="currentColor" strokeWidth="1.1"/>
              <rect x="9.5" y="1.5" width="3" height="11" rx=".5" stroke="currentColor" strokeWidth="1.1"/>
            </svg>
            Industry
            {selectedCount > 0 && (
              <span className="company-filters__industry-count">{selectedCount}</span>
            )}
            <svg viewBox="0 0 10 6" fill="none" className="company-filters__industry-chevron"
              style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
              <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {dropdownOpen && (
            <div className="company-filters__industry-dropdown">
              <div className="company-filters__industry-dropdown-header">
                <span className="company-filters__industry-dropdown-label">Filter by Industry</span>
                {selectedCount > 0 && (
                  <button className="company-filters__industry-clear" onClick={clearIndustries}>
                    Clear
                  </button>
                )}
              </div>
              <div className="company-filters__industry-list">
                {industries.map((ind) => {
                  const selected = (industryIds || []).includes(ind.id)
                  return (
                    <button
                      key={ind.id}
                      className={`company-filters__industry-item ${selected ? 'company-filters__industry-item--selected' : ''}`}
                      onClick={() => toggleIndustry(ind.id)}
                    >
                      <span className={`company-filters__industry-check ${selected ? 'company-filters__industry-check--on' : ''}`}>
                        {selected && (
                          <svg viewBox="0 0 10 8" fill="none">
                            <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </span>
                      {ind.name}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
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