import { useNavigate } from 'react-router-dom'
import './styles/CompanyEmptyState.css'

export default function CompanyEmptyState({ filtered }) {
  const navigate = useNavigate()

  return (
    <div className="company-empty">
      <div className="company-empty__icon">
        <svg viewBox="0 0 48 48" fill="none">
          <rect x="8" y="14" width="32" height="26" rx="3" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M16 14V11a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M24 24v6M21 27h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      {filtered ? (
        <>
          <h3 className="company-empty__title">No companies match your filters</h3>
          <p className="company-empty__desc">Try adjusting your search or status filter.</p>
        </>
      ) : (
        <>
          <h3 className="company-empty__title">No companies yet</h3>
          <p className="company-empty__desc">Add your first prospect to start building your pipeline.</p>
          <button className="company-empty__btn" onClick={() => navigate('/companies/new')}>
            Add Company
          </button>
        </>
      )}
    </div>
  )
}