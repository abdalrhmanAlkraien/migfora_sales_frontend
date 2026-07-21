import { useState, useEffect } from 'react'
import {
  getIndustriesPageableApi,
  createIndustryApi,
  updateIndustryApi,
  deleteIndustryApi,
} from '../api/industries'
import { createPortal } from 'react-dom'
import ConfirmDialog from '../components/common/ConfirmDialog'
import Pagination    from '../components/common/Pagination'
import SectionDivider from '../components/common/SectionDivider'
import './styles/Lookup.css'
import IndustryDrawer from '../components/lookup/IndustryDrawer'


// ── Main Lookup Page ──────────────────────────────────────────────────────────
export default function Lookup() {
  const [industries,    setIndustries]    = useState([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState('')
  const [page,          setPage]          = useState(0)
  const [totalPages,    setTotalPages]    = useState(1)
  const [totalElements, setTotalElements] = useState(0)

  const [drawerOpen,    setDrawerOpen]    = useState(false)
  const [editTarget,    setEditTarget]    = useState(null)
  const [deleteTarget,  setDeleteTarget]  = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchIndustries = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await getIndustriesPageableApi({ page, size: 10, sort: 'name,asc' })
      setIndustries(data.content)
      setTotalPages(data.totalPages)
      setTotalElements(data.totalElements)
    } catch {
      setError('Failed to load industries.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchIndustries() }, [page])

  const openCreate = () => { setEditTarget(null); setDrawerOpen(true) }
  const openEdit   = (ind) => { setEditTarget(ind); setDrawerOpen(true) }

  const handleSave = async (form) => {
    if (editTarget) {
      const { data } = await updateIndustryApi(editTarget.id, form)
      setIndustries((p) => p.map((i) => i.id === editTarget.id ? data : i))
    } else {
      await createIndustryApi(form)
      setPage(0)
      fetchIndustries()
    }
    setDrawerOpen(false)
  }

  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      await deleteIndustryApi(deleteTarget.id)
      setIndustries((p) => p.map((i) =>
        i.id === deleteTarget.id ? { ...i, active: false } : i
      ))
      setDeleteTarget(null)
    } catch {
      // handle
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="lookup">
      <div className="lookup__header">
        <div className="lookup__header-left">
          <h1 className="lookup__title">Lookups</h1>
          <p className="lookup__subtitle">Manage system reference data</p>
        </div>
      </div>

      <SectionDivider label="Industries" />

      <div className="lookup__section">
        <div className="lookup__section-header">
          <div className="lookup__section-header-left">
            <h2 className="lookup__section-title">Industries</h2>
            {!loading && <span className="lookup__count">{totalElements}</span>}
          </div>
          <button className="lookup__add-btn" onClick={openCreate}>
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            New Industry
          </button>
        </div>

        {error && <div className="lookup__error">{error}</div>}

        {loading ? (
          <div className="lookup__loading">
            {[...Array(5)].map((_, i) => <div key={i} className="lookup__skeleton"/>)}
          </div>
        ) : industries.length === 0 ? (
          <div className="lookup__empty">
            <p>No industries yet</p>
            <span>Create your first industry to use in company profiles.</span>
          </div>
        ) : (
          <div className="lookup__table-wrap">
            <table className="lookup__table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Arabic Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {industries.map((ind) => (
                  <tr key={ind.id} className={!ind.active ? 'lookup__row--inactive' : ''}>
                    <td className="lookup__cell--name">{ind.name}</td>
                    <td className="lookup__cell--arabic" dir="rtl">{ind.nameAr || '—'}</td>
                    <td className="lookup__cell--desc">{ind.description || '—'}</td>
                    <td>
                      <span className={`lookup__badge ${ind.active ? 'lookup__badge--active' : 'lookup__badge--inactive'}`}>
                        {ind.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="lookup__cell--date">{ind.createdAt?.slice(0, 10)}</td>
                    <td className="lookup__cell--actions">
                      <button className="lookup__icon-btn" onClick={() => openEdit(ind)} title="Edit">
                        <svg viewBox="0 0 14 14" fill="none">
                          <path d="M2 12h2l6-6-2-2-6 6v2ZM10.5 2l1.5 1.5"
                            stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button className="lookup__icon-btn lookup__icon-btn--danger"
                        onClick={() => setDeleteTarget(ind)} title="Delete">
                        <svg viewBox="0 0 14 14" fill="none">
                          <path d="M2 3.5h10M5 3.5V2.5h4v1M5.5 6v4M8.5 6v4M3 3.5l.75 8h6.5L11 3.5"
                            stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            totalElements={totalElements}
            itemLabel="industries"
            onPageChange={(p) => setPage(p)}
          />
        )}
      </div>

      <IndustryDrawer
        open={drawerOpen}
        industry={editTarget}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSave}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Deactivate industry"
        message={`Deactivate "${deleteTarget?.name}"? It will no longer appear in dropdowns but existing companies will keep their industry.`}
        confirmLabel="Deactivate"
        isDanger
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}