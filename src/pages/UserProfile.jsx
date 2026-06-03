import { useState, useEffect } from 'react'
import { getMeApi, updateUserApi } from '../api/users'
import UserRoleBadge     from '../components/user/UserRoleBadge'
import UserStatusBadge   from '../components/user/UserStatusBadge'
import UserEditDrawer    from '../components/user/UserEditDrawer'
import ResetPasswordModal from '../components/user/ResetPasswordModal'
import './styles/UserProfile.css'

export default function UserProfile() {
  const [user,      setUser]      = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [editOpen,  setEditOpen]  = useState(false)
  const [resetOpen, setResetOpen] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getMeApi()
        setUser(data)
      } catch {
        // fallback to auth store
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const handleEditSave = async (form) => {
    try {
      const { data } = await updateUserApi(user.sub, {
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

  if (loading) return <div className="user-profile__loading">Loading…</div>
  if (!user)   return <div className="user-profile__loading">Failed to load profile.</div>

  const groups  = user.groups || []

  return (
    <div className="user-profile">

      <div className="user-profile__header">
        <h1 className="user-profile__title">My Profile</h1>
      </div>

      <div className="user-profile__layout">

        <div className="user-profile__left">
          <div className="user-profile__card user-profile__card--identity">
            <div className="user-profile__avatar">
              {`${user.name?.[0] || ''}${user.familyName?.[0] || ''}`.toUpperCase() || 'U'}
            </div>
            <h2 className="user-profile__name">{user.name} {user.familyName}</h2>
            <p className="user-profile__email">{user.email}</p>
            <div className="user-profile__badges">
              <UserRoleBadge groups={groups} />
              <UserStatusBadge status={user.status || 'CONFIRMED'} />
            </div>
          </div>

          <button className="user-profile__edit-btn" onClick={() => setEditOpen(true)}>
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M2 14h2.5l7.5-7.5-2.5-2.5L2 11.5V14ZM11.5 2l2.5 2.5"
                stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Edit Profile
          </button>

          <button className="user-profile__reset-btn" onClick={() => setResetOpen(true)}>
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M2 8a6 6 0 1 1 1.5 4M2 12V8h4"
                stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Change Password
          </button>
        </div>

        <div className="user-profile__right">
          <div className="user-profile__card">
            <h3 className="user-profile__card-title">Account Information</h3>
            <div className="user-profile__fields">
              {[
                { label: 'First Name', value: user.name },
                { label: 'Last Name',  value: user.familyName },
                { label: 'Email',      value: user.email },
                { label: 'Phone',      value: user.phoneNumber },
                { label: 'Role',       value: groups.includes('admin_group') ? 'Administrator' : 'Sales' },
                { label: 'User ID',    value: user.sub },
              ].map((f) => f.value && (
                <div key={f.label} className="user-profile__field-row">
                  <span className="user-profile__field-label">{f.label}</span>
                  <span className="user-profile__field-value">{f.value}</span>
                </div>
              ))}
            </div>
          </div>

          {(user.emailVerified !== undefined || user.phoneVerified !== undefined) && (
            <div className="user-profile__card">
              <h3 className="user-profile__card-title">Verification Status</h3>
              <div className="user-profile__fields">
                {user.emailVerified !== undefined && (
                  <div className="user-profile__field-row">
                    <span className="user-profile__field-label">Email</span>
                    <span className={`user-profile__verify ${user.emailVerified ? 'user-profile__verify--ok' : 'user-profile__verify--no'}`}>
                      {user.emailVerified ? '✓ Verified' : '✗ Not verified'}
                    </span>
                  </div>
                )}
                {user.phoneVerified !== undefined && (
                  <div className="user-profile__field-row">
                    <span className="user-profile__field-label">Phone</span>
                    <span className={`user-profile__verify ${user.phoneVerified ? 'user-profile__verify--ok' : 'user-profile__verify--no'}`}>
                      {user.phoneVerified ? '✓ Verified' : '✗ Not verified'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>

      <UserEditDrawer
        open={editOpen}
        user={user}
        onClose={() => setEditOpen(false)}
        onSave={handleEditSave}
        isSelf
      />

      <ResetPasswordModal
        open={resetOpen}
        user={user}
        isAdmin={false}
        onClose={() => setResetOpen(false)}
        onReset={() => setResetOpen(false)}
      />

    </div>
  )
}