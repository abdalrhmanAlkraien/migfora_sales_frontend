import './styles/ConfirmDialog.css'

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, confirmLabel = 'Delete', isDanger = true }) {
  if (!isOpen) return null

  return (
    <>
      <div className="confirm-dialog-overlay" onClick={onCancel} />
      <div className="confirm-dialog">
        <div className="confirm-dialog__icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <h3 className="confirm-dialog__title">{title}</h3>
        <p className="confirm-dialog__message">{message}</p>
        <div className="confirm-dialog__actions">
          <button className="confirm-dialog__cancel" onClick={onCancel}>Cancel</button>
          <button
            className={`confirm-dialog__confirm ${isDanger ? 'confirm-dialog__confirm--danger' : ''}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </>
  )
}