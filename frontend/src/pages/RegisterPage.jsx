import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'

function RegisterPage() {
  const navigate = useNavigate()
  const { isAuthenticated, register } = useAuth()
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
  })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  function handleChange(event) {
    const { name, value } = event.target
    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (formValues.password.trim().length < 6) {
      setError('Password should be at least 6 characters long.')
      return
    }

    try {
      setBusy(true)
      setError('')
      await register(formValues)
      navigate('/')
    } catch (registerError) {
      setError(registerError.message || 'Could not create your account.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="auth-card">
      <p className="eyebrow">Create account</p>
      <h1>Start your writing workspace</h1>
      <p className="auth-card__copy">Create a profile to publish blogs, manage your posts, and join comment threads.</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="field-group" htmlFor="register-name">
          <span>Name</span>
          <input
            id="register-name"
            name="name"
            type="text"
            value={formValues.name}
            onChange={handleChange}
            placeholder="Your full name"
          />
        </label>

        <label className="field-group" htmlFor="register-email">
          <span>Email</span>
          <input
            id="register-email"
            name="email"
            type="email"
            value={formValues.email}
            onChange={handleChange}
            placeholder="name@example.com"
          />
        </label>

        <label className="field-group" htmlFor="register-password">
          <span>Password</span>
          <input
            id="register-password"
            name="password"
            type="password"
            value={formValues.password}
            onChange={handleChange}
            placeholder="Choose a password"
          />
        </label>

        <label className="field-group" htmlFor="register-bio">
          <span>Short bio</span>
          <textarea
            id="register-bio"
            name="bio"
            rows="3"
            value={formValues.bio}
            onChange={handleChange}
            placeholder="Tell readers a little about yourself"
          />
        </label>

        {error ? <p className="form-error">{error}</p> : null}

        <button type="submit" className="button" disabled={busy}>
          {busy ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="auth-card__footer">
        Already registered?{' '}
        <Link to="/login" className="text-link">
          Log in here
        </Link>
      </p>
    </section>
  )
}

export default RegisterPage