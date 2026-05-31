import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import SubNavbar from '../components/SubNavbar'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'
import './styles/AppLayout.css'

const SIDEBAR_KEY = 'migfora_sidebar_open'

function isMobile() {
  return window.innerWidth < 768
}

function getInitialSidebarState() {
  if (isMobile()) return false
  const saved = localStorage.getItem(SIDEBAR_KEY)
  // default open if no saved state
  return saved === null ? true : saved === 'true'
}

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(getInitialSidebarState)

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!isMobile()) {
      localStorage.setItem(SIDEBAR_KEY, sidebarOpen)
    }
  }, [sidebarOpen])

  // On resize — if goes mobile, close sidebar
  useEffect(() => {
    const handleResize = () => {
      if (isMobile()) setSidebarOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleToggle = () => setSidebarOpen(prev => !prev)

  return (
    <div className="app-layout">

      <Navbar />

      <SubNavbar
        isOpen={sidebarOpen}
        onToggle={handleToggle}
      />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

    <main className={`app-layout__main ${sidebarOpen ? 'app-layout__main--shifted' : ''}`}>
      {children}
    </main>

    <footer className={`app-layout__footer-wrapper ${sidebarOpen ? 'app-layout__footer-wrapper--shifted' : ''}`}>
      <Footer />
    </footer>
    </div>
  )
}