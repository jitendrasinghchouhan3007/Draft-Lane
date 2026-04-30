import { Link, NavLink, Outlet } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import BrandLogo from './BrandLogo'

function navLinkClassName({ isActive }) {
  return isActive ? 'topbar__link topbar__link--active' : 'topbar__link'
}

function AppLayout() {
  const { isAuthenticated, logout, user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const roleLabel = user?.role === 'admin' ? 'Admin' : 'Member'

  return (
    <div className="app-shell">
      <div className="topbar-shell">
        <header className="topbar">
          <div className="topbar__brand">
            <Link to="/" className="brand-mark">
              <BrandLogo />
              <span className="brand-mark__copy">
                <strong>DraftLane</strong>
                <span>Team notes, build stories, and thoughtful side threads.</span>
              </span>
            </Link>
          </div>

          <nav className="topbar__nav" aria-label="Main navigation">
            <NavLink to="/" className={navLinkClassName} end>
              Browse
            </NavLink>
            {isAuthenticated ? (
              <NavLink to="/blogs/new" className={navLinkClassName}>
                Write
              </NavLink>
            ) : null}
          </nav>

          <div className="topbar__actions">
            <button type="button" className="button button--ghost button--icon" onClick={toggleTheme}>
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
            {isAuthenticated ? (
              <>
                <div className="topbar__user">
                  <strong>{user.name}</strong>
                  <span>{roleLabel} · {user.email}</span>
                </div>
                <button type="button" className="button button--ghost" onClick={logout}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="button button--ghost">
                  Log in
                </Link>
                <Link to="/register" className="button">
                  Create account
                </Link>
              </>
            )}
          </div>
        </header>
      </div>

      <main className="page-shell">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout