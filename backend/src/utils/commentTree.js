function formatAuthor(author) {
  if (!author) {
    return null
  }

  return {
    id: author._id.toString(),
    name: author.name,
    bio: author.bio,
  }
}

function formatComment(comment) {
  return {
    id: comment._id.toString(),
    blog: comment.blog.toString(),
    parentComment: comment.parentComment ? comment.parentComment.toString() : null,
    content: comment.content,
    author: formatAuthor(comment.author),
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    replies: [],
  }
}

export function buildCommentTree(comments) {
  const nodes = comments.map(formatComment)
  const nodeMap = new Map(nodes.map((comment) => [comment.id, comment]))
  const roots = []

  for (const comment of nodes) {
    if (comment.parentComment && nodeMap.has(comment.parentComment)) {
      nodeMap.get(comment.parentComment).replies.push(comment)
      continue
    }

    roots.push(comment)
  }

  return roots
}