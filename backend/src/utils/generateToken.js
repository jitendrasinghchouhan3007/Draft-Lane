import jwt from 'jsonwebtoken'

import { getJwtSecret } from './jwt.js'

export function generateToken(userId) {
  return jwt.sign({ userId }, getJwtSecret(), {
    expiresIn: '7d',
  })
}