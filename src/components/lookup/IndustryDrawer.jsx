import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import './styles/IndustryDrawer.css'

export default function IndustryDrawer({ open, industry, onClose, onSave }) {
  const [form,    setForm]    = useState({ name: '', nameAr: '', description: '', active: true })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  useEffect(() => {
    if (industry) {
      setForm({
        name:        industry.name        || '',
        nameAr:      industry.nameAr      || '',
        description: industry.description || '',
        active:      industry.active      ?? true,
      })
    } else {
      setForm({ name: '', nameAr: '', description: '', active: true })
    }
    setError('')
  }, [industry, open])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((p) => ({ ...p, [field]: val }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Industry name is required.'); return }
    setLoading(true)
    setError('')
    try {
      await onSave(form)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save.')
    } finally {
      setLoading(false)
    }
  }

  return createPortal(
    <>
      <div
        className={`ind-drawer__overlay ${open ? 'ind-drawer__overlay--open' : ''}`}
        onClick={onClose}
      />
      <div className={`ind-drawer ${open ? 'ind-drawer--open' : ''}`} role="dialog" aria-modal="true">

        <div className="ind-drawer__header">
          <h2 className="ind-drawer__title">{industry ? 'Edit Industry' : 'New Industry'}</h2>
          <button className="ind-drawer__close" onClick={onClose}>
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {error && <div className="ind-drawer__error">{error}</div>}

        <form className="ind-drawer__form" onSubmit={handleSubmit} noValidate>
          <div className="ind-drawer__scroll">

            <div className="ind-drawer__field">
              <label className="ind-drawer__label">
                Name (English) <span className="ind-drawer__req">*</span>
              </label>
              <input
                className="ind-drawer__input"
                value={form.name}
                onChange={set('name')}
                placeholder="e.g. E-Commerce"
              />
            </div>

            <div className="ind-drawer__field">
              <label className="ind-drawer__label">Name (Arabic)</label>
              <input
                className="ind-drawer__input ind-drawer__input--rtl"
                value={form.nameAr}
                onChange={set('nameAr')}
                placeholder="مثال: التجارة الإلكترونية"
                dir="rtl"
              />
            </div>

            <div className="ind-drawer__field">
              <label className="ind-drawer__label">Description</label>
              <textarea
                className="ind-drawer__input ind-drawer__textarea"
                value={form.description}
                onChange={set('description')}
                rows={3}
                placeholder="Optional description…"
              />
            </div>

            {industry && (
              <div className="ind-drawer__field ind-drawer__field--checkbox">
                <input
                  type="checkbox"
                  id="ind-active"
                  checked={form.active}
                  onChange={set('active')}
                  className="ind-drawer__checkbox"
                />
                <label htmlFor="ind-active" className="ind-drawer__checkbox-label">
                  Active
                </label>
              </div>
            )}

          </div>

          <div className="ind-drawer__footer">
            <button
              type="button"
              className="ind-drawer__btn ind-drawer__btn--ghost"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ind-drawer__btn ind-drawer__btn--primary"
              disabled={loading}
            >
              {loading ? 'Saving…' : industry ? 'Save Changes' : 'Create Industry'}
            </button>
          </div>
        </form>
      </div>
    </>,
    document.body
  )
}