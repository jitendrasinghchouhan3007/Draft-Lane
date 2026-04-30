import User from '../models/User.js'
import { generateToken } from '../utils/generateToken.js'
import { httpError } from '../utils/httpError.js'

function authUserPayload(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    bio: user.bio,
    role: user.role,
    createdAt: user.createdAt,
  }
}

export async function registerUser(req, res, next) {
  const { name, email, password, bio } = req.body

  if (!name?.trim() || !email?.trim() || !password?.trim()) {
    return next(httpError(400, 'Name, email, and password are required'))
  }

  if (password.trim().length < 6) {
    return next(httpError(400, 'Password must be at least 6 characters long'))
  }

  const existingUser = await User.findOne({ email: email.trim().toLowerCase() })

  if (existingUser) {
    return next(httpError(409, 'An account with this email already exists'))
  }

  const user = await User.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: password.trim(),
    bio: bio?.trim() || undefined,
  })

  res.status(201).json({
    token: generateToken(user._id.toString()),
    user: authUserPayload(user),
  })
}

export async function loginUser(req, res, next) {
  const { email, password } = req.body

  if (!email?.trim() || !password?.trim()) {
    return next(httpError(400, 'Email and password are required'))
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() })

  if (!user || !(await user.comparePassword(password.trim()))) {
    return next(httpError(401, 'Invalid email or password'))
  }

  res.json({
    token: generateToken(user._id.toString()),
    user: authUserPayload(user),
  })
}