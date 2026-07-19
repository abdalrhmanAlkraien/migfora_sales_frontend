import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  getContactNotesApi,
  createContactNotesBulkApi,
  updateNoteApi,
  deleteNoteApi,
} from '../../api/notes'
import ConfirmDialog from '../common/ConfirmDialog'
import Pagination from '../common/Pagination'
import '../company/styles/CompanyNotes.css'

export default function ContactNotes({ contactId }) {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [totalElements, setTotalElements] = useState(0)

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [draftNotes, setDraftNotes] = useState([''])
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const [editTarget, setEditTarget] = useState(null)
  const [editContent, setEditContent] = useState('')
  const [editLoading, setEditLoading] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchNotes = async () => {
    setLoading(true)
    try {
      const { data } = await getContactNotesApi(contactId, { page, size: 5 })
      setNotes(data.content)
      setTotalPages(data.totalPages)
      setTotalElements(data.totalElements)
    } catch {
      // non-fatal
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchNotes() }, [contactId, page])

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setDrawerOpen(false) }
    if (drawerOpen) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [drawerOpen])

  const addDraft = () => setDraftNotes((p) => [...p, ''])
  const removeDraft = (i) => setDraftNotes((p) => p.filter((_, idx) => idx !== i))
  const setDraft = (i, val) => setDraftNotes((p) => p.map((n, idx) => idx === i ? val : n))

  const openDrawer = () => {
    setDraftNotes([''])
    setSaveError('')
    setDrawerOpen(true)
  }

  const handleSaveBulk = async () => {
    const valid = draftNotes.filter((n) => n.trim())
    if (!valid.length) { setSaveError('Add at least one note.'); return }
    setSaving(true)
    setSaveError('')
    try {
      await createContactNotesBulkApi(contactId, valid.map((content) => ({ content })))
      setDraftNotes([''])
      setDrawerOpen(false)
      setPage(0)
      fetchNotes()
    } catch {
      setSaveError('Failed to save notes. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const openEdit = (note) => {
    setEditTarget(note)
    setEditContent(note.content)
  }

  const handleEditSave = async () => {
    if (!editContent.trim()) return
    setEditLoading(true)
    try {
      const { data } = await updateNoteApi(editTarget.id, editContent.trim())
      setNotes((p) => p.map((n) => n.id === editTarget.id ? data : n))
      setEditTarget(null)
    } catch {
      // handle
    } finally {
      setEditLoading(false)
    }
  }

  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      await deleteNoteApi(deleteTarget.id)
      setNotes((p) => p.filter((n) => n.id !== deleteTarget.id))
      setTotalElements((p) => p - 1)
      setDeleteTarget(null)
    } catch {
      // handle
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="cn">

      <div className="cn__header">
        <div className="cn__header-left">
          <h2 className="cn__title">Notes</h2>
          {totalElements > 0 && (
            <span className="cn__count">{totalElements}</span>
          )}
        </div>
        <button className="cn__add-btn cn__add-btn--ghost" onClick={openDrawer}>
          <svg viewBox="0 0 16 16" fill="none">
            <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Add Notes
        </button>
      </div>

      {loading ? (
        <div className="cn__loading">
          {[...Array(3)].map((_, i) => <div key={i} className="cn__skeleton" />)}
        </div>
      ) : notes.length === 0 ? (
        <div className="cn__empty">
          <svg viewBox="0 0 48 48" fill="none" className="cn__empty-icon">
            <rect x="8" y="6" width="32" height="36" rx="3" stroke="currentColor" strokeWidth="1.5" />
            <path d="M16 16h16M16 22h16M16 28h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <p>No notes yet</p>
          <span>Add notes to track intel about this contact.</span>
        </div>
      ) : (
        <div className="cn__list">
          {notes.map((note) => (
            <div key={note.id} className="cn__item">
              {editTarget?.id === note.id ? (
                <div className="cn__edit-wrap">
                  <textarea
                    className="cn__edit-input"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={3}
                    autoFocus
                  />
                  <div className="cn__edit-actions">
                    <button className="cn__btn cn__btn--ghost"
                      onClick={() => setEditTarget(null)} disabled={editLoading}>
                      Cancel
                    </button>
                    <button className="cn__btn cn__btn--primary"
                      onClick={handleEditSave} disabled={editLoading}>
                      {editLoading ? 'Saving…' : 'Save'}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="cn__item-content">{note.content}</p>
                  <div className="cn__item-footer">
                    <span className="cn__item-date">{note.createdAt?.slice(0, 10)}</span>
                    <div className="cn__item-actions">
                      {note.isOwner && (
                        <button className="cn__icon-btn" onClick={() => openEdit(note)} title="Edit">
                          <svg viewBox="0 0 14 14" fill="none">
                            <path d="M2 12h2l6-6-2-2-6 6v2ZM10.5 2l1.5 1.5"
                              stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      )}
                      {note.isOwner && (
                        <button className="cn__icon-btn cn__icon-btn--danger"
                          onClick={() => setDeleteTarget(note)} title="Delete">
                          <svg viewBox="0 0 14 14" fill="none">
                            <path d="M2 3.5h10M5 3.5V2.5h4v1M5.5 6v4M8.5 6v4M3 3.5l.75 8h6.5L11 3.5"
                              stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          totalElements={totalElements}
          itemLabel="notes"
          onPageChange={(p) => setPage(p)}
        />
      )}

      {createPortal(
        <>
          <div
            className={`cn__drawer-overlay ${drawerOpen ? 'cn__drawer-overlay--open' : ''}`}
            onClick={() => setDrawerOpen(false)}
          />
          <div className={`cn__drawer ${drawerOpen ? 'cn__drawer--open' : ''}`}>
            <div className="cn__drawer-header">
              <h3 className="cn__drawer-title">Add Notes</h3>
              <button className="cn__drawer-close" onClick={() => setDrawerOpen(false)}>
                <svg viewBox="0 0 16 16" fill="none">
                  <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {saveError && <div className="cn__drawer-error">{saveError}</div>}

            <div className="cn__drawer-body">
              {draftNotes.map((note, i) => (
                <div key={i} className="cn__draft-row">
                  <textarea
                    className="cn__draft-input"
                    value={note}
                    onChange={(e) => setDraft(i, e.target.value)}
                    rows={3}
                    placeholder={`Note ${i + 1}…`}
                  />
                  {draftNotes.length > 1 && (
                    <button className="cn__draft-remove" onClick={() => removeDraft(i)}>
                      <svg viewBox="0 0 14 14" fill="none">
                        <path d="M2 3.5h10M5 3.5V2.5h4v1M5.5 6v4M8.5 6v4M3 3.5l.75 8h6.5L11 3.5"
                          stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              <button className="cn__add-draft" onClick={addDraft}>
                <svg viewBox="0 0 16 16" fill="none">
                  <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Add another note
              </button>
            </div>

            <div className="cn__drawer-footer">
              <button className="cn__btn cn__btn--ghost"
                onClick={() => setDrawerOpen(false)} disabled={saving}>
                Cancel
              </button>

              <button className="cn__btn cn__btn--primary"
                onClick={handleSaveBulk} disabled={saving}>
                {saving ? 'Saving…' : 'Save Notes'}
              </button>
            </div>
          </div>
        </>,
        document.body
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete note"
        message="Are you sure you want to delete this note? This cannot be undone."
        confirmLabel="Delete"
        isDanger
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}