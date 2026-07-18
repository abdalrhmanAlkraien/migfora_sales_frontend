import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import appConfig from '../config/appConfig'
import useAuthStore from '../store/authStore'
import { loginApi } from '../api/auth'
import './styles/Login.css'

export default function Login() {
  const navigate = useNavigate()
  const { setAuth, setChallenge } = useAuthStore()

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword]     = useState('')
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data } = await loginApi(identifier, password)
      setAuth(
        data[appConfig.auth.accessTokenKey],
        data[appConfig.auth.refreshTokenKey],
        data[appConfig.auth.idTokenKey],
        data[appConfig.auth.userKey],
        data.expiresIn ?? 3600      // ← add this
      )
      navigate('/dashboard')

    } catch (err) {
      const status = err?.response?.status
      const data   = err?.response?.data

      if (status === 428 && data?.challenge === appConfig.auth.challengeNewPassword) {
        setChallenge(data.session, identifier, password)
        navigate('/change-password')
        return
      }

      setError(
        err.response?.data?.[appConfig.auth.messageKey] ||
        'Login failed. Please check your credentials.'
      )
    } finally {
      setLoading(false)
    }
  }

  const identifierLabel = {
    email:    'Email',
    username: 'Username',
    phone:    'Phone Number',
  }[appConfig.loginIdentifier]

  const identifierType = {
    email:    'email',
    username: 'text',
    phone:    'tel',
  }[appConfig.loginIdentifier]

  return (
    <div className="login-card">

      <div className="login-card__logo">
        MIG<span>FORA</span>
      </div>

      <h1 className="login-card__title">Welcome back</h1>
      <p className="login-card__subtitle">Sign in to your account</p>

      <form onSubmit={handleSubmit} className="login-card__form">

        <div className="form-group">
          <label className="form-label">{identifierLabel}</label>
          <input
            className="form-input"
            type={identifierType}
            placeholder={`Enter your ${identifierLabel.toLowerCase()}`}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="login-card__forgot-row">
          <span
            className="login-card__forgot-link"
            onClick={() => navigate('/forgot-password')}
          >
            Forgot password?
          </span>
        </div>

        {error && <div className="form-error">{error}</div>}

        <button className="form-btn" type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

      </form>

      <p className="login-card__footer">
        Don't have an account?{' '}
        <span onClick={() => navigate('/register')}>Register</span>
      </p>

    </div>
  )
}