import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'

function LoginPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const nextPath = location.state?.from || '/'

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      setBusy(true)
      setError('')
      await login({ email, password })
      navigate(nextPath, { replace: true })
    } catch (loginError) {
      setError(loginError.message || 'Could not log you in.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="auth-card">
      <p className="eyebrow">Welcome back</p>
      <h1>Log in to continue writing</h1>
      <p className="auth-card__copy">Use your account to publish blogs, like posts, and reply in comment threads.</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="field-group" htmlFor="login-email">
          <span>Email</span>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@example.com"
          />
        </label>

        <label className="field-group" htmlFor="login-password">
          <span>Password</span>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
          />
        </label>

        {error ? <p className="form-error">{error}</p> : null}

        <button type="submit" className="button" disabled={busy}>
          {busy ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <p className="auth-card__footer">
        Need an account?{' '}
        <Link to="/register" className="text-link">
          Register here
        </Link>
      </p>
    </section>
  )
}

export default LoginPage