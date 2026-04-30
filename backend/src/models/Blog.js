import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 160,
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: 220,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 30,
    },
    tags: {
      type: [String],
      default: [],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
  },
  {
    timestamps: true,
  },
)

blogSchema.index({ title: 'text', content: 'text' })
blogSchema.index({ tags: 1 })

const Blog = mongoose.model('Blog', blogSchema)

export default Blog