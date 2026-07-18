import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  getCompanyApi,
  updateCompanyApi,
  deleteCompanyApi,
  getCompanyContactsApi,
  getCompanyReportsApi,
} from '../api/companies'
import { getCompanyPlatformsApi } from '../api/platforms'
import CompanyProfileHeader from '../components/company/CompanyProfileHeader'
import CompanyStatsBar      from '../components/company/CompanyStatsBar'
import CompanyRecentSection from '../components/company/CompanyRecentSection'
import CompanyEditDrawer    from '../components/company/CompanyEditDrawer'
import ConfirmDialog        from '../components/common/ConfirmDialog'
import './styles/CompanyProfile.css'
import SectionDivider from '../components/common/SectionDivider'
import CompanyNotes from '../components/company/CompanyNotes'

export default function CompanyProfile() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [company,       setCompany]       = useState(null)
  const [loading,       setLoading]       = useState(true)
  const [notFound,      setNotFound]      = useState(false)
  const [platforms,     setPlatforms]     = useState([])
  const [contacts,      setContacts]      = useState([])
  const [reports,       setReports]       = useState([])
  const [editOpen,      setEditOpen]      = useState(false)
  const [deleteOpen,    setDeleteOpen]    = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError,   setDeleteError]   = useState('')

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      try {
        const [companyRes, platformsRes, contactsRes, reportsRes] = await Promise.all([
          getCompanyApi(id),
          getCompanyPlatformsApi(id),
          getCompanyContactsApi(id, { page: 0, size: 3 }),
          getCompanyReportsApi(id,   { page: 0, size: 3 }),
        ])
        setCompany(companyRes.data)
        // platforms returns array directly (not paginated)
        setPlatforms(Array.isArray(platformsRes.data) ? platformsRes.data.slice(0, 3) : [])
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

  if (loading)  return <div className="company-profile__loading">Loading…</div>
  if (notFound) return (
    <div className="company-profile__loading">
      Company not found.{' '}
      <button
        onClick={() => navigate('/companies')}
        style={{ color: 'var(--color-orange)', background: 'none', border: 'none', cursor: 'pointer' }}
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
        platforms={company.platforms?.length ?? platforms.length ?? 0}
        contacts={company.contactsCount ?? 0}
        reports={company.reportsCount ?? 0}
      />

      <SectionDivider label="Notes" />
      <CompanyNotes companyId={id} />
      <div className="company-profile__sections">

        {/* Platforms — replaces investigations */}
        <CompanyRecentSection
          title="Platforms"
          items={platforms}
          total={company.platforms?.length ?? platforms.length ?? 0}
          type="platform"
          showMorePath={`/companies/${id}/platforms`}
          onItemClick={(item) => navigate(`/platforms/${item.id}`)}
        />

        <CompanyRecentSection
          title="Contacts"
          items={contacts}
          total={company.contactsCount ?? 0}
          type="contact"
          showMorePath={`/companies/${id}/contacts`}
          onItemClick={(item) => navigate(`/contacts/${item.id}`)}
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
          `Are you sure you want to delete "${company.name}"? This will also remove all associated platforms, contacts and reports. This action cannot be undone.`
        }
        confirmLabel="Delete"
        isDanger
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />

    </div>
  )
}