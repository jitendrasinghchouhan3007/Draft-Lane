import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { blogApi } from '../api/client'
import BlogForm from '../components/blogs/BlogForm'
import { useAuth } from '../hooks/useAuth'

const blankValues = {
  title: '',
  tags: '',
  content: '',
}

function BlogEditorPage() {
  const navigate = useNavigate()
  const { blogId } = useParams()
  const { token, user } = useAuth()
  const isEditing = Boolean(blogId)

  const [initialValues, setInitialValues] = useState(blankValues)
  const [loading, setLoading] = useState(() => Boolean(blogId))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [blocked, setBlocked] = useState(false)

  useEffect(() => {
    if (!isEditing) {
      return
    }

    const controller = new AbortController()

    blogApi
      .getById(blogId, controller.signal)
      .then((data) => {
        setError('')
        setBlocked(false)

        if (data.blog.author?.id !== user?.id && user?.role !== 'admin') {
          setBlocked(true)
          setError('Only the author or an admin can edit this post.')
          return
        }

        setInitialValues({
          title: data.blog.title,
          tags: data.blog.tags.join(', '),
          content: data.blog.content,
        })
      })
      .catch((loadError) => {
        if (loadError.name === 'AbortError') {
          return
        }

        setError(loadError.message || 'Could not load this post for editing.')
      })
      .finally(() => {
        setLoading(false)
      })

    return () => {
      controller.abort()
    }
  }, [blogId, isEditing, user?.id, user?.role])

  async function handleSubmit(values) {
    try {
      setBusy(true)
      setError('')

      const payload = {
        title: values.title,
        tags: values.tags,
        content: values.content,
      }

      const data = isEditing
        ? await blogApi.update(blogId, payload, token)
        : await blogApi.create(payload, token)

      navigate(`/blogs/${data.blog.id}`)
    } catch (saveError) {
      setError(saveError.message || 'Could not save this post.')
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
    return <div className="center-panel">Preparing the editor...</div>
  }

  if (blocked) {
    return (
      <section className="surface-card empty-state">
        <h2>Editing is restricted</h2>
        <p>{error}</p>
        <Link to="/" className="text-link">
          Back to all blogs
        </Link>
      </section>
    )
  }

  return (
    <section className="surface-card editor-shell">
      <div className="section-header">
        <div>
          <p className="eyebrow">{isEditing ? 'Update blog' : 'Create blog'}</p>
          <h1>{isEditing ? 'Refine your post' : 'Start a new post'}</h1>
        </div>
        <p>Keep the writing clear. Tags are optional but helpful for filtering.</p>
      </div>

      <BlogForm
        initialValues={initialValues}
        submitLabel={isEditing ? 'Save changes' : 'Publish blog'}
        onSubmit={handleSubmit}
        busy={busy}
        error={error}
      />
    </section>
  )
}

export default BlogEditorPage