import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'
import CompanyCard from '../components/company/CompanyCard'
import CompanyFilters from '../components/company/CompanyFilters'
import CompanyEmptyState from '../components/company/CompanyEmptyState'
import Pagination from '../components/common/Pagination'
import './styles/Companies.css'

export default function Companies() {
  const navigate = useNavigate()

  const [companies,     setCompanies]     = useState([])
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages,    setTotalPages]    = useState(0)
  const [page,          setPage]          = useState(0)
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState('')
  const [search,        setSearch]        = useState('')
  const [status,        setStatus]        = useState('All')
  const [sort,          setSort]          = useState('createdAt,desc')
  const [industryIds,   setIndustryIds]   = useState([])

  const fetchCompanies = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams()
      params.append('page', page)
      params.append('size', 10)
      params.append('sort', sort)
      if (search) params.append('search', search)
      if (status !== 'All') params.append('status', status)
      industryIds.forEach((id) => params.append('industryIds', id))

      const { data } = await axiosInstance.get(`/companies?${params.toString()}`)
      setCompanies(data.content)
      setTotalPages(data.totalPages)
      setTotalElements(data.totalElements)
    } catch {
      setError('Failed to load companies.')
    } finally {
      setLoading(false)
    }
  }, [page, sort, search, status, industryIds])

  // reset page when filters change
  useEffect(() => {
    setPage(0)
  }, [search, status, sort, industryIds])

  useEffect(() => {
    fetchCompanies()
  }, [fetchCompanies])

  const handlePageChange = (newPage) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSearch     = (val) => setSearch(val)
  const handleStatus     = (val) => setStatus(val)
  const handleSort       = (val) => setSort(val)
  const handleIndustryIds = (ids) => { setIndustryIds(ids); setPage(0) }

  const isFiltered = search.trim() !== '' || status !== 'All' || industryIds.length > 0

  return (
    <div className="companies">

      <div className="companies__header">
        <div className="companies__header-left">
          <h1 className="companies__title">Companies</h1>
          {!loading && <span className="companies__count">{totalElements}</span>}
        </div>
        <button className="companies__add-btn" onClick={() => navigate('/companies/new')}>
          <svg viewBox="0 0 16 16" fill="none" className="companies__add-icon">
            <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Add Company
        </button>
      </div>

      <div className="companies__filters">
        <CompanyFilters
          search={search}
          status={status}
          sort={sort}
          industryIds={industryIds}
          onSearch={handleSearch}
          onStatus={handleStatus}
          onSort={handleSort}
          onIndustryIds={handleIndustryIds}
        />
      </div>

      {error && <div className="companies__error">{error}</div>}

      {loading ? (
        <div className="companies__loading">
          <div className="companies__skeleton-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="companies__skeleton-card"/>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="companies__grid">
            {companies.length === 0 ? (
              <CompanyEmptyState filtered={isFiltered}/>
            ) : (
              companies.map((company, i) => (
                <div key={company.id} style={{ animationDelay: `${i * 0.04}s` }}>
                  <CompanyCard company={company}/>
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              totalElements={totalElements}
              itemLabel="companies"
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

    </div>
  )
}