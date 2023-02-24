import express from 'express'
import asyncHandler from 'express-async-handler'
import {
  changeUserPasswordHandler,
  createNewUserHandler,
  deleteUserHandler, getAllUsersHandler,
  getUserByIdHandler,
  patchUserHandler
} from '../controllers/user.controller'
import { validate } from '../middleware/validate'
import {
  changeUserPasswordSchema,
  createUserSchema,
  deleteUserSchema,
  getUserByIdSchema,
  patchUserSchema
} from '../schemas/user.schema'
import { deserializeUser } from '../middleware/deserializeUser'
import { requireUser } from '../middleware/requireUser'
import { restrictTo, restrictToOrIsSelf } from '../middleware/restrictTo'
import config from 'config'

const userRouter = express.Router()

userRouter.use(asyncHandler(deserializeUser), asyncHandler(requireUser))

// Register user route
userRouter.post('/',
  validate(createUserSchema),
  asyncHandler(restrictTo(config.get<string>('superAdminRole'))),
  asyncHandler(createNewUserHandler))

userRouter.get('/',
  asyncHandler(restrictTo(config.get<string>('superAdminRole'))),
  asyncHandler(getAllUsersHandler))

// get user by id route
userRouter.get('/:id', validate(getUserByIdSchema),
  asyncHandler(restrictToOrIsSelf(config.get<string>('superAdminRole'))),
  asyncHandler(getUserByIdHandler))

// put user by id route
userRouter.patch('/:id', validate(patchUserSchema),
  asyncHandler(restrictToOrIsSelf(config.get<string>('superAdminRole'))),
  asyncHandler(patchUserHandler))

// delete user by id route
userRouter.delete('/:id', validate(deleteUserSchema),
  asyncHandler(restrictToOrIsSelf(config.get<string>('superAdminRole'))),
  asyncHandler(deleteUserHandler))

// change password route
userRouter.post('/:id/change-password', validate(changeUserPasswordSchema),
  asyncHandler(restrictToOrIsSelf(config.get<string>('superAdminRole'))),
  asyncHandler(changeUserPasswordHandler))
export default userRouter
