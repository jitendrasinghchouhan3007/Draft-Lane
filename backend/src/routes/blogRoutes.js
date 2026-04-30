import { Router } from 'express'

import {
  createBlog,
  deleteBlog,
  getBlogById,
  listBlogs,
  toggleLike,
  updateBlog,
} from '../controllers/blogController.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.route('/').get(listBlogs).post(protect, createBlog)
router.patch('/:id/like', protect, toggleLike)
router.route('/:id').get(getBlogById).put(protect, updateBlog).delete(protect, deleteBlog)

export default router