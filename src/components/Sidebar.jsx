import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import './styles/Sidebar.css'

const BASE_NAV = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    label: 'Companies',
    path: '/companies',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 21V7l9-4 9 4v14"/><path d="M9 21v-6h6v6"/>
        <path d="M9 9h.01M15 9h.01M9 13h.01M15 13h.01"/>
      </svg>
    ),
  },
]

const ADMIN_NAV = [
  {
    label: 'Users',
    path: '/users',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="7" r="4"/>
        <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        <path d="M21 21v-2a4 4 0 0 0-3-3.87"/>
      </svg>
    ),
  },
  {
    label: 'Admin Jobs',
    path:  '/admin/jobs',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2Z"/>
        <path d="M10 8l6 4-6 4V8Z" fill="currentColor"/>
      </svg>
    ),
  },  
]

const BOTTOM_NAV = [
  {
    label: 'My Profile',
    path: '/profile',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      </svg>
    ),
  },
]

export default function Sidebar({ isOpen, onClose }) {
  const user    = useAuthStore((s) => s.user)
  const groups  = user?.['cognito:groups'] || user?.groups || []
  const isAdmin = groups.includes('admin_group')

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const navItems = [...BASE_NAV, ...(isAdmin ? ADMIN_NAV : [])]

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar--open' : 'sidebar--closed'}`}>

      <div className="sidebar__header">
        <span className="sidebar__logo">
          MIG<span className="sidebar__logo-accent">FORA</span>
        </span>
      </div>

      <nav className="sidebar__nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar__nav-link ${isActive ? 'sidebar__nav-link--active' : ''}`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__bottom-nav">
        {BOTTOM_NAV.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar__nav-link ${isActive ? 'sidebar__nav-link--active' : ''}`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="sidebar__footer">
        © {new Date().getFullYear()} MIGFORA
      </div>

    </aside>
  )
}