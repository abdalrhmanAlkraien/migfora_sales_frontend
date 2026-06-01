import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  getCompanyApi,
  updateCompanyApi,
  deleteCompanyApi,
  getCompanyInvestigationsApi,
  getCompanyContactsApi,
  getCompanyReportsApi,
} from '../api/companies'
import CompanyProfileHeader from '../components/company/CompanyProfileHeader'
import CompanyStatsBar      from '../components/company/CompanyStatsBar'
import CompanyRecentSection from '../components/company/CompanyRecentSection'
import CompanyEditDrawer    from '../components/company/CompanyEditDrawer'
import ConfirmDialog        from '../components/common/ConfirmDialog'
import './styles/CompanyProfile.css'

export default function CompanyProfile() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [company,       setCompany]       = useState(null)
  const [loading,       setLoading]       = useState(true)
  const [notFound,      setNotFound]      = useState(false)

  const [investigations, setInvestigations] = useState([])
  const [contacts,       setContacts]       = useState([])
  const [reports,        setReports]        = useState([])

  const [editOpen,      setEditOpen]      = useState(false)
  const [deleteOpen,    setDeleteOpen]    = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError,   setDeleteError]   = useState('')

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      try {
        // fetch company + all 3 recent sections in parallel
        const [
          companyRes,
          investigationsRes,
          contactsRes,
          reportsRes,
        ] = await Promise.all([
          getCompanyApi(id),
          getCompanyInvestigationsApi(id, { page: 0, size: 3 }),
          getCompanyContactsApi(id,       { page: 0, size: 3 }),
          getCompanyReportsApi(id,         { page: 0, size: 3 }),
        ])

        setCompany(companyRes.data)
        setInvestigations(investigationsRes.data.content)
        setContacts(contactsRes.data.content)
        setReports(reportsRes.data.content)

      } catch (err) {
        if (err?.response?.status === 400 || err?.response?.status === 404) {
          setNotFound(true)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [id])

  const handleEditSave = async (form) => {
    try {
      const { data } = await updateCompanyApi(id, form)
      setCompany(data)
      setEditOpen(false)
    } catch (err) {
      throw err
    }
  }

  const handleDelete = async () => {
    setDeleteLoading(true)
    setDeleteError('')
    try {
      await deleteCompanyApi(id)
      navigate('/companies')
    } catch (err) {
      const status  = err?.response?.status
      const message = err?.response?.data?.message
      setDeleteError(
        status === 403
          ? "You don't have permission to delete this company."
          : message || 'Failed to delete company. Please try again.'
      )
      setDeleteLoading(false)
    }
  }

  if (loading) return <div className="company-profile__loading">Loading…</div>

  if (notFound) return (
    <div className="company-profile__loading">
      Company not found.{' '}
      <button
        onClick={() => navigate('/companies')}
        style={{ color: 'var(--color-orange)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
      >
        Back to Companies
      </button>
    </div>
  )

  return (
    <div className="company-profile">

      <CompanyProfileHeader
        company={company}
        onEdit={() => setEditOpen(true)}
        onDelete={() => { setDeleteError(''); setDeleteOpen(true) }}
      />

      <CompanyStatsBar
        investigations={company.investigationsCount ?? 0}
        contacts={company.contactsCount ?? 0}
        reports={company.reportsCount ?? 0}
      />

      <div className="company-profile__sections">
        <CompanyRecentSection
          title="Investigations"
          items={investigations}
          total={company.investigationsCount ?? 0}
          type="investigation"
          showMorePath={`/companies/${id}/investigations`}  // ← this must be here
          onItemClick={(item) => navigate(`/investigations/${item.id}`)}
        />
        <CompanyRecentSection
          title="Contacts"
          items={contacts}
          total={company.contactsCount ?? 0}
          type="contact"
          showMorePath={`/companies/${id}/contacts`}
          onItemClick={(item) => navigate(`/companies/${id}/contacts/${item.id}`)}
        />
        <CompanyRecentSection
          title="Reports"
          items={reports}
          total={company.reportsCount ?? 0}
          type="report"
          showMorePath={`/companies/${id}/reports`}
          onItemClick={(item) => navigate(`/reports/${item.id}`)}
        />
      </div>

      <CompanyEditDrawer
        open={editOpen}
        company={company}
        onClose={() => setEditOpen(false)}
        onSave={handleEditSave}
      />

      <ConfirmDialog
        isOpen={deleteOpen}
        title="Delete company"
        message={
          deleteError ||
          `Are you sure you want to delete "${company.name}"? This will also remove all associated investigations, contacts and reports. This action cannot be undone.`
        }
        confirmLabel="Delete"
        isDanger={true}
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />

    </div>
  )
}