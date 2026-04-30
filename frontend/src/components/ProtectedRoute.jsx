import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'

function ProtectedRoute({ children }) {
  const location = useLocation()
  const { isAuthenticated, isAuthReady } = useAuth()

  if (!isAuthReady) {
    return <div className="center-panel">Checking your session...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}

export default ProtectedRoute