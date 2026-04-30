import { useState } from 'react'

import { formatDateTime } from '../../utils/date'
import CommentComposer from './CommentComposer'

function CommentItem({ comment, canReply, onReply }) {
  const [isReplying, setIsReplying] = useState(false)

  async function handleReply(content) {
    await onReply(comment.id, content)
    setIsReplying(false)
  }

  return (
    <article className="comment-card">
      <header className="comment-card__header">
        <div>
          <strong>{comment.author?.name || 'Unknown reader'}</strong>
          <p>{comment.author?.bio || 'Joined the discussion.'}</p>
        </div>
        <time dateTime={comment.createdAt}>{formatDateTime(comment.createdAt)}</time>
      </header>

      <p className="comment-card__content">{comment.content}</p>

      {canReply ? (
        <button type="button" className="text-link" onClick={() => setIsReplying((currentValue) => !currentValue)}>
          {isReplying ? 'Hide reply box' : 'Reply'}
        </button>
      ) : null}

      {isReplying ? (
        <CommentComposer
          compact
          submitLabel="Post reply"
          placeholder={`Reply to ${comment.author?.name || 'this comment'}`}
          onSubmit={handleReply}
          onCancel={() => setIsReplying(false)}
        />
      ) : null}

      {comment.replies.length ? (
        <div className="comment-list__children">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} canReply={canReply} onReply={onReply} />
          ))}
        </div>
      ) : null}
    </article>
  )
}

export default CommentItem