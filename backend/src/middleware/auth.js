import jwt from 'jsonwebtoken'

import User from '../models/User.js'
import { httpError } from '../utils/httpError.js'
import { getJwtSecret } from '../utils/jwt.js'

function getTokenFromRequest(req) {
  const authHeader = req.headers.authorization || ''

  if (!authHeader.startsWith('Bearer ')) {
    return null
  }

  return authHeader.slice(7)
}

export async function protect(req, res, next) {
  const token = getTokenFromRequest(req)

  if (!token) {
    return next(httpError(401, 'Authentication required'))
  }

  try {
    const payload = jwt.verify(token, getJwtSecret())
    const user = await User.findById(payload.userId).select('-password')

    if (!user) {
      return next(httpError(401, 'User no longer exists'))
    }

    req.user = user
    next()
  } catch {
    next(httpError(401, 'Invalid token'))
  }
}