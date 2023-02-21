import express from 'express'
import { loginHandler, refreshTokenHandler, registerHandler } from '../controllers/auth.controller'
import { validate } from '../middleware/validate'
import { registerUserSchema, loginUserSchema, refreshTokenSchema } from '../schemas/user.schema'
import asyncHandler from 'express-async-handler'

const router = express.Router()

// Register user route
router.post('/register', validate(registerUserSchema), asyncHandler(registerHandler))

// Login user route
router.post('/login', validate(loginUserSchema), asyncHandler(loginHandler))

router.post('/refresh', validate(refreshTokenSchema), asyncHandler(refreshTokenHandler))

export default router
