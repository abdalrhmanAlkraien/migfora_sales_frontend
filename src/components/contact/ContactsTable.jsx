import ContactStatusBadge  from './ContactStatusBadge'
import ContactQuickStatus  from './ContactQuickStatus'
import './styles/ContactsTable.css'

export default function ContactsTable({ contacts, onRowClick, onStatusChange }) {
  if (contacts.length === 0) {
    return (
      <div className="contacts-table__empty">
        <svg viewBox="0 0 48 48" fill="none" className="contacts-table__empty-icon">
          <circle cx="24" cy="18" r="8" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M8 42c0-8.837 7.163-16 16-16s16 7.163 16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <p>No contacts found</p>
      </div>
    )
  }

  const today = new Date().toISOString().slice(0, 10)

  return (
    <div className="contacts-table">
      <div className="contacts-table__head">
        <div className="contacts-table__col contacts-table__col--name">Contact</div>
        <div className="contacts-table__col">Status</div>
        <div className="contacts-table__col">Follow-up</div>
        <div className="contacts-table__col">Email</div>
        <div className="contacts-table__col">Phone</div>
        <div className="contacts-table__col contacts-table__col--actions"></div>
      </div>

      <div className="contacts-table__body">
        {contacts.map((contact) => {
          const isOverdue = contact.nextFollowUpDate && contact.nextFollowUpDate < today
          const isDueToday = contact.nextFollowUpDate === today

          return (
            <div
              key={contact.id}
              className="contacts-table__row"
              onClick={() => onRowClick(contact)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onRowClick(contact)}
            >
              {/* Contact name + title */}
              <div className="contacts-table__col contacts-table__col--name">
                <div className="contacts-table__avatar">
                  {contact.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="contacts-table__info">
                  <span className="contacts-table__name">{contact.name}</span>
                  <span className="contacts-table__title">{contact.title || '—'}</span>
                </div>
              </div>

              {/* Status with quick change */}
              <div className="contacts-table__col" onClick={(e) => e.stopPropagation()}>
                <ContactQuickStatus
                  status={contact.status}
                  onChange={(s) => onStatusChange(contact.id, s)}
                />
              </div>

              {/* Follow-up date */}
              <div className="contacts-table__col">
                {contact.nextFollowUpDate ? (
                  <span className={`contacts-table__followup ${isOverdue ? 'contacts-table__followup--overdue' : ''} ${isDueToday ? 'contacts-table__followup--today' : ''}`}>
                    {isOverdue && '⚠ '}
                    {isDueToday && '● '}
                    {contact.nextFollowUpDate}
                  </span>
                ) : (
                  <span className="contacts-table__followup--none">—</span>
                )}
              </div>

              {/* Email */}
              <div className="contacts-table__col">
                <span className="contacts-table__text">{contact.email || '—'}</span>
              </div>

              {/* Phone */}
              <div className="contacts-table__col">
                <span className="contacts-table__text">{contact.phone || '—'}</span>
              </div>

              {/* Arrow */}
              <div className="contacts-table__col contacts-table__col--actions">
                <svg viewBox="0 0 14 14" fill="none" className="contacts-table__arrow">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}