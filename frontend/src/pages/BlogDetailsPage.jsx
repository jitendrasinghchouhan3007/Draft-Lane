import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { blogApi, commentApi } from '../api/client'
import MarkdownContent from '../components/blogs/MarkdownContent'
import CommentComposer from '../components/comments/CommentComposer'
import CommentItem from '../components/comments/CommentItem'
import { useAuth } from '../hooks/useAuth'
import { formatLongDate } from '../utils/date'

function BlogDetailsPage() {
  const navigate = useNavigate()
  const { blogId } = useParams()
  const { isAuthenticated, token, user } = useAuth()
  const [blog, setBlog] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [commentVersion, setCommentVersion] = useState(0)
  const [likePending, setLikePending] = useState(false)
  const [deletePending, setDeletePending] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    Promise.all([
      blogApi.getById(blogId, controller.signal),
      commentApi.listForBlog(blogId, controller.signal),
    ])
      .then(([blogData, commentsData]) => {
        setError('')
        setBlog(blogData.blog)
        setComments(commentsData.comments)
      })
      .catch((loadError) => {
        if (loadError.name === 'AbortError') {
          return
        }

        setError(loadError.message || 'Could not load this blog.')
      })
      .finally(() => {
        setLoading(false)
      })

    return () => {
      controller.abort()
    }
  }, [blogId, commentVersion])

  async function handleLikeToggle() {
    if (!blog || !isAuthenticated) {
      return
    }

    try {
      setError('')
      setLikePending(true)
      const result = await blogApi.toggleLike(blog.id, token)
      setBlog((currentBlog) => {
        const currentLikes = currentBlog.likes || []
        const nextLikes = result.liked
          ? [...new Set([...currentLikes, user.id])]
          : currentLikes.filter((likedUserId) => likedUserId !== user.id)

        return {
          ...currentBlog,
          likes: nextLikes,
          likeCount: result.likeCount,
        }
      })
    } catch (likeError) {
      setError(likeError.message || 'Could not update the like right now.')
    } finally {
      setLikePending(false)
    }
  }

  async function handleCommentSubmit(content) {
    await commentApi.create({ blogId, content }, token)
    setCommentVersion((currentValue) => currentValue + 1)
  }

  async function handleReply(parentCommentId, content) {
    await commentApi.create({ blogId, content, parentCommentId }, token)
    setCommentVersion((currentValue) => currentValue + 1)
  }

  async function handleDelete() {
    if (!blog || !window.confirm('Delete this blog permanently?')) {
      return
    }

    try {
      setDeletePending(true)
      await blogApi.remove(blog.id, token)
      navigate('/')
    } catch (deleteError) {
      setError(deleteError.message || 'Could not delete this blog.')
    } finally {
      setDeletePending(false)
    }
  }

  if (loading) {
    return <div className="center-panel">Loading article...</div>
  }

  if (error || !blog) {
    return (
      <section className="surface-card empty-state">
        <h2>Could not open that post.</h2>
        <p>{error || 'The blog may have been removed.'}</p>
        <Link to="/" className="text-link">
          Back to all blogs
        </Link>
      </section>
    )
  }

  const canManageBlog = Boolean(user && (blog.author?.id === user.id || user.role === 'admin'))
  const likedByUser = Boolean(user && blog.likes.includes(user.id))

  return (
    <div className="stack-lg">
      <article className="article-shell">
        <header className="article-shell__header">
          <div className="article-shell__meta">
            <p className="eyebrow">{blog.author?.name || 'Unknown author'}</p>
            <h1>{blog.title}</h1>
            <p className="article-shell__summary">Published on {formatLongDate(blog.createdAt)}</p>
          </div>

          <div className="article-shell__actions">
            <button
              type="button"
              className={likedByUser ? 'button button--secondary' : 'button button--ghost'}
              disabled={!isAuthenticated || likePending}
              onClick={handleLikeToggle}
            >
              {likedByUser ? `Liked (${blog.likeCount})` : `Like post (${blog.likeCount})`}
            </button>

            {canManageBlog ? (
              <>
                <Link to={`/blogs/${blog.id}/edit`} className="button button--ghost">
                  Edit
                </Link>
                <button type="button" className="button button--ghost" onClick={handleDelete} disabled={deletePending}>
                  {deletePending ? 'Deleting...' : 'Delete'}
                </button>
              </>
            ) : null}
          </div>
        </header>

        <div className="tag-row">
          {blog.tags.map((tag) => (
            <span key={tag} className="tag-pill">
              {tag}
            </span>
          ))}
        </div>

        <div className="article-shell__content">
          <MarkdownContent content={blog.content} className="markdown-content" />
        </div>

        <aside className="author-panel">
          <h2>Author details</h2>
          <p className="author-panel__name">{blog.author?.name || 'Unknown author'}</p>
          <p>{blog.author?.bio || 'No short bio added yet.'}</p>
          {blog.author?.joinedAt ? <p>Joined {formatLongDate(blog.author.joinedAt)}</p> : null}
        </aside>
      </article>

      <section className="surface-card comments-panel">
        <div className="section-header">
          <div>
            <p className="eyebrow">Discussion</p>
            <h2>Comments</h2>
          </div>
          <p>{comments.length} top-level threads</p>
        </div>

        {isAuthenticated ? (
          <CommentComposer
            submitLabel="Add comment"
            placeholder="Add a thoughtful comment"
            onSubmit={handleCommentSubmit}
          />
        ) : (
          <p className="login-prompt">
            <Link to="/login" className="text-link">
              Log in
            </Link>{' '}
            to comment or reply.
          </p>
        )}

        {!comments.length ? <p className="muted-copy">No comments yet. Be the first one to start the thread.</p> : null}

        <div className="comment-list">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} canReply={isAuthenticated} onReply={handleReply} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default BlogDetailsPage