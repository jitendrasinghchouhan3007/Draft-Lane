import Blog from '../models/Blog.js'
import Comment from '../models/Comment.js'
import { buildCommentTree } from '../utils/commentTree.js'
import { httpError } from '../utils/httpError.js'

function commentPayload(comment) {
  return {
    id: comment._id.toString(),
    blog: comment.blog.toString(),
    parentComment: comment.parentComment ? comment.parentComment.toString() : null,
    content: comment.content,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    author: comment.author
      ? {
          id: comment.author._id.toString(),
          name: comment.author.name,
          bio: comment.author.bio,
        }
      : null,
  }
}

export async function listCommentsForBlog(req, res, next) {
  const blogExists = await Blog.exists({ _id: req.params.blogId })

  if (!blogExists) {
    return next(httpError(404, 'Blog not found'))
  }

  const comments = await Comment.find({ blog: req.params.blogId })
    .populate('author', 'name bio')
    .sort({ createdAt: 1 })

  res.json({ comments: buildCommentTree(comments) })
}

export async function createComment(req, res, next) {
  const { blogId, content, parentCommentId } = req.body

  if (!blogId || !content?.trim()) {
    return next(httpError(400, 'Blog id and comment content are required'))
  }

  const blog = await Blog.findById(blogId)

  if (!blog) {
    return next(httpError(404, 'Blog not found'))
  }

  if (parentCommentId) {
    const parentComment = await Comment.findById(parentCommentId)

    if (!parentComment || parentComment.blog.toString() !== blogId) {
      return next(httpError(400, 'Reply target is invalid'))
    }
  }

  const comment = await Comment.create({
    blog: blogId,
    author: req.user._id,
    content: content.trim(),
    parentComment: parentCommentId || null,
  })

  await comment.populate('author', 'name bio')

  res.status(201).json({ comment: commentPayload(comment) })
}