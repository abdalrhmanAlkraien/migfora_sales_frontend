import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import './styles/Navbar.css'

export default function Navbar() {
  const navigate = useNavigate()
  const { token, clearAuth } = useAuthStore()

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  return (
    <nav className="navbar">

      {/* Left — Logo always visible */}
      <Link to="/dashboard" className="navbar__logo">
        MIG<span className="navbar__logo-accent">FORA</span>
      </Link>

      {/* Right — Actions */}
      <div className="navbar__actions">

        <button className="navbar__icon-btn" title="Settings">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>

        {token ? (
          <button className="navbar__btn-outline" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <button className="navbar__btn-primary" onClick={() => navigate('/login')}>
            Login
          </button>
        )}

      </div>
    </nav>
  )
}