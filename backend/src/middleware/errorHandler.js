import { httpError } from '../utils/httpError.js'

export function notFound(req, res, next) {
  next(httpError(404, `Route ${req.originalUrl} not found`))
}

export function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || (error.name === 'CastError' ? 400 : 500)
  const message = error.message || 'Something went wrong'

  if (statusCode >= 500) {
    console.error(error)
  }

  res.status(statusCode).json({ message })
}