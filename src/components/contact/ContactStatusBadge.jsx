import './styles/ContactStatusBadge.css'

const STATUS_MAP = {
  NEW:           { label: 'New',          cls: 'new' },
  CONTACTED:     { label: 'Contacted',    cls: 'contacted' },
  INTERESTED:    { label: 'Interested',   cls: 'interested' },
  MEETING_SET:   { label: 'Meeting Set',  cls: 'meeting' },
  PROPOSAL_SENT: { label: 'Proposal',     cls: 'proposal' },
  NEGOTIATING:   { label: 'Negotiating',  cls: 'negotiating' },
  WON:           { label: 'Won',          cls: 'won' },
  LOST:          { label: 'Lost',         cls: 'lost' },
  ON_HOLD:       { label: 'On Hold',      cls: 'hold' },
}

export default function ContactStatusBadge({ status }) {
  const s = STATUS_MAP[status] || { label: status, cls: 'new' }
  return (
    <span className={`contact-status-badge contact-status-badge--${s.cls}`}>
      {s.label}
    </span>
  )
}