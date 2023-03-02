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
import { hasPermission } from '../middleware/hasPermission'

const userRouter = express.Router()

userRouter.use(asyncHandler(deserializeUser), asyncHandler(requireUser))

// Register user route
userRouter.post('/',
  validate(createUserSchema),
  asyncHandler(hasPermission(false, 'AuthCreateUser')),
  asyncHandler(createNewUserHandler))

userRouter.get('/',
  asyncHandler(hasPermission(false, 'AuthReadUser')),
  asyncHandler(getAllUsersHandler))

// get user by id route
userRouter.get('/:id', validate(getUserByIdSchema),
  asyncHandler(hasPermission(false, 'AuthReadUser', 'AuthSelfReadUser')),
  asyncHandler(getUserByIdHandler))

// put user by id route
userRouter.patch('/:id', validate(patchUserSchema),
  asyncHandler(hasPermission(false, 'AuthUpdateUser', 'AuthSelfUpdateUser')),
  asyncHandler(patchUserHandler))

// delete user by id route
userRouter.delete('/:id', validate(deleteUserSchema),
  asyncHandler(hasPermission(false, 'AuthDeleteUser', 'AuthSelfDeleteUser')),
  asyncHandler(deleteUserHandler))

// change password route
userRouter.post('/:id/change-password', validate(changeUserPasswordSchema),
  asyncHandler(hasPermission(false, 'AuthChangePassword', 'AuthSelfChangePassword')),
  asyncHandler(changeUserPasswordHandler))
export default userRouter
