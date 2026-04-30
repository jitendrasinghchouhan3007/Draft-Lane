import mongoose from 'mongoose'

const defaultMongoUri = 'mongodb://127.0.0.1:27017/blog-management-system'
let connectionPromise = null

function maskMongoUri(mongoUri) {
  return mongoUri.replace(/\/\/([^:/?#]+):([^@/]+)@/, '//$1:***@')
}

function validateMongoUri(mongoUri) {
  if (!mongoUri) {
    throw new Error(
      'MONGODB_URI is empty. Set it to a local MongoDB URI or an Atlas connection string.',
    )
  }

  if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
    throw new Error('MONGODB_URI must start with mongodb:// or mongodb+srv://')
  }

  if (/^mongodb\+srv:\/\/(127\.0\.0\.1|localhost)(:\d+)?(\/|$)/i.test(mongoUri)) {
    throw new Error(
      'MONGODB_URI uses mongodb+srv:// with a local host. Use mongodb://127.0.0.1:27017/<database> for local MongoDB, or use your Atlas cluster host without a port for mongodb+srv://.',
    )
  }

  if (/^mongodb\+srv:\/\/[^/]+:\d+(\/|$)/i.test(mongoUri)) {
    throw new Error('MONGODB_URI uses mongodb+srv:// with a port. Atlas SRV connection strings must not include a port number.')
  }
}

function getConnectionHelp(mongoUri) {
  if (mongoUri.startsWith('mongodb+srv://')) {
    return [
      'Atlas checks:',
      'make sure the username and password are URL-encoded,',
      'your current IP address is allowed in Atlas Network Access,',
      'and the database user has read/write access.',
    ].join(' ')
  }

  return [
    'Local MongoDB checks:',
    'start MongoDB on 127.0.0.1:27017',
    'or replace MONGODB_URI with your Atlas connection string.',
  ].join(' ')
}

export async function connectDb() {
  const mongoUri = (process.env.MONGODB_URI || defaultMongoUri).trim()

  validateMongoUri(mongoUri)

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection
  }

  if (mongoose.connection.readyState === 2 && connectionPromise) {
    return connectionPromise
  }

  if (mongoose.connection.readyState === 0) {
    connectionPromise = null
  }

  try {
    connectionPromise ??= mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    })

    await connectionPromise

    console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`)

    return mongoose.connection
  } catch (error) {
    connectionPromise = null
    error.message = [
      `MongoDB connection failed for ${maskMongoUri(mongoUri)}.`,
      getConnectionHelp(mongoUri),
      error.message,
    ].join(' ')

    throw error
  }
}