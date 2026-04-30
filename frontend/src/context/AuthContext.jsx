import { createContext, useEffect, useState } from 'react'

import { authApi, setUnauthorizedHandler } from '../api/client'

const AuthContext = createContext(null)
const storageKey = 'blog-manager-session'
const emptySession = {
  token: '',
  user: null,
}

function readStoredSession() {
  try {
    const rawValue = localStorage.getItem(storageKey)

    if (!rawValue) {
      return emptySession
    }

    const parsedValue = JSON.parse(rawValue)

    if (!parsedValue?.token || !parsedValue?.user) {
      return emptySession
    }

    return parsedValue
  } catch {
    return emptySession
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession)
  const [isAuthReady, setIsAuthReady] = useState(() => !readStoredSession().token)

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setSession(emptySession)
      localStorage.removeItem(storageKey)
    })

    return () => {
      setUnauthorizedHandler(null)
    }
  }, [])

  useEffect(() => {
    if (!session.token || isAuthReady) {
      return
    }

    let ignore = false

    authApi
      .me(session.token)
      .then((data) => {
        if (ignore) {
          return
        }

        setSession({
          token: session.token,
          user: data.user,
        })
      })
      .catch(() => {
        if (ignore) {
          return
        }

        setSession(emptySession)
        localStorage.removeItem(storageKey)
      })
      .finally(() => {
        if (!ignore) {
          setIsAuthReady(true)
        }
      })

    return () => {
      ignore = true
    }
  }, [isAuthReady, session.token])

  useEffect(() => {
    if (!isAuthReady) {
      return
    }

    if (session.token && session.user) {
      localStorage.setItem(storageKey, JSON.stringify(session))
      return
    }

    localStorage.removeItem(storageKey)
  }, [isAuthReady, session])

  async function login(credentials) {
    const data = await authApi.login(credentials)
    setSession({ token: data.token, user: data.user })
    return data.user
  }

  async function register(profile) {
    const data = await authApi.register(profile)
    setSession({ token: data.token, user: data.user })
    return data.user
  }

  function logout() {
    setSession(emptySession)
  }

  return (
    <AuthContext.Provider
      value={{
        user: session.user,
        token: session.token,
        isAuthenticated: Boolean(session.token && session.user),
        isAuthReady,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext }