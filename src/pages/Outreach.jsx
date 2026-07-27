import { useState, useEffect, useCallback } from 'react'
import { getTemplatesApi, createTemplateApi, updateTemplateApi, deleteTemplateApi, markTemplateUsedApi, getTemplateApi } from '../api/templates'
import TemplateDrawer from '../components/template/TemplateDrawer'
import ConfirmDialog from '../components/common/ConfirmDialog'
import Pagination from '../components/common/Pagination'
import useAuthStore from '../store/authStore'
import './styles/Outreach.css'

const CHANNEL_LABELS = { LINKEDIN:'LinkedIn', EMAIL:'Email', WHATSAPP:'WhatsApp', SMS:'SMS', GENERAL:'General' }
const TYPE_LABELS    = { EDUCATION:'Education', ADVERTISING:'Advertising', SOFTWARE:'Software', CLOUD:'Cloud / AWS', DEVOPS:'DevOps', SECURITY:'Security', AI:'AI / ML', GENERAL:'General' }
const LANG_LABELS    = { EN:'English', AR:'Arabic' }

const CHANNEL_FILTERS = ['ALL', 'LINKEDIN', 'EMAIL', 'WHATSAPP', 'SMS', 'GENERAL']

export default function Outreach() {
  const user    = useAuthStore((s) => s.user)
  const groups  = user?.['cognito:groups'] || user?.groups || []
  const isAdmin = groups.includes('admin_group')

  const [templates,     setTemplates]     = useState([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState('')
  const [page,          setPage]          = useState(0)
  const [totalPages,    setTotalPages]    = useState(1)
  const [totalElements, setTotalElements] = useState(0)

  const [channelFilter, setChannelFilter] = useState('ALL')
  const [search,        setSearch]        = useState('')
  const [drawerOpen,    setDrawerOpen]    = useState(false)
  const [editTarget,    setEditTarget]    = useState(null)
  const [viewTarget,    setViewTarget]    = useState(null)
  const [deleteTarget,  setDeleteTarget]  = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [copied,        setCopied]        = useState(null)

  const fetchTemplates = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = { page, size: 20, activeOnly: true }
      if (channelFilter !== 'ALL') params.channel = channelFilter
      if (search) params.search = search
      const { data } = await getTemplatesApi(params)
      setTemplates(data.content)
      setTotalPages(data.totalPages)
      setTotalElements(data.totalElements)
    } catch {
      setError('Failed to load templates.')
    } finally {
      setLoading(false)
    }
  }, [page, channelFilter, search])

  useEffect(() => { setPage(0) }, [channelFilter, search])
  useEffect(() => { fetchTemplates() }, [fetchTemplates])

  const openCreate = () => { setEditTarget(null); setViewTarget(null); setDrawerOpen(true) }

  const openEdit = async (tpl) => {
    try {
      const { data } = await getTemplateApi(tpl.id)
      setEditTarget(data)
      setViewTarget(null)
      setDrawerOpen(true)
    } catch {}
  }

  const openView = async (tpl) => {
    try {
      const { data } = await getTemplateApi(tpl.id)
      setViewTarget(data)
    } catch {}
  }

  const handleSave = async (form) => {
    if (editTarget) {
      const { data } = await updateTemplateApi(editTarget.id, form)
      setTemplates((p) => p.map((t) => t.id === editTarget.id ? { ...t, ...data } : t))
    } else {
      await createTemplateApi(form)
      setPage(0)
      fetchTemplates()
    }
    setDrawerOpen(false)
  }

  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      await deleteTemplateApi(deleteTarget.id)
      setTemplates((p) => p.filter((t) => t.id !== deleteTarget.id))
      setTotalElements((p) => p - 1)
      setDeleteTarget(null)
    } catch {
      // handle
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleCopy = async (tpl) => {
    try {
      const { data } = await getTemplateApi(tpl.id)
      await navigator.clipboard.writeText(data.content)
      await markTemplateUsedApi(tpl.id)
      setCopied(tpl.id)
      setTimeout(() => setCopied(null), 2000)
    } catch {}
  }

  return (
    <div className="outreach">

      <div className="outreach__header">
        <div className="outreach__header-left">
          <h1 className="outreach__title">Outreach</h1>
          {!loading && <span className="outreach__count">{totalElements}</span>}
        </div>
        <button className="outreach__add-btn" onClick={openCreate}>
          <svg viewBox="0 0 16 16" fill="none">
            <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          New Template
        </button>
      </div>

      {/* Search + channel filters */}
      <div className="outreach__toolbar">
        <div className="outreach__search-wrap">
          <svg className="outreach__search-icon" viewBox="0 0 20 20" fill="none">
            <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M13 13l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input className="outreach__search" placeholder="Search templates…"
            value={search} onChange={(e) => setSearch(e.target.value)}/>
          {search && (
            <button className="outreach__search-clear" onClick={() => setSearch('')}>×</button>
          )}
        </div>
        <div className="outreach__channel-filters">
          {CHANNEL_FILTERS.map((c) => (
            <button key={c}
              className={`outreach__channel-btn ${channelFilter === c ? 'outreach__channel-btn--active' : ''}`}
              onClick={() => setChannelFilter(c)}>
              {c === 'ALL' ? 'All' : CHANNEL_LABELS[c]}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="outreach__error">{error}</div>}

      {loading ? (
        <div className="outreach__loading">
          {[...Array(4)].map((_, i) => <div key={i} className="outreach__skeleton"/>)}
        </div>
      ) : templates.length === 0 ? (
        <div className="outreach__empty">
          <svg viewBox="0 0 48 48" fill="none" className="outreach__empty-icon">
            <rect x="6" y="6" width="36" height="36" rx="3" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M14 16h20M14 22h20M14 28h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <p>No templates yet</p>
          <span>Create message templates for LinkedIn, email, and WhatsApp outreach.</span>
          <button className="outreach__add-btn" onClick={openCreate} style={{ marginTop: 16 }}>New Template</button>
        </div>
      ) : (
        <div className="outreach__grid">
          {templates.map((tpl) => (
            <div key={tpl.id} className="tpl-card">
              <div className="tpl-card__header">
                <div className="tpl-card__badges">
                  <span className={`tpl-card__channel tpl-card__channel--${tpl.channel?.toLowerCase()}`}>
                    {CHANNEL_LABELS[tpl.channel] || tpl.channel}
                  </span>
                  <span className="tpl-card__lang">{LANG_LABELS[tpl.language] || tpl.language}</span>
                </div>
                <div className="tpl-card__actions">
                  <button className="tpl-card__icon-btn" onClick={() => handleCopy(tpl)} title="Copy content">
                    {copied === tpl.id ? (
                      <svg viewBox="0 0 14 14" fill="none">
                        <path d="M2 7l3.5 3.5L12 3" stroke="#059669" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 14 14" fill="none">
                        <rect x="4.5" y="4.5" width="8" height="9" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                        <path d="M9.5 4.5V3a.5.5 0 0 0-.5-.5H2a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h2" stroke="currentColor" strokeWidth="1.2"/>
                      </svg>
                    )}
                  </button>
                  <button className="tpl-card__icon-btn" onClick={() => openEdit(tpl)} title="Edit">
                    <svg viewBox="0 0 14 14" fill="none">
                      <path d="M2 12h2l6-6-2-2-6 6v2ZM10.5 2l1.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  {isAdmin && (
                    <button className="tpl-card__icon-btn tpl-card__icon-btn--danger"
                      onClick={() => setDeleteTarget(tpl)} title="Delete">
                      <svg viewBox="0 0 14 14" fill="none">
                        <path d="M2 3.5h10M5 3.5V2.5h4v1M5.5 6v4M8.5 6v4M3 3.5l.75 8h6.5L11 3.5"
                          stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <h3 className="tpl-card__title" onClick={() => openView(tpl)}>{tpl.title}</h3>
              {tpl.subject && <p className="tpl-card__subject">{tpl.subject}</p>}

              <div className="tpl-card__meta">
                <span className="tpl-card__type">{TYPE_LABELS[tpl.type] || tpl.type}</span>
                {tpl.lastUsedAt && (
                  <span className="tpl-card__used">
                    Used {new Date(tpl.lastUsedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </span>
                )}
              </div>

              {tpl.tags && (
                <div className="tpl-card__tags">
                  {tpl.tags.split(',').map((t) => t.trim()).filter(Boolean).map((t) => (
                    <span key={t} className="tpl-card__tag">{t}</span>
                  ))}
                </div>
              )}

              {/* View expanded content */}
              {viewTarget?.id === tpl.id && (
                <div className="tpl-card__content-preview">
                  <pre className="tpl-card__content-text">{viewTarget.content}</pre>
                  <button className="tpl-card__close-preview" onClick={() => setViewTarget(null)}>
                    Close
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} totalElements={totalElements}
          itemLabel="templates" onPageChange={(p) => setPage(p)}/>
      )}

      <TemplateDrawer
        open={drawerOpen}
        template={editTarget}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSave}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete template"
        message={`Delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        isDanger
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}