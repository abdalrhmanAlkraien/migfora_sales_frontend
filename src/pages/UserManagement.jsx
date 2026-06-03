import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUsersApi, enableUserApi, disableUserApi, deleteUserApi } from '../api/users'
import UserTable       from '../components/user/UserTable'
import InviteUserModal from '../components/user/InviteUserModal'
import './styles/UserManagement.css'

export default function UserManagement() {
  const navigate = useNavigate()

  const [users,       setUsers]       = useState([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState('')
  const [inviteOpen,  setInviteOpen]  = useState(false)
  const [search,      setSearch]      = useState('')
  const [nextToken,   setNextToken]   = useState(null)
  const [total,       setTotal]       = useState(0)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await getUsersApi({ limit: 50 })
      setUsers(data.users)
      setTotal(data.total)
      setNextToken(data.nextToken)
    } catch {
      setError('Failed to load users.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const filtered = users.filter((u) => {
    const q = search.toLowerCase()
    return !q ||
      u.name?.toLowerCase().includes(q) ||
      u.familyName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
  })

  const handleToggleEnabled = async (sub) => {
    const user = users.find((u) => u.sub === sub)
    // optimistic
    setUsers((p) => p.map((u) => u.sub === sub ? { ...u, enabled: !u.enabled } : u))
    try {
      if (user.enabled) await disableUserApi(sub)
      else              await enableUserApi(sub)
    } catch {
      // revert
      setUsers((p) => p.map((u) => u.sub === sub ? { ...u, enabled: user.enabled } : u))
    }
  }

  const handleDelete = async (sub) => {
    setUsers((p) => p.filter((u) => u.sub !== sub))
    try {
      await deleteUserApi(sub)
    } catch {
      fetchUsers()
    }
  }

  return (
    <div className="user-mgmt">
      <div className="user-mgmt__header">
        <div className="user-mgmt__title-left">
          <h1 className="user-mgmt__title">User Management</h1>
          {!loading && <span className="user-mgmt__count">{total}</span>}
        </div>
        <button className="user-mgmt__invite-btn" onClick={() => setInviteOpen(true)}>
          <svg viewBox="0 0 16 16" fill="none">
            <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Invite User
        </button>
      </div>

      {error && <div className="user-mgmt__error">{error}</div>}

      <div className="user-mgmt__search-wrap">
        <svg className="user-mgmt__search-icon" viewBox="0 0 20 20" fill="none">
          <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M13 13l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <input
          className="user-mgmt__search"
          placeholder="Search users…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button className="user-mgmt__search-clear" onClick={() => setSearch('')}>×</button>
        )}
      </div>

      {loading ? (
        <div className="user-mgmt__loading">Loading…</div>
      ) : (
        <UserTable
          users={filtered}
          onToggleEnabled={handleToggleEnabled}
          onDelete={handleDelete}
          onViewProfile={(u) => navigate(`/users/${u.sub}`)}
        />
      )}

      <InviteUserModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onInvite={() => { setInviteOpen(false); fetchUsers() }}
      />
    </div>
  )
}