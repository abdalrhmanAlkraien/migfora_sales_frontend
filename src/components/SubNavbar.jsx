import { useLocation } from 'react-router-dom'
import './styles/SubNavbar.css'

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  // add more as you build pages
}

export default function SubNavbar({ isOpen, onToggle }) {
  const location = useLocation()
  const title = PAGE_TITLES[location.pathname] || 'Page'

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
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="3" y1="6"  x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        )}
      </button>

      <div className="sub-navbar__divider" />

      {/* Page title */}
      <span className="sub-navbar__page-title">{title}</span>

    </div>
  )
}