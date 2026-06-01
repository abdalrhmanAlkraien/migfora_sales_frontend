import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCompanyContactsApi, updateContactStatusApi } from '../api/contacts'
import ContactFilters from '../components/contact/ContactFilters'
import ContactsTable  from '../components/contact/ContactsTable'
import Pagination     from '../components/common/Pagination'
import './styles/CompanyContacts.css'

export default function CompanyContacts() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [contacts,      setContacts]      = useState([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState('')
  const [search,        setSearch]        = useState('')
  const [statusFilter,  setStatusFilter]  = useState('All')
  const [page,          setPage]          = useState(0)
  const [totalPages,    setTotalPages]    = useState(1)
  const [totalElements, setTotalElements] = useState(0)

  const fetchContacts = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = { page, size: 20 }
      if (search.trim())        params.search = search.trim()
      if (statusFilter !== 'All') params.status = statusFilter
      const { data } = await getCompanyContactsApi(id, params)
      setContacts(data.content)
      setTotalElements(data.totalElements)
      setTotalPages(data.totalPages)
    } catch {
      setError('Failed to load contacts. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [id, page, search, statusFilter])

  useEffect(() => { setPage(0) }, [search, statusFilter])
  useEffect(() => { fetchContacts() }, [fetchContacts])

  const handleStatusChange = async (contactId, newStatus) => {
    // optimistic update
    setContacts((prev) =>
      prev.map((c) => c.id === contactId ? { ...c, status: newStatus } : c)
    )
    try {
      await updateContactStatusApi(contactId, newStatus)
    } catch {
      // revert on failure
      fetchContacts()
    }
  }

  return (
    <div className="company-contacts">
      <div className="company-contacts__header">
        <button className="company-contacts__back" onClick={() => navigate(`/companies/${id}`)}>
          <svg viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Company
        </button>
        <div className="company-contacts__title-row">
          <div className="company-contacts__title-left">
            <h1 className="company-contacts__title">Contacts</h1>
            {!loading && <span className="company-contacts__count">{totalElements}</span>}
          </div>
          <button
            className="company-contacts__add-btn"
            onClick={() => navigate(`/companies/${id}/contacts/new`)}
          >
            <svg viewBox="0 0 16 16" fill="none" className="company-contacts__add-icon">
              <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            New Contact
          </button>
        </div>
      </div>

      {error && <div className="company-contacts__error">{error}</div>}

      <ContactFilters
        search={search}
        status={statusFilter}
        onSearch={setSearch}
        onStatus={setStatusFilter}
      />

      {loading ? (
        <div className="company-contacts__loading">Loading…</div>
      ) : (
        <>
          <ContactsTable
            contacts={contacts}
            onRowClick={(c) => navigate(`/contacts/${c.id}`)}
            onStatusChange={handleStatusChange}
          />
          <Pagination
            page={page}
            totalPages={totalPages}
            totalElements={totalElements}
            itemLabel="contacts"
            onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          />
        </>
      )}
    </div>
  )
}