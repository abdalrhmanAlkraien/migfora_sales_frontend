import './styles/UserRoleBadge.css'

export default function UserRoleBadge({ groups }) {
  const isAdmin = groups?.includes('admin_group')
  return (
    <span className={`user-role-badge ${isAdmin ? 'user-role-badge--admin' : 'user-role-badge--sales'}`}>
      {isAdmin ? 'Admin' : 'Sales'}
    </span>
  )
}