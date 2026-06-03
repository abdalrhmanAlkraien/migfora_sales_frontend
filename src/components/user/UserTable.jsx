import { useState } from 'react'
import UserStatusBadge   from './UserStatusBadge'
import UserRoleBadge     from './UserRoleBadge'
import ResetPasswordModal from './ResetPasswordModal'
import ConfirmDialog     from '../common/ConfirmDialog'
import './styles/UserTable.css'

export default function UserTable({ users, onToggleEnabled, onDelete, onViewProfile }) {
  const [resetTarget,  setResetTarget]  = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  if (users.length === 0) {
    return (
      <div className="user-table__empty">
        <svg viewBox="0 0 48 48" fill="none" className="user-table__empty-icon">
          <circle cx="24" cy="18" r="8" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M8 42c0-8.837 7.163-16 16-16s16 7.163 16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <p>No users found</p>
      </div>
    )
  }

  return (
    <>
      <div className="user-table">
        <div className="user-table__head">
          <div className="user-table__col">User</div>
          <div className="user-table__col">Role</div>
          <div className="user-table__col">Status</div>
          <div className="user-table__col">Account</div>
          <div className="user-table__col">Created</div>
          <div className="user-table__col user-table__col--actions">Actions</div>
        </div>

        <div className="user-table__body">
          {users.map((user) => (
            <div key={user.sub} className="user-table__row">

              {/* User */}
              <div className="user-table__col user-table__col--user">
                <div className="user-table__avatar">
                  {`${user.name?.[0] || ''}${user.familyName?.[0] || ''}`.toUpperCase()}
                </div>
                <div className="user-table__info">
                  <span className="user-table__name">{user.name} {user.familyName}</span>
                  <span className="user-table__email">{user.email}</span>
                </div>
              </div>

              {/* Role */}
              <div className="user-table__col">
                <UserRoleBadge groups={user.groups} />
              </div>

              {/* Account status */}
              <div className="user-table__col">
                <UserStatusBadge status={user.status} />
              </div>

              {/* Enabled toggle */}
              <div className="user-table__col">
                <button
                  className={`user-table__toggle ${user.enabled ? 'user-table__toggle--on' : 'user-table__toggle--off'}`}
                  onClick={() => onToggleEnabled(user.sub)}
                  title={user.enabled ? 'Disable user' : 'Enable user'}
                >
                  <span className="user-table__toggle-knob" />
                </button>
                <span className="user-table__toggle-label">
                  {user.enabled ? 'Active' : 'Disabled'}
                </span>
              </div>

              {/* Created */}
              <div className="user-table__col">
                <span className="user-table__date">{user.createdAt?.slice(0, 10)}</span>
              </div>

              {/* Actions */}
              <div className="user-table__col user-table__col--actions">
                <button
                  className="user-table__action user-table__action--view"
                  onClick={() => onViewProfile(user)}
                  title="View profile"
                >
                  View
                </button>
                <button
                  className="user-table__action user-table__action--reset"
                  onClick={() => setResetTarget(user)}
                  title="Reset password"
                >
                  Reset PW
                </button>
                <button
                  className="user-table__action user-table__action--delete"
                  onClick={() => setDeleteTarget(user)}
                  title="Delete user"
                >
                  <svg viewBox="0 0 14 14" fill="none">
                    <path d="M2 3.5h10M5 3.5V2.5h4v1M5.5 6v4M8.5 6v4M3 3.5l.75 8h6.5L11 3.5"
                      stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      <ResetPasswordModal
        open={!!resetTarget}
        user={resetTarget}
        isAdmin
        onClose={() => setResetTarget(null)}
        onReset={() => setResetTarget(null)}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete user"
        message={`Are you sure you want to delete "${deleteTarget?.name} ${deleteTarget?.familyName}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isDanger
        onConfirm={() => { onDelete(deleteTarget.sub); setDeleteTarget(null) }}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  )
}