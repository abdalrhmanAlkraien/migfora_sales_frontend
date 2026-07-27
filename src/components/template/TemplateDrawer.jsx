import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import './styles/TemplateDrawer.css'

const TYPE_OPTIONS = [
  { value: 'EDUCATION',   label: 'Education' },
  { value: 'ADVERTISING', label: 'Advertising' },
  { value: 'SOFTWARE',    label: 'Software' },
  { value: 'CLOUD',       label: 'Cloud / AWS' },
  { value: 'DEVOPS',      label: 'DevOps' },
  { value: 'SECURITY',    label: 'Security' },
  { value: 'AI',          label: 'AI / ML' },
  { value: 'GENERAL',     label: 'General' },
]

const DOOR_TYPE_OPTIONS = [
  { value: 'MIGFORA_SHIELD',   label: 'MIGFORA Shield' },
  { value: 'PARTNER',          label: 'Partnership' },
  { value: 'PERFORMANCE',      label: 'Performance' },
  { value: 'IMPLEMENT_APP',    label: 'App Implementation' },
  { value: 'CLOUD_MIGRATION',  label: 'Cloud Migration' },
  { value: 'MANAGED_SERVICES', label: 'Managed Services' },
  { value: 'GENERAL',          label: 'General' },
]

const CHANNEL_OPTIONS = [
  { value: 'LINKEDIN',  label: 'LinkedIn' },
  { value: 'EMAIL',     label: 'Email' },
  { value: 'WHATSAPP',  label: 'WhatsApp' },
  { value: 'SMS',       label: 'SMS' },
  { value: 'GENERAL',   label: 'General' },
]

const LANGUAGE_OPTIONS = [
  { value: 'EN', label: 'English' },
  { value: 'AR', label: 'Arabic' },
]

const EMPTY = {
  title: '', subject: '', content: '', type: 'GENERAL',
  doorType: 'GENERAL', channel: 'LINKEDIN', language: 'EN', tags: '',
}

export default function TemplateDrawer({ open, template, onClose, onSave }) {
  const [form,    setForm]    = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  useEffect(() => {
    if (template) {
      setForm({
        title:    template.title    || '',
        subject:  template.subject  || '',
        content:  template.content  || '',
        type:     template.type     || 'GENERAL',
        doorType: template.doorType || 'GENERAL',
        channel:  template.channel  || 'LINKEDIN',
        language: template.language || 'EN',
        tags:     template.tags     || '',
      })
    } else {
      setForm(EMPTY)
    }
    setError('')
  }, [template, open])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim())   { setError('Title is required.'); return }
    if (!form.content.trim()) { setError('Content is required.'); return }
    setLoading(true)
    setError('')
    try {
      const payload = Object.fromEntries(
        Object.entries(form).filter(([_, v]) => v !== '')
      )
      await onSave(payload)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save template.')
    } finally {
      setLoading(false)
    }
  }

  const showSubject = form.channel === 'EMAIL' || form.channel === 'GENERAL'

  return createPortal(
    <>
      <div className={`tpd__overlay ${open ? 'tpd__overlay--open' : ''}`} onClick={onClose}/>
      <div className={`tpd ${open ? 'tpd--open' : ''}`} role="dialog" aria-modal="true">

        <div className="tpd__header">
          <h2 className="tpd__title">{template ? 'Edit Template' : 'New Template'}</h2>
          <button className="tpd__close" onClick={onClose}>
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {error && <div className="tpd__error">{error}</div>}

        <form className="tpd__form" onSubmit={handleSubmit} noValidate>
          <div className="tpd__scroll">

            <div className="tpd__section-title">Basic Info</div>

            <div className="tpd__field">
              <label className="tpd__label">Title <span className="tpd__req">*</span></label>
              <input className="tpd__input" value={form.title} onChange={set('title')}
                placeholder="e.g. AWS Migration Cold Intro"/>
            </div>

            {showSubject && (
              <div className="tpd__field">
                <label className="tpd__label">Subject (Email)</label>
                <input className="tpd__input" value={form.subject} onChange={set('subject')}
                  placeholder="e.g. Modernize your infrastructure with AWS"/>
              </div>
            )}

            <div className="tpd__section-title">Classification</div>

            <div className="tpd__row">
              <div className="tpd__field">
                <label className="tpd__label">Type</label>
                <select className="tpd__input" value={form.type} onChange={set('type')}>
                  {TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="tpd__field">
                <label className="tpd__label">Door Type</label>
                <select className="tpd__input" value={form.doorType} onChange={set('doorType')}>
                  {DOOR_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            <div className="tpd__row">
              <div className="tpd__field">
                <label className="tpd__label">Channel</label>
                <select className="tpd__input" value={form.channel} onChange={set('channel')}>
                  {CHANNEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="tpd__field">
                <label className="tpd__label">Language</label>
                <select className="tpd__input" value={form.language} onChange={set('language')}>
                  {LANGUAGE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            <div className="tpd__field">
              <label className="tpd__label">Tags <span className="tpd__hint">(comma-separated)</span></label>
              <input className="tpd__input" value={form.tags} onChange={set('tags')}
                placeholder="e.g. aws,cloud,migration,cold-outreach"/>
              {form.tags && (
                <div className="tpd__tags-preview">
                  {form.tags.split(',').map((t) => t.trim()).filter(Boolean).map((t) => (
                    <span key={t} className="tpd__tag">{t}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="tpd__section-title">
              Content
              <span className="tpd__hint"> — use {'{{name}}'}, {'{{company}}'}, {'{{industry}}'} as placeholders</span>
            </div>

            <div className="tpd__field">
              <textarea className="tpd__input tpd__textarea tpd__textarea--large"
                value={form.content} onChange={set('content')} rows={12}
                placeholder="Hi {{name}},&#10;&#10;I noticed that {{company}} is running on {{current_stack}}…"/>
            </div>

          </div>

          <div className="tpd__footer">
            <button type="button" className="tpd__btn tpd__btn--ghost" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="tpd__btn tpd__btn--primary" disabled={loading}>
              {loading ? 'Saving…' : template ? 'Save Changes' : 'Create Template'}
            </button>
          </div>
        </form>
      </div>
    </>,
    document.body
  )
}