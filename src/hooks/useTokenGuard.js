import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const CHECK_INTERVAL = 30 * 1000 // 30 seconds

export default function useTokenGuard() {
  const navigate  = useNavigate()
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const token     = useAuthStore((s) => s.token)

  useEffect(() => {
    if (!token) return

    const check = () => {
      const expiry = Number(localStorage.getItem('migfora_token_expiry') || 0)
      if (!expiry) return

      const now = Date.now()
      if (now >= expiry) {
        clearAuth()
        navigate('/login', { replace: true })
      }
    }

    // check immediately on mount
    check()

    const interval = setInterval(check, CHECK_INTERVAL)
    return () => clearInterval(interval)
  }, [token, navigate, clearAuth])
}