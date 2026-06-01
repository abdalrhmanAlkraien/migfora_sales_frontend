import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import ContactStatusBadge from './ContactStatusBadge'
import './styles/ContactQuickStatus.css'

const STATUSES = [
  'NEW','CONTACTED','INTERESTED','MEETING_SET',
  'PROPOSAL_SENT','NEGOTIATING','WON','LOST','ON_HOLD'
]
const STATUS_LABELS = {
  NEW:'New', CONTACTED:'Contacted', INTERESTED:'Interested',
  MEETING_SET:'Meeting Set', PROPOSAL_SENT:'Proposal Sent',
  NEGOTIATING:'Negotiating', WON:'Won', LOST:'Lost', ON_HOLD:'On Hold',
}

export default function ContactQuickStatus({ status, onChange }) {
  const [open,    setOpen]    = useState(false)
  const [pos,     setPos]     = useState({ top: 0, left: 0 })
  const triggerRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (!triggerRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const handleOpen = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPos({
        top:  rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
      })
    }
    setOpen((p) => !p)
  }

  return (
    <div className="cqs" ref={triggerRef}>
      <button className="cqs__trigger" onClick={handleOpen}>
        <ContactStatusBadge status={status} />
        <svg viewBox="0 0 10 6" fill="none" className="cqs__chevron">
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && createPortal(
        <div
          className="cqs__dropdown"
          style={{ top: pos.top, left: pos.left }}
        >
          {STATUSES.map((s) => (
            <button
              key={s}
              className={`cqs__option ${s === status ? 'cqs__option--active' : ''}`}
              onClick={() => { onChange(s); setOpen(false) }}
            >
              <ContactStatusBadge status={s} />
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  )
}