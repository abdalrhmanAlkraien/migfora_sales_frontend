import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getUserApi, updateUserApi, enableUserApi, disableUserApi, deleteUserApi, resetPasswordApi } from '../api/users'
import UserRoleBadge      from '../components/user/UserRoleBadge'
import UserStatusBadge    from '../components/user/UserStatusBadge'
import UserEditDrawer     from '../components/user/UserEditDrawer'
import ResetPasswordModal from '../components/user/ResetPasswordModal'
import ConfirmDialog      from '../components/common/ConfirmDialog'
import './styles/UserDetail.css'

export default function UserDetail() {
  const { sub }  = useParams()
  const navigate = useNavigate()

  const [user,          setUser]          = useState(null)
  const [loading,       setLoading]       = useState(true)
  const [notFound,      setNotFound]      = useState(false)
  const [editOpen,      setEditOpen]      = useState(false)
  const [resetOpen,     setResetOpen]     = useState(false)
  const [resetLoading,  setResetLoading]  = useState(false)
  const [resetSuccess,  setResetSuccess]  = useState(false)
  const [deleteOpen,    setDeleteOpen]    = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [toggleLoading, setToggleLoading] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const { data } = await getUserApi(sub)
        setUser(data)
      } catch {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [sub])

  const handleToggleEnabled = async () => {
    setToggleLoading(true)
    const wasEnabled = user.enabled
    setUser((p) => ({ ...p, enabled: !p.enabled }))
    try {
      if (wasEnabled) await disableUserApi(sub)
      else            await enableUserApi(sub)
    } catch {
      setUser((p) => ({ ...p, enabled: wasEnabled }))
    } finally {
      setToggleLoading(false)
    }
  }

  const handleEditSave = async (form) => {
    try {
      const { data } = await updateUserApi(sub, {
        name:        form.name,
        familyName:  form.familyName,
        phoneNumber: form.phoneNumber,
      })
      setUser(data)
      setEditOpen(false)
    } catch (err) {
      throw err
    }
  }

  const handleReset = async () => {
    setResetLoading(true)
    try {
      await resetPasswordApi(sub)
      setResetSuccess(true)
    } catch {
      // show error
    } finally {
      setResetLoading(false)
    }
  }

  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      await deleteUserApi(sub)
      navigate('/users')
    } catch {
      setDeleteLoading(false)
    }
  }

  if (loading) return <div className="user-detail__loading">Loading…</div>
  if (notFound) return (
    <div className="user-detail__loading">
      User not found.{' '}
      <button onClick={() => navigate('/users')}
        style={{ color: 'var(--color-orange)', background: 'none', border: 'none', cursor: 'pointer' }}>
        Back to users
      </button>
    </div>
  )

  return (
    <div className="user-detail">

      <div className="user-detail__header">
        <button className="user-detail__back" onClick={() => navigate('/users')}>
          <svg viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Users
        </button>

        <div className="user-detail__title-row">
          <div className="user-detail__identity">
            <div className="user-detail__avatar">
              {`${user.name?.[0] || ''}${user.familyName?.[0] || ''}`.toUpperCase()}
            </div>
            <div>
              <div className="user-detail__name-row">
                <h1 className="user-detail__name">{user.name} {user.familyName}</h1>
                <UserRoleBadge groups={user.groups} />
              </div>
              <span className="user-detail__email">{user.email}</span>
            </div>
          </div>

          <div className="user-detail__actions">
            <button
              className={`user-detail__toggle-btn ${user.enabled ? 'user-detail__toggle-btn--active' : 'user-detail__toggle-btn--disabled'}`}
              onClick={handleToggleEnabled}
              disabled={toggleLoading}
            >
              {user.enabled ? 'Active' : 'Disabled'}
            </button>
            <button
              className="user-detail__btn user-detail__btn--ghost"
              onClick={() => setEditOpen(true)}
            >
              <svg viewBox="0 0 16 16" fill="none" className="user-detail__btn-icon">
                <path d="M2 14h2.5l7.5-7.5-2.5-2.5L2 11.5V14ZM11.5 2l2.5 2.5"
                  stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Edit
            </button>
            <button
              className="user-detail__btn user-detail__btn--reset"
              onClick={() => { setResetSuccess(false); setResetOpen(true) }}
            >
              <svg viewBox="0 0 16 16" fill="none" className="user-detail__btn-icon">
                <path d="M2 8a6 6 0 1 1 1.5 4M2 12V8h4"
                  stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Reset PW
            </button>
            <button
              className="user-detail__btn user-detail__btn--danger"
              onClick={() => setDeleteOpen(true)}
            >
              <svg viewBox="0 0 16 16" fill="none" className="user-detail__btn-icon">
                <path d="M2 4h12M5.5 4V2.5h5V4M6.5 7v5M9.5 7v5M3 4l1 9.5h8L13 4"
                  stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="user-detail__layout">
        <div className="user-detail__left">

          <div className="user-detail__card user-detail__card--status">
            <h3 className="user-detail__card-title">Account Status</h3>
            <div className="user-detail__status-row">
              <UserStatusBadge status={user.status} />
              <span className={`user-detail__enabled ${user.enabled ? 'user-detail__enabled--on' : 'user-detail__enabled--off'}`}>
                {user.enabled ? '● Active' : '○ Disabled'}
              </span>
            </div>
          </div>

          <div className="user-detail__card">
            <h3 className="user-detail__card-title">Verification</h3>
            <div className="user-detail__fields">
              <div className="user-detail__field-row">
                <span className="user-detail__field-label">Email</span>
                <span className={`user-detail__verify ${user.emailVerified ? 'user-detail__verify--ok' : 'user-detail__verify--no'}`}>
                  {user.emailVerified ? '✓ Verified' : '✗ Not verified'}
                </span>
              </div>
              <div className="user-detail__field-row">
                <span className="user-detail__field-label">Phone</span>
                <span className={`user-detail__verify ${user.phoneVerified ? 'user-detail__verify--ok' : 'user-detail__verify--no'}`}>
                  {user.phoneVerified ? '✓ Verified' : '✗ Not verified'}
                </span>
              </div>
            </div>
          </div>

          <div className="user-detail__card">
            <h3 className="user-detail__card-title">Timestamps</h3>
            <div className="user-detail__fields">
              <div className="user-detail__field-row">
                <span className="user-detail__field-label">Created</span>
                <span className="user-detail__field-value">{user.createdAt?.slice(0, 16).replace('T', ' ')}</span>
              </div>
              <div className="user-detail__field-row">
                <span className="user-detail__field-label">Updated</span>
                <span className="user-detail__field-value">{user.updatedAt?.slice(0, 16).replace('T', ' ')}</span>
              </div>
            </div>
          </div>

        </div>

        <div className="user-detail__right">

          <div className="user-detail__card">
            <h3 className="user-detail__card-title">User Information</h3>
            <div className="user-detail__fields">
              {[
                { label: 'First Name', value: user.name },
                { label: 'Last Name',  value: user.familyName },
                { label: 'Email',      value: user.email },
                { label: 'Phone',      value: user.phoneNumber },
                { label: 'Role',       value: user.groups?.includes('admin_group') ? 'Administrator' : 'Sales' },
                { label: 'User ID',    value: user.sub },
              ].map((f) => f.value && (
                <div key={f.label} className="user-detail__field-row">
                  <span className="user-detail__field-label">{f.label}</span>
                  <span className="user-detail__field-value">{f.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="user-detail__card">
            <h3 className="user-detail__card-title">Groups</h3>
            <div className="user-detail__groups">
              {user.groups?.map((g) => (
                <span key={g} className="user-detail__group-tag">{g}</span>
              ))}
            </div>
          </div>

        </div>
      </div>

      <UserEditDrawer
        open={editOpen}
        user={user}
        onClose={() => setEditOpen(false)}
        onSave={handleEditSave}
        isSelf = {false}
      />

      {/* Reset password — admin flow: just triggers API, no password input needed */}
      {resetOpen && (
        <div className="user-detail__reset-confirm">
          <div className="user-detail__reset-box">
            <div className="user-detail__reset-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M2 8a10 10 0 1 1 2.5 6.5M2 14V8h6"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            {resetSuccess ? (
              <>
                <h3 className="user-detail__reset-title">Email Sent</h3>
                <p className="user-detail__reset-desc">
                  Password reset email sent to <strong>{user.email}</strong>.
                </p>
                <button className="user-detail__reset-btn user-detail__reset-btn--primary"
                  onClick={() => setResetOpen(false)}>
                  Done
                </button>
              </>
            ) : (
              <>
                <h3 className="user-detail__reset-title">Reset Password</h3>
                <p className="user-detail__reset-desc">
                  Send a password reset email to <strong>{user.email}</strong>?
                  The user will receive a link to set a new password.
                </p>
                <div className="user-detail__reset-actions">
                  <button className="user-detail__reset-btn user-detail__reset-btn--ghost"
                    onClick={() => setResetOpen(false)} disabled={resetLoading}>
                    Cancel
                  </button>
                  <button className="user-detail__reset-btn user-detail__reset-btn--primary"
                    onClick={handleReset} disabled={resetLoading}>
                    {resetLoading ? 'Sending…' : 'Send Reset Email'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteOpen}
        title="Delete user"
        message={`Are you sure you want to delete "${user.name} ${user.familyName}"? This cannot be undone.`}
        confirmLabel="Delete"
        isDanger
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />

    </div>
  )
}