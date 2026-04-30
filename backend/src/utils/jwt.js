const demoJwtSecret = 'blog-management-local-dev-secret'

let hasWarnedAboutDefaultSecret = false

export function getJwtSecret() {
  const envSecret = process.env.JWT_SECRET?.trim()

  if (envSecret && envSecret !== 'replace-this-before-deploying') {
    return envSecret
  }

  if (!hasWarnedAboutDefaultSecret && process.env.NODE_ENV !== 'test') {
    console.warn('JWT_SECRET is missing or still using the placeholder value. Falling back to a local development secret.')
    hasWarnedAboutDefaultSecret = true
  }

  return demoJwtSecret
}