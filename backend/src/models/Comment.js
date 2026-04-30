import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema(
  {
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 1200,
    },
  },
  {
    timestamps: true,
  },
)

commentSchema.index({ blog: 1, parentComment: 1, createdAt: 1 })

const Comment = mongoose.model('Comment', commentSchema)

export default Comment