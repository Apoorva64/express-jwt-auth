import express from 'express'
import asyncHandler from 'express-async-handler'
import {
  createNewUserHandler,
  deleteUserHandler, getAllUsersHandler,
  getUserByIdHandler,
  putUserHandler
} from '../controllers/user.controller'
import { validate } from '../middleware/validate'
import { createUserSchema, deleteUserSchema, getUserByIdSchema, updateUserSchema } from '../schemas/user.schema'
import { deserializeUser } from '../middleware/deserializeUser'
import { requireUser } from '../middleware/requireUser'

const userRouter = express.Router()

userRouter.use(asyncHandler(deserializeUser), asyncHandler(requireUser))

// Register user route
userRouter.post('/', validate(createUserSchema), asyncHandler(createNewUserHandler))

userRouter.get('/', asyncHandler(getAllUsersHandler))

// get user by id route
userRouter.get('/:id', validate(getUserByIdSchema), asyncHandler(getUserByIdHandler))

// put user by id route
userRouter.put('/:id', validate(updateUserSchema), asyncHandler(putUserHandler))

userRouter.delete('/:id', validate(deleteUserSchema), asyncHandler(deleteUserHandler))
export default userRouter
