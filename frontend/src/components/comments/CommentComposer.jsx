import { useState } from 'react'

function CommentComposer({ onSubmit, submitLabel, placeholder, onCancel, compact = false }) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    if (!content.trim()) {
      setError('Write a comment before posting it.')
      return
    }

    try {
      setIsSubmitting(true)
      setError('')
      await onSubmit(content.trim())
      setContent('')
    } catch (submitError) {
      setError(submitError.message || 'Could not save your comment.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className={compact ? 'comment-composer comment-composer--compact' : 'comment-composer'} onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        rows={compact ? 3 : 4}
        placeholder={placeholder}
      />

      {error ? <p className="form-error">{error}</p> : null}

      <div className="comment-composer__actions">
        <button type="submit" className="button" disabled={isSubmitting}>
          {isSubmitting ? 'Posting...' : submitLabel}
        </button>
        {onCancel ? (
          <button type="button" className="button button--ghost" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  )
}

export default CommentComposer