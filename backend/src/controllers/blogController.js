import Blog from '../models/Blog.js'
import Comment from '../models/Comment.js'
import { httpError } from '../utils/httpError.js'
import { getExcerpt, normalizeTags } from '../utils/text.js'

function disableResponseCaching(res) {
  res.set({
    'Cache-Control': 'no-store, max-age=0',
    'CDN-Cache-Control': 'no-store',
    'Vercel-CDN-Cache-Control': 'no-store',
  })
}

function formatAuthor(author) {
  if (!author) {
    return null
  }

  return {
    id: author._id.toString(),
    name: author.name,
    bio: author.bio,
    joinedAt: author.createdAt,
  }
}

function blogPreviewPayload(blog) {
  return {
    id: blog._id.toString(),
    title: blog.title,
    excerpt: blog.excerpt,
    createdAt: blog.createdAt,
    updatedAt: blog.updatedAt,
    tags: blog.tags,
    likeCount: blog.likes.length,
    author: formatAuthor(blog.author),
  }
}

function blogDetailsPayload(blog) {
  return {
    ...blogPreviewPayload(blog),
    content: blog.content,
    likes: blog.likes.map((userId) => userId.toString()),
    author: formatAuthor(blog.author),
  }
}

function canManageBlog(user, blog) {
  return user.role === 'admin' || blog.author.toString() === user._id.toString()
}

function validateBlogInput(title, content, next) {
  if (!title?.trim() || !content?.trim()) {
    next(httpError(400, 'Title and content are required'))
    return false
  }

  if (content.trim().length < 30) {
    next(httpError(400, 'Content should be at least 30 characters long'))
    return false
  }

  return true
}

export async function listBlogs(req, res) {
  disableResponseCaching(res)

  const page = Math.max(Number.parseInt(req.query.page || '1', 10), 1)
  const limit = Math.min(Math.max(Number.parseInt(req.query.limit || '6', 10), 1), 12)
  const search = req.query.search?.trim()
  const tag = req.query.tag?.trim().toLowerCase()
  const filter = {}

  if (search) {
    filter.title = { $regex: search, $options: 'i' }
  }

  if (tag) {
    filter.tags = tag
  }

  const [blogs, totalBlogs, tags] = await Promise.all([
    Blog.find(filter)
      .populate('author', 'name bio')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Blog.countDocuments(filter),
    Blog.distinct('tags'),
  ])

  res.json({
    blogs: blogs.map(blogPreviewPayload),
    pagination: {
      page,
      limit,
      totalBlogs,
      totalPages: Math.max(1, Math.ceil(totalBlogs / limit)),
    },
    tags: tags.filter(Boolean).sort(),
  })
}

export async function getBlogById(req, res, next) {
  disableResponseCaching(res)

  const blog = await Blog.findById(req.params.id).populate('author', 'name bio createdAt')

  if (!blog) {
    return next(httpError(404, 'Blog not found'))
  }

  res.json({ blog: blogDetailsPayload(blog) })
}

export async function createBlog(req, res, next) {
  const { title, content, tags } = req.body

  if (!validateBlogInput(title, content, next)) {
    return
  }

  const blog = await Blog.create({
    title: title.trim(),
    content: content.trim(),
    excerpt: getExcerpt(content),
    tags: normalizeTags(tags),
    author: req.user._id,
  })

  await blog.populate('author', 'name bio createdAt')

  res.status(201).json({ blog: blogDetailsPayload(blog) })
}

export async function updateBlog(req, res, next) {
  const { title, content, tags } = req.body

  if (!validateBlogInput(title, content, next)) {
    return
  }

  const blog = await Blog.findById(req.params.id)

  if (!blog) {
    return next(httpError(404, 'Blog not found'))
  }

  if (!canManageBlog(req.user, blog)) {
    return next(httpError(403, 'Only the author or an admin can edit this blog'))
  }

  blog.title = title.trim()
  blog.content = content.trim()
  blog.excerpt = getExcerpt(content)
  blog.tags = normalizeTags(tags)
  await blog.save()
  await blog.populate('author', 'name bio createdAt')

  res.json({ blog: blogDetailsPayload(blog) })
}

export async function deleteBlog(req, res, next) {
  const blog = await Blog.findById(req.params.id)

  if (!blog) {
    return next(httpError(404, 'Blog not found'))
  }

  if (!canManageBlog(req.user, blog)) {
    return next(httpError(403, 'Only the author or an admin can delete this blog'))
  }

  await Comment.deleteMany({ blog: blog._id })
  await blog.deleteOne()

  res.json({ message: 'Blog deleted successfully' })
}

export async function toggleLike(req, res, next) {
  const blog = await Blog.findById(req.params.id)

  if (!blog) {
    return next(httpError(404, 'Blog not found'))
  }

  const alreadyLiked = blog.likes.some((userId) => userId.toString() === req.user._id.toString())

  if (alreadyLiked) {
    blog.likes = blog.likes.filter((userId) => userId.toString() !== req.user._id.toString())
  } else {
    blog.likes.push(req.user._id)
  }

  await blog.save()

  res.json({
    liked: !alreadyLiked,
    likeCount: blog.likes.length,
  })
}
