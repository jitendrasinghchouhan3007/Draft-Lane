import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { pathToFileURL } from 'node:url'

import { buildDemoBlogs, buildDemoCommentThreads, demoLoginAccounts, demoUsers } from '../../db/demoData.js'
import { connectDb } from '../src/config/db.js'
import Blog from '../src/models/Blog.js'
import Comment from '../src/models/Comment.js'
import User from '../src/models/User.js'
import { getExcerpt } from '../src/utils/text.js'

dotenv.config()

export async function seedDemoData() {
  await connectDb()

  await Promise.all([
    Comment.deleteMany({}),
    Blog.deleteMany({}),
    User.deleteMany({}),
  ])

  const createdUsers = []

  for (const userPayload of demoUsers) {
    const createdUser = new User(userPayload)
    await createdUser.save()
    createdUsers.push(createdUser)
  }

  const usersByEmail = new Map(createdUsers.map((user) => [user.email, user]))

  const blogPayloads = buildDemoBlogs(usersByEmail).map((blog) => ({
    ...blog,
    excerpt: getExcerpt(blog.content),
  }))

  const createdBlogs = await Blog.create(blogPayloads)
  const commentThreads = buildDemoCommentThreads(createdBlogs, usersByEmail)
  let totalComments = 0

  for (const thread of commentThreads) {
    const topLevelComments = []

    for (const comment of thread.topLevelComments) {
      const createdComment = await Comment.create({
        blog: thread.blogId,
        author: comment.author,
        content: comment.content,
      })

      topLevelComments.push(createdComment)
      totalComments += 1
    }

    for (const reply of thread.replies) {
      await Comment.create({
        blog: thread.blogId,
        author: reply.author,
        parentComment: topLevelComments[reply.replyToIndex]?._id || null,
        content: reply.content,
      })

      totalComments += 1
    }
  }

  console.log('Demo data created successfully.')
  console.log(`Users: ${createdUsers.length}`)
  console.log(`Blogs: ${createdBlogs.length}`)
  console.log(`Comments: ${totalComments}`)
  console.log('Login with any of the following accounts:')

  for (const account of demoLoginAccounts) {
    console.log(`- ${account.name} (${account.role}) -> ${account.email} / ${account.password}`)
  }
}

async function runSeedScript() {
  try {
    await seedDemoData()
  } catch (error) {
    console.error('Seeding failed')
    console.error(error)
    process.exitCode = 1
  } finally {
    await mongoose.connection.close()
  }
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href

if (isDirectRun) {
  runSeedScript()
}