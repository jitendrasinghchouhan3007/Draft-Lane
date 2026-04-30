import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="surface-card empty-state">
      <p className="eyebrow">404</p>
      <h1>That page is not available.</h1>
      <p>The link may be outdated, or the page may have been removed.</p>
      <Link to="/" className="text-link">
        Go back to the blog list
      </Link>
    </section>
  )
}

export default NotFoundPage