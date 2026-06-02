import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getContactApi, updateContactApi, updateContactStatusApi, deleteContactApi } from '../api/contacts'
import { getContactFollowUpsApi, createFollowUpApi, updateFollowUpApi, deleteFollowUpApi } from '../api/followups'
import ContactQuickStatus from '../components/contact/ContactQuickStatus'
import ContactEditDrawer  from '../components/contact/ContactEditDrawer'
import FollowUpList       from '../components/contact/FollowUpList'
import FollowUpDrawer     from '../components/contact/FollowUpDrawer'
import ConfirmDialog      from '../components/common/ConfirmDialog'
import './styles/ContactDetail.css'

export default function ContactDetail() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [contact,          setContact]          = useState(null)
  const [loading,          setLoading]          = useState(true)
  const [notFound,         setNotFound]         = useState(false)
  const [followUps,        setFollowUps]        = useState([])
  const [followUpsLoading, setFollowUpsLoading] = useState(true)
  const [editOpen,         setEditOpen]         = useState(false)
  const [deleteOpen,       setDeleteOpen]       = useState(false)
  const [deleteLoading,    setDeleteLoading]    = useState(false)
  const [drawerOpen,       setDrawerOpen]       = useState(false)
  const [selectedFollowUp, setSelectedFollowUp] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const { data } = await getContactApi(id)
        setContact(data)
      } catch {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  const fetchFollowUps = useCallback(async () => {
    setFollowUpsLoading(true)
    try {
      const { data } = await getContactFollowUpsApi(id, { page: 0, size: 50 })
      setFollowUps(data.content)
    } catch {
      // non-fatal
    } finally {
      setFollowUpsLoading(false)
    }
  }, [id])

  useEffect(() => { fetchFollowUps() }, [fetchFollowUps])

  const handleStatusChange = async (newStatus) => {
    setContact((p) => ({ ...p, status: newStatus }))
    try {
      await updateContactStatusApi(id, newStatus)
    } catch {
      const { data } = await getContactApi(id)
      setContact(data)
    }
  }

  const handleEditSave = async (form) => {
    try {
      const changed = Object.fromEntries(
        Object.entries(form).filter(([k, v]) => v !== (contact[k] ?? ''))
      )
      const { data } = await updateContactApi(id, changed)
      setContact(data)
      setEditOpen(false)
    } catch (err) {
      throw err
    }
  }

  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      await deleteContactApi(id)
      navigate(`/companies/${contact.companyId}/contacts`)
    } catch {
      setDeleteLoading(false)
    }
  }

  const handleFollowUpSave = async (formData) => {
    try {
      if (selectedFollowUp) {
        const changed = Object.fromEntries(
          Object.entries(formData).filter(([k, v]) => v !== (selectedFollowUp[k] ?? ''))
        )
        const { data } = await updateFollowUpApi(selectedFollowUp.id, changed)
        setFollowUps((p) => p.map((f) => f.id === selectedFollowUp.id ? data : f))
      } else {
        const payload = {
          type:        formData.type,
          scheduledAt: formData.scheduledAt || null,
          notes:       formData.notes       || undefined,
        }
        const { data } = await createFollowUpApi(id, payload)
        setFollowUps((p) => [data, ...p])
        const contactRes = await getContactApi(id)
        setContact(contactRes.data)
      }
      setDrawerOpen(false)
    } catch (err) {
      throw err
    }
  }

  const handleFollowUpDelete = async (fuId) => {
    try {
      await deleteFollowUpApi(fuId)
      setFollowUps((p) => p.filter((f) => f.id !== fuId))
      setDrawerOpen(false)
      const { data } = await getContactApi(id)
      setContact(data)
    } catch {
      // handle error
    }
  }

  if (loading) return <div className="contact-detail__loading">Loading…</div>
  if (notFound) return (
    <div className="contact-detail__loading">
      Contact not found.{' '}
      <button onClick={() => navigate(-1)}
        style={{ color: 'var(--color-orange)', background: 'none', border: 'none', cursor: 'pointer' }}>
        Go back
      </button>
    </div>
  )

  return (
    <div className="contact-detail">

      <div className="contact-detail__header">
        <button className="contact-detail__back"
          onClick={() => navigate(`/companies/${contact.companyId}/contacts`)}>
          <svg viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {contact.companyName}
        </button>

        <div className="contact-detail__title-row">
          <div className="contact-detail__identity">
            <div className="contact-detail__avatar">
              {contact.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="contact-detail__name-row">
                <h1 className="contact-detail__name">{contact.name}</h1>
                <ContactQuickStatus status={contact.status} onChange={handleStatusChange} />
              </div>
              <span className="contact-detail__title-text">{contact.title}</span>
            </div>
          </div>
          <div className="contact-detail__actions">
            <button className="contact-detail__btn contact-detail__btn--ghost"
              onClick={() => setEditOpen(true)}>
              <svg viewBox="0 0 16 16" fill="none" className="contact-detail__btn-icon">
                <path d="M2 14h2.5l7.5-7.5-2.5-2.5L2 11.5V14ZM11.5 2l2.5 2.5"
                  stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Edit
            </button>
            <button className="contact-detail__btn contact-detail__btn--danger"
              onClick={() => setDeleteOpen(true)}>
              <svg viewBox="0 0 16 16" fill="none" className="contact-detail__btn-icon">
                <path d="M2 4h12M5.5 4V2.5h5V4M6.5 7v5M9.5 7v5M3 4l1 9.5h8L13 4"
                  stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="contact-detail__layout">
        <div className="contact-detail__left">

          {/* Contact Info */}
          <div className="contact-detail__card">
            <h2 className="contact-detail__card-title">Contact Info</h2>
            <div className="contact-detail__fields">
              {[
                { label: 'Email',    value: contact.email },
                { label: 'Phone',    value: contact.phone },
                { label: 'LinkedIn', value: contact.linkedIn },
              ].map((f) => f.value && (
                <div key={f.label} className="contact-detail__field-row">
                  <span className="contact-detail__field-label">{f.label}</span>
                  <span className="contact-detail__field-value">{f.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Follow-up Stats */}
          <div className="contact-detail__card">
            <h2 className="contact-detail__card-title">Follow-up Stats</h2>
            <div className="contact-detail__fields">
              <div className="contact-detail__field-row">
                <span className="contact-detail__field-label">Total</span>
                <span className="contact-detail__field-value">{contact.followUpsCount ?? 0}</span>
              </div>
              <div className="contact-detail__field-row">
                <span className="contact-detail__field-label">Pending</span>
                <span className="contact-detail__field-value">{contact.pendingFollowUpsCount ?? 0}</span>
              </div>
              {contact.lastFollowUpAt && (
                <div className="contact-detail__field-row">
                  <span className="contact-detail__field-label">Last</span>
                  <span className="contact-detail__field-value">
                    {contact.lastFollowUpAt.slice(0, 16).replace('T', ' ')}
                  </span>
                </div>
              )}
              {contact.nextFollowUpAt && (
                <div className="contact-detail__field-row">
                  <span className="contact-detail__field-label">Next</span>
                  <span className="contact-detail__field-value contact-detail__field-value--orange">
                    {contact.nextFollowUpAt.slice(0, 16).replace('T', ' ')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {contact.notes && (
            <div className="contact-detail__card">
              <h2 className="contact-detail__card-title">Notes</h2>
              <p className="contact-detail__notes">{contact.notes}</p>
            </div>
          )}

        </div>

        <div className="contact-detail__right">
          <FollowUpList
            followUps={followUps}
            loading={followUpsLoading}
            onFollowUpClick={(fu) => { setSelectedFollowUp(fu); setDrawerOpen(true) }}
            onNew={() => { setSelectedFollowUp(null); setDrawerOpen(true) }}
          />
        </div>
      </div>

      <ContactEditDrawer
        open={editOpen}
        contact={contact}
        onClose={() => setEditOpen(false)}
        onSave={handleEditSave}
      />

      <FollowUpDrawer
        open={drawerOpen}
        followUp={selectedFollowUp}
        onClose={() => setDrawerOpen(false)}
        onSave={handleFollowUpSave}
        onDelete={handleFollowUpDelete}
      />

      <ConfirmDialog
        isOpen={deleteOpen}
        title="Delete contact"
        message={`Are you sure you want to delete "${contact.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isDanger
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />

    </div>
  )
}