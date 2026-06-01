import './styles/FollowUpList.css'

const TYPE_MAP = {
  CALL:      { label: 'Call',      icon: '📞', cls: 'call' },
  VISIT:     { label: 'Visit',     icon: '🏢', cls: 'visit' },
  MEETING:   { label: 'Meeting',   icon: '🤝', cls: 'meeting' },
  EMAIL:     { label: 'Email',     icon: '✉',  cls: 'email' },
  WHATSAPP:  { label: 'WhatsApp',  icon: '💬', cls: 'whatsapp' },
}

const STATUS_MAP = {
  SCHEDULED: { label: 'Scheduled', cls: 'scheduled' },
  DONE:      { label: 'Done',      cls: 'done' },
  MISSED:    { label: 'Missed',    cls: 'missed' },
}

export default function FollowUpList({ followUps, onFollowUpClick, onNew }) {
  const sorted = [...followUps].sort(
    (a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate)
  )

  return (
    <div className="followup-list">
      <div className="followup-list__header">
        <h2 className="followup-list__title">Follow-up History</h2>
        <button className="followup-list__new-btn" onClick={onNew}>
          <svg viewBox="0 0 16 16" fill="none">
            <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Add Follow-up
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className="followup-list__empty">
          <p>No follow-ups yet</p>
          <span>Add your first follow-up to start tracking interactions</span>
        </div>
      ) : (
        <div className="followup-list__timeline">
          {sorted.map((fu, i) => {
            const type   = TYPE_MAP[fu.type]   || { label: fu.type,   icon: '📋', cls: 'call' }
            const status = STATUS_MAP[fu.status] || { label: fu.status, cls: 'scheduled' }
            return (
              <div
                key={fu.id}
                className="followup-list__item"
                onClick={() => onFollowUpClick(fu)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onFollowUpClick(fu)}
              >
                <div className="followup-list__timeline-left">
                  <div className={`followup-list__dot followup-list__dot--${status.cls}`} />
                  {i < sorted.length - 1 && <div className="followup-list__line" />}
                </div>

                <div className="followup-list__content">
                  <div className="followup-list__content-header">
                    <div className="followup-list__type-row">
                      <span className="followup-list__type-icon">{type.icon}</span>
                      <span className="followup-list__type-label">{type.label}</span>
                      <span className={`followup-list__status followup-list__status--${status.cls}`}>
                        {status.label}
                      </span>
                    </div>
                    <span className="followup-list__date">
                      {fu.scheduledDate?.slice(0, 16).replace('T', ' ')}
                    </span>
                  </div>
                  {fu.note && (
                    <p className="followup-list__note">{fu.note}</p>
                  )}
                  <span className="followup-list__by">by {fu.createdBy}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}