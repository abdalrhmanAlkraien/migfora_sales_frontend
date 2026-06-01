import './styles/Pagination.css'

export default function Pagination({ page, totalPages, totalElements, itemLabel = 'items', onPageChange }) {
  return (
    <div className="pagination">
      <span className="pagination__info">
        {totalElements} {itemLabel} — Page {page + 1} of {totalPages || 1}
      </span>
      <div className="pagination__controls">
        <button disabled={page === 0} onClick={() => onPageChange(page - 1)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <button disabled={page + 1 >= totalPages} onClick={() => onPageChange(page + 1)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>
    </div>
  )
}