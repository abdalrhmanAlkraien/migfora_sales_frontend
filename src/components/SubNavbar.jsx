import { useLocation, matchPath } from 'react-router-dom'
import './styles/SubNavbar.css'

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/comapnies': 'Companies',
  '/companies/new': 'New Company',

  // add more as you build pages
}

const DYNAMIC_TITLES = [
  { pattern: '/companies/:id/contacts', title: 'Contacts' },
  { pattern: '/companies/:id/reports', title: 'Reports' },
  { pattern: '/companies/:id', title: 'Company Profile' },
  { pattern: '/investigations/:id/lab', title: 'Investigation Lab' },
  { pattern: '/investigations/:id', title: 'Investigation' },
  { pattern: '/reports/:id', title: 'Report' },
  { pattern: '/companies/:id/contacts/new', title: 'New Contact' },
  { pattern: '/companies/:id/contacts', title: 'Contacts' },
  { pattern: '/contacts/:id', title: 'Contact' },
  { pattern: '/companies/:id/reports', title: 'Reports' },
  { pattern: '/reports/:id', title: 'Report' },
  { pattern: '/users', title: 'User Management' },
  { pattern: '/profile', title: 'My Profile' },
  { pattern: '/users/:sub', title: 'User Details' },
  { pattern: '/admin/jobs', title: 'Admin Jobs' },
  { pattern: '/companies/:id/platforms', title: 'Platforms' },
  { pattern: '/companies/:id/platforms/new', title: 'New Platform' },
  { pattern: '/platforms/:id/investigations', title: 'Investigations' },
  { pattern: '/platforms/:id/investigations/new', title: 'New Investigation' },
  { pattern: '/platforms/:id/reports', title: 'Reports' },
  { pattern: '/platforms/:id', title: 'Platform' },
  { pattern: '/lookup', title: 'Lookups' },

]

export default function SubNavbar({ isOpen, onToggle }) {
  const location = useLocation()

  const getPageTitle = () => {
    // exact match first
    if (PAGE_TITLES[location.pathname]) return PAGE_TITLES[location.pathname]

    // dynamic routes
    for (const { pattern, title } of DYNAMIC_TITLES) {
      if (matchPath(pattern, location.pathname)) return title
    }

    return ''
  }

  const pageTitle = getPageTitle()
  const title = getPageTitle() || 'Page'

  return (
    <div className={`sub-navbar ${isOpen ? 'sub-navbar--shifted' : ''}`}>

      {/* Toggle button */}
      <button
        className={`sub-navbar__toggle ${isOpen ? 'sub-navbar__toggle--open' : ''}`}
        onClick={onToggle}
        title={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isOpen ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>

      <div className="sub-navbar__divider" />

      {/* Page title */}
      <span className="sub-navbar__page-title">{title}</span>

    </div>
  )
}