import assert from 'node:assert/strict'
import { after, before, beforeEach, test } from 'node:test'

import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import request from 'supertest'

import app from '../src/app.js'
import { connectDb } from '../src/config/db.js'
import Blog from '../src/models/Blog.js'
import Comment from '../src/models/Comment.js'
import User from '../src/models/User.js'

let mongoServer

before(async () => {
  process.env.NODE_ENV = 'test'
  process.env.JWT_SECRET = 'blog-management-test-secret'

  mongoServer = await MongoMemoryServer.create()
  process.env.MONGODB_URI = mongoServer.getUri()

  await connectDb()
})

beforeEach(async () => {
  await Promise.all([Comment.deleteMany({}), Blog.deleteMany({}), User.deleteMany({})])
})

after(async () => {
  await mongoose.connection.close()

  if (mongoServer) {
    await mongoServer.stop()
  }
})

test('JWT auth protects blog creation and limits blog management to the author or an admin', async () => {
  const registerResponse = await request(app).post('/api/auth/register').send({
    name: 'Test Author',
    email: 'author@example.com',
    password: 'password123',
    bio: 'Writes tests before lunch.',
  })

  assert.equal(registerResponse.statusCode, 201)
  assert.ok(registerResponse.body.token)
  assert.equal(registerResponse.body.user.email, 'author@example.com')
  assert.equal(registerResponse.body.user.role, 'user')

  const token = registerResponse.body.token

  const meResponse = await request(app)
    .get('/api/users/me')
    .set('Authorization', `Bearer ${token}`)

  assert.equal(meResponse.statusCode, 200)
  assert.equal(meResponse.body.user.name, 'Test Author')

  const unauthorizedCreateResponse = await request(app).post('/api/blogs').send({
    title: 'Unauthorized draft',
    content: 'This should never be created because no token is attached at all.',
  })

  assert.equal(unauthorizedCreateResponse.statusCode, 401)

  const createResponse = await request(app)
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Protected post',
      content: 'This post should be created because the request is using a valid JWT token.',
      tags: 'testing, auth',
    })

  assert.equal(createResponse.statusCode, 201)
  assert.equal(createResponse.body.blog.title, 'Protected post')

  const loginResponse = await request(app).post('/api/auth/login').send({
    email: 'author@example.com',
    password: 'password123',
  })

  assert.equal(loginResponse.statusCode, 200)
  assert.ok(loginResponse.body.token)

  const secondUserResponse = await request(app).post('/api/auth/register').send({
    name: 'Second Author',
    email: 'second@example.com',
    password: 'password123',
  })

  const adminUser = await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
  })

  assert.equal(adminUser.role, 'admin')

  const adminLoginResponse = await request(app).post('/api/auth/login').send({
    email: 'admin@example.com',
    password: 'password123',
  })

  assert.equal(adminLoginResponse.statusCode, 200)
  assert.equal(adminLoginResponse.body.user.role, 'admin')

  const blockedUpdateResponse = await request(app)
    .put(`/api/blogs/${createResponse.body.blog.id}`)
    .set('Authorization', `Bearer ${secondUserResponse.body.token}`)
    .send({
      title: 'Hijacked post',
      content: 'This update should be rejected because the second author does not own the blog post.',
      tags: 'testing',
    })

  assert.equal(blockedUpdateResponse.statusCode, 403)

  const allowedUpdateResponse = await request(app)
    .put(`/api/blogs/${createResponse.body.blog.id}`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Protected post updated',
      content: 'The original author can update the post successfully using the same JWT-based identity.',
      tags: 'testing, auth',
    })

  assert.equal(allowedUpdateResponse.statusCode, 200)
  assert.equal(allowedUpdateResponse.body.blog.title, 'Protected post updated')

  const adminUpdateResponse = await request(app)
    .put(`/api/blogs/${createResponse.body.blog.id}`)
    .set('Authorization', `Bearer ${adminLoginResponse.body.token}`)
    .send({
      title: 'Admin revised title',
      content: 'An administrator can also update the blog because the role carries broader editorial access.',
      tags: 'testing, admin',
    })

  assert.equal(adminUpdateResponse.statusCode, 200)
  assert.equal(adminUpdateResponse.body.blog.title, 'Admin revised title')

  const adminDeleteResponse = await request(app)
    .delete(`/api/blogs/${createResponse.body.blog.id}`)
    .set('Authorization', `Bearer ${adminLoginResponse.body.token}`)

  assert.equal(adminDeleteResponse.statusCode, 200)

  const removedBlogResponse = await request(app).get(`/api/blogs/${createResponse.body.blog.id}`)

  assert.equal(removedBlogResponse.statusCode, 404)
})