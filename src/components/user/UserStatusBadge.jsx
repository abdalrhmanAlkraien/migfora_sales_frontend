import './styles/UserStatusBadge.css'

const STATUS_MAP = {
  CONFIRMED:             { label: 'Confirmed',         cls: 'confirmed' },
  FORCE_CHANGE_PASSWORD: { label: 'Pending Password',  cls: 'pending' },
  UNCONFIRMED:           { label: 'Unconfirmed',       cls: 'unconfirmed' },
  RESET_REQUIRED:        { label: 'Reset Required',    cls: 'pending' },
  ARCHIVED:              { label: 'Archived',          cls: 'archived' },
  COMPROMISED:           { label: 'Compromised',       cls: 'compromised' },
}

export default function UserStatusBadge({ status }) {
  const s = STATUS_MAP[status] || { label: status, cls: 'confirmed' }
  return (
    <span className={`user-status-badge user-status-badge--${s.cls}`}>
      {s.label}
    </span>
  )
}