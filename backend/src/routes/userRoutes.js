import { Router } from 'express'

import { getCurrentUser, getUserById } from '../controllers/userController.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.get('/me', protect, getCurrentUser)
router.get('/:id', getUserById)

export default router