import Blog from '../models/Blog.js'
import User from '../models/User.js'
import { httpError } from '../utils/httpError.js'

function publicUserPayload(user, blogCount) {
  return {
    id: user._id.toString(),
    name: user.name,
    bio: user.bio,
    role: user.role,
    joinedAt: user.createdAt,
    blogCount,
  }
}

export async function getCurrentUser(req, res) {
  res.json({
    user: {
      id: req.user._id.toString(),
      name: req.user.name,
      email: req.user.email,
      bio: req.user.bio,
      role: req.user.role,
      createdAt: req.user.createdAt,
    },
  })
}

export async function getUserById(req, res, next) {
  const user = await User.findById(req.params.id).select('-password')

  if (!user) {
    return next(httpError(404, 'User not found'))
  }

  const blogCount = await Blog.countDocuments({ author: user._id })

  res.json({ user: publicUserPayload(user, blogCount) })
}