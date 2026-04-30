const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()
const isLocalHost =
  typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname)
const apiBaseUrl = import.meta.env.PROD && !isLocalHost ? '/api' : configuredApiBaseUrl || '/api'
let unauthorizedHandler = null

function buildUnexpectedResponseMessage(contentType) {
  if (contentType.includes('text/html')) {
    if (apiBaseUrl === '/api') {
      return 'The app reached HTML instead of the API. On Vercel, set VITE_API_BASE_URL to your deployed backend URL ending in /api so the frontend rewrite can proxy /api correctly.'
    }

    return `The app reached HTML instead of the API. Set VITE_API_BASE_URL to your deployed backend URL ending in /api. Current base: ${apiBaseUrl}`
  }

  return 'The API returned an unexpected response format.'
}

function buildQueryString(params) {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, value)
    }
  })

  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
}

async function request(path, options = {}) {
  const { method = 'GET', token, body, signal } = options
  const headers = {}

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    method,
    headers,
    signal,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const contentType = response.headers.get('content-type') || ''
  const isJsonResponse = contentType.includes('application/json')
  const payload = isJsonResponse ? await response.json() : null

  if (response.status === 401 && token && unauthorizedHandler) {
    unauthorizedHandler()
  }

  if (!response.ok) {
    throw new Error(payload?.message || 'Request failed. Please try again.')
  }

  if (!isJsonResponse) {
    throw new Error(buildUnexpectedResponseMessage(contentType))
  }

  return payload
}

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler
}

export const authApi = {
  login: (credentials) => request('/auth/login', { method: 'POST', body: credentials }),
  register: (profile) => request('/auth/register', { method: 'POST', body: profile }),
  me: (token) => request('/users/me', { token }),
}

export const blogApi = {
  list: ({ page = 1, limit = 6, search = '', tag = '', signal } = {}) =>
    request(
      `/blogs${buildQueryString({
        page,
        limit,
        search,
        tag,
      })}`,
      { signal },
    ),
  getById: (blogId, signal) => request(`/blogs/${blogId}`, { signal }),
  create: (payload, token) => request('/blogs', { method: 'POST', token, body: payload }),
  update: (blogId, payload, token) =>
    request(`/blogs/${blogId}`, { method: 'PUT', token, body: payload }),
  remove: (blogId, token) => request(`/blogs/${blogId}`, { method: 'DELETE', token }),
  toggleLike: (blogId, token) => request(`/blogs/${blogId}/like`, { method: 'PATCH', token }),
}

export const commentApi = {
  listForBlog: (blogId, signal) => request(`/comments/blog/${blogId}`, { signal }),
  create: (payload, token) => request('/comments', { method: 'POST', token, body: payload }),
}
