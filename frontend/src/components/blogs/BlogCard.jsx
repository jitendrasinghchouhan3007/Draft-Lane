import { Link } from 'react-router-dom'

import { formatDate } from '../../utils/date'

function BlogCard({ blog }) {
  return (
    <article className="blog-card">
      <div className="blog-card__eyebrow">
        <span>{formatDate(blog.createdAt)}</span>
        <span>{blog.likeCount} likes</span>
      </div>

      <div className="blog-card__content">
        <p className="blog-card__author">By {blog.author?.name || 'Unknown author'}</p>
        <h2>
          <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
        </h2>
        <p className="blog-card__excerpt">{blog.excerpt}</p>
      </div>

      <div className="blog-card__footer">
        <div className="tag-row">
          {blog.tags.map((tag) => (
            <span key={tag} className="tag-pill">
              {tag}
            </span>
          ))}
        </div>

        <Link to={`/blogs/${blog.id}`} className="text-link">
          Read article
        </Link>
      </div>
    </article>
  )
}

export default BlogCard