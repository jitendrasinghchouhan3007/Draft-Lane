import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'

import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

import Blog from '../src/models/Blog.js'
import Comment from '../src/models/Comment.js'
import User from '../src/models/User.js'
import { seedDemoData } from '../scripts/seed.js'

let mongoServer

before(async () => {
  process.env.NODE_ENV = 'test'
  process.env.JWT_SECRET = 'blog-management-test-secret'

  mongoServer = await MongoMemoryServer.create()
  process.env.MONGODB_URI = mongoServer.getUri()
})

after(async () => {
  await mongoose.connection.close()

  if (mongoServer) {
    await mongoServer.stop()
  }
})

test('demo seed creates direct-login users and 100 blogs', async () => {
  await seedDemoData()

  const [userCount, blogCount, commentCount, adminUser] = await Promise.all([
    User.countDocuments(),
    Blog.countDocuments(),
    Comment.countDocuments(),
    User.findOne({ email: 'admin@example.com' }),
  ])

  assert.equal(userCount, 7)
  assert.equal(blogCount, 100)
  assert.ok(commentCount >= 36)
  assert.equal(adminUser?.role, 'admin')
  assert.notEqual(adminUser?.password, 'password123')
  assert.equal(await adminUser?.comparePassword('password123'), true)

  const sampleBlog = await Blog.findOne({ title: /search inputs/i })

  assert.ok(sampleBlog)
  assert.ok(sampleBlog.content.includes('## Context'))
})