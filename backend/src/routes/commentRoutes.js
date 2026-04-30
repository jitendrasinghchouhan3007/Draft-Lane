import { Router } from 'express'

import { createComment, listCommentsForBlog } from '../controllers/commentController.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.get('/blog/:blogId', listCommentsForBlog)
router.post('/', protect, createComment)

export default router