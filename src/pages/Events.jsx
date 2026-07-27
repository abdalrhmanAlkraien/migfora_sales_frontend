import { useState, useEffect, useCallback } from 'react'
import { getEventsApi, createEventApi, updateEventApi, deleteEventApi } from '../api/events'
import EventDrawer from '../components/event/EventDrawer'
import ConfirmDialog from '../components/common/ConfirmDialog'
import Pagination from '../components/common/Pagination'
import SectionDivider from '../components/common/SectionDivider'
import useAuthStore from '../store/authStore'
import './styles/Events.css'

const STATUS_MAP = {
  UPCOMING:  { label: 'Upcoming',  cls: 'upcoming' },
  ONGOING:   { label: 'Ongoing',   cls: 'ongoing' },
  COMPLETED: { label: 'Completed', cls: 'completed' },
  CANCELLED: { label: 'Cancelled', cls: 'cancelled' },
}

const ATTENDANCE_LABELS = {
  IN_PERSON: 'In Person',
  VIRTUAL:   'Virtual',
  HYBRID:    'Hybrid',
}

const STATUS_FILTERS = ['ALL', 'UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED']

export default function Events() {
  const user    = useAuthStore((s) => s.user)
  const groups  = user?.['cognito:groups'] || user?.groups || []
  const isAdmin = groups.includes('admin_group')

  const [events,        setEvents]        = useState([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState('')
  const [page,          setPage]          = useState(0)
  const [totalPages,    setTotalPages]    = useState(1)
  const [totalElements, setTotalElements] = useState(0)

  const [statusFilter,  setStatusFilter]  = useState('ALL')
  const [drawerOpen,    setDrawerOpen]    = useState(false)
  const [editTarget,    setEditTarget]    = useState(null)
  const [deleteTarget,  setDeleteTarget]  = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = { page, size: 20 }
      if (statusFilter !== 'ALL') params.status = statusFilter
      const { data } = await getEventsApi(params)
      setEvents(data.content)
      setTotalPages(data.totalPages)
      setTotalElements(data.totalElements)
    } catch {
      setError('Failed to load events.')
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter])

  useEffect(() => { setPage(0) }, [statusFilter])
  useEffect(() => { fetchEvents() }, [fetchEvents])

  const openCreate = () => { setEditTarget(null); setDrawerOpen(true) }
  const openEdit   = (ev) => { setEditTarget(ev); setDrawerOpen(true) }

  const handleSave = async (form) => {
    if (editTarget) {
      const { data } = await updateEventApi(editTarget.id, form)
      setEvents((p) => p.map((e) => e.id === editTarget.id ? data : e))
    } else {
      await createEventApi(form)
      setPage(0)
      fetchEvents()
    }
    setDrawerOpen(false)
  }

  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      await deleteEventApi(deleteTarget.id)
      setEvents((p) => p.filter((e) => e.id !== deleteTarget.id))
      setTotalElements((p) => p - 1)
      setDeleteTarget(null)
    } catch {
      // handle
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="events">

      <div className="events__header">
        <div className="events__header-left">
          <h1 className="events__title">Events</h1>
          {!loading && <span className="events__count">{totalElements}</span>}
        </div>
        <button className="events__add-btn" onClick={openCreate}>
          <svg viewBox="0 0 16 16" fill="none">
            <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          New Event
        </button>
      </div>

      {/* Status filter pills */}
      <div className="events__filters">
        {STATUS_FILTERS.map((s) => (
          <button key={s}
            className={`events__filter-btn ${statusFilter === s ? 'events__filter-btn--active' : ''}`}
            onClick={() => setStatusFilter(s)}>
            {s === 'ALL' ? 'All' : STATUS_MAP[s]?.label}
          </button>
        ))}
      </div>

      {error && <div className="events__error">{error}</div>}

      {loading ? (
        <div className="events__loading">
          {[...Array(4)].map((_, i) => <div key={i} className="events__skeleton"/>)}
        </div>
      ) : events.length === 0 ? (
        <div className="events__empty">
          <svg viewBox="0 0 48 48" fill="none" className="events__empty-icon">
            <rect x="6" y="8" width="36" height="34" rx="3" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M6 18h36M16 6v6M32 6v6M14 26h4v4h-4zM22 26h4v4h-4zM30 26h4v4h-4z"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <p>No events yet</p>
          <span>Add upcoming conferences and networking events to track opportunities.</span>
          <button className="events__add-btn" onClick={openCreate} style={{ marginTop: 16 }}>
            New Event
          </button>
        </div>
      ) : (
        <>
          <div className="events__list">
            {events.map((ev) => {
              const s = STATUS_MAP[ev.status] || STATUS_MAP.UPCOMING
              return (
                <div key={ev.id} className="event-card">
                  <div className="event-card__left">
                    <div className="event-card__date-block">
                      <span className="event-card__month">
                        {new Date(ev.startDate).toLocaleString('en', { month: 'short' }).toUpperCase()}
                      </span>
                      <span className="event-card__day">
                        {new Date(ev.startDate).getDate()}
                      </span>
                    </div>
                  </div>

                  <div className="event-card__body">
                    <div className="event-card__top">
                      <h3 className="event-card__name">{ev.name}</h3>
                      <span className={`event-card__status event-card__status--${s.cls}`}>{s.label}</span>
                    </div>
                    <div className="event-card__meta">
                      {ev.city && ev.country && (
                        <span className="event-card__meta-item">
                          <svg viewBox="0 0 14 14" fill="none" className="event-card__meta-icon">
                            <path d="M7 1.5A3.5 3.5 0 0 1 10.5 5c0 2.5-3.5 7-3.5 7S3.5 7.5 3.5 5A3.5 3.5 0 0 1 7 1.5Z"
                              stroke="currentColor" strokeWidth="1.2"/>
                            <circle cx="7" cy="5" r="1.2" stroke="currentColor" strokeWidth="1.2"/>
                          </svg>
                          {ev.city}, {ev.country}
                        </span>
                      )}
                      {ev.venue && (
                        <span className="event-card__meta-item">{ev.venue}</span>
                      )}
                      {ev.attendanceType && (
                        <span className="event-card__meta-item">
                          {ATTENDANCE_LABELS[ev.attendanceType] || ev.attendanceType}
                        </span>
                      )}
                      {ev.endDate && ev.endDate !== ev.startDate && (
                        <span className="event-card__meta-item">
                          Until {new Date(ev.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      )}
                      {ev.expectedAttendees && (
                        <span className="event-card__meta-item">
                          {ev.expectedAttendees.toLocaleString()} attendees
                        </span>
                      )}
                    </div>
                    {ev.notes && (
                      <p className="event-card__notes">{ev.notes}</p>
                    )}
                  </div>

                  <div className="event-card__actions">
                    {ev.website && (
                      <a href={ev.website} target="_blank" rel="noopener noreferrer"
                        className="event-card__icon-btn" title="Visit website">
                        <svg viewBox="0 0 14 14" fill="none">
                          <path d="M5.5 2.5H2a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V8.5M8.5 1.5H12.5V5.5M12.5 1.5L6.5 7.5"
                            stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </a>
                    )}
                    <button className="event-card__icon-btn" onClick={() => openEdit(ev)} title="Edit">
                      <svg viewBox="0 0 14 14" fill="none">
                        <path d="M2 12h2l6-6-2-2-6 6v2ZM10.5 2l1.5 1.5"
                          stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    {isAdmin && (
                      <button className="event-card__icon-btn event-card__icon-btn--danger"
                        onClick={() => setDeleteTarget(ev)} title="Delete">
                        <svg viewBox="0 0 14 14" fill="none">
                          <path d="M2 3.5h10M5 3.5V2.5h4v1M5.5 6v4M8.5 6v4M3 3.5l.75 8h6.5L11 3.5"
                            stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} totalElements={totalElements}
              itemLabel="events" onPageChange={(p) => setPage(p)}/>
          )}
        </>
      )}

      <EventDrawer
        open={drawerOpen}
        event={editTarget}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSave}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete event"
        message={`Delete "${deleteTarget?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        isDanger
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}