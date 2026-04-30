import { BrowserRouter, Route, Routes } from 'react-router-dom'

import './styles/app.css'

import AppLayout from './components/AppLayout'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import BlogDetailsPage from './pages/BlogDetailsPage'
import BlogEditorPage from './pages/BlogEditorPage'
import BlogListPage from './pages/BlogListPage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import RegisterPage from './pages/RegisterPage'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<BlogListPage />} />
              <Route path="blogs/:blogId" element={<BlogDetailsPage />} />
              <Route
                path="blogs/new"
                element={
                  <ProtectedRoute>
                    <BlogEditorPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="blogs/:blogId/edit"
                element={
                  <ProtectedRoute>
                    <BlogEditorPage />
                  </ProtectedRoute>
                }
              />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
