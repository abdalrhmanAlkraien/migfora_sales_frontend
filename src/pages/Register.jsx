import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import appConfig from '../config/appConfig'
import { registerApi } from '../api/auth'
import './styles/Register.css'
import './styles/Login.css'

export default function Register() {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    fullName:        '',
    username:        '',
    email:           '',
    phone:           '',
    password:        '',
    confirmPassword: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Confirm password check
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const body = {
        fullName: form.fullName,
        username: form.username,
        email:    form.email,
        phone:    form.phone,
        password: form.password,
      }

      const res = await registerApi(body)

      setSuccess(
        res.data?.[appConfig.auth.messageKey] || 'Registration successful!'
      )

      // Redirect to login after short delay
      setTimeout(() => navigate('/login'), 1500)

    } catch (err) {
      setError(
        err.response?.data?.[appConfig.auth.messageKey] ||
        'Registration failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-card">

      {/* Logo */}
      <div className="register-card__logo">
        MIG<span>FORA</span>
      </div>

      <h1 className="register-card__title">Create account</h1>
      <p className="register-card__subtitle">Fill in your details to get started</p>

      <form onSubmit={handleSubmit} className="register-card__form">

        {/* Row 1 — Full Name + Username */}
        <div className="register-card__row">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className="form-input"
              type="text"
              name="fullName"
              placeholder="John Doe"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              className="form-input"
              type="text"
              name="username"
              placeholder="johndoe"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Row 2 — Email + Phone */}
        <div className="register-card__row">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              name="email"
              placeholder="john@email.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              className="form-input"
              type="tel"
              name="phone"
              placeholder="+966 5X XXX XXXX"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Row 3 — Password + Confirm Password */}
        <div className="register-card__row">
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              name="password"
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={handleChange}
              required
              minLength={8}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              className="form-input"
              type="password"
              name="confirmPassword"
              placeholder="Repeat password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {error   && <div className="form-error">{error}</div>}
        {success && <div className="register-card__success">{success}</div>}

        <button className="form-btn" type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

      </form>

      <p className="register-card__footer">
        Already have an account?{' '}
        <span onClick={() => navigate('/login')}>Sign in</span>
      </p>

    </div>
  )
}