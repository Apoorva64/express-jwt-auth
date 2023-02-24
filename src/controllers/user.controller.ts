import { type NextFunction, type Request, type Response } from 'express'
import {
  createUser,
  findAllUsers,
  findUserById,
  patchUser,
  deleteUserById,
  findUser,
  excludedFields
} from '../services/user.service'
import {
  type CreateUserSchema,
  type GetUserByIdSchema,
  type RegisterUserSchema,
  type PatchUserSchema, type ChangeUserPasswordSchema
} from '../schemas/user.schema'
import AppError from '../utils/appError'
import { omit } from 'lodash'

export const getAllUsersHandler = async (
  req: Request<unknown, unknown, RegisterUserSchema['body']>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get users from database
    const users = await findAllUsers()

    // Send the users object
    res.send(users)
  } catch (err: any) {
    next(err)
  }
}

export const getUserByIdHandler = async (
  req: Request<GetUserByIdSchema['params'], unknown, unknown>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Get the ID from the url
  const id = req.params.id
  try {
    // Get the user from database
    const user = await findUserById(id)
    // Send the user object
    res.send(user)
  } catch (err: any) {
    next(err)
  }
}

export const patchUserHandler = async (
  req: Request<PatchUserSchema['params'], unknown, PatchUserSchema['body']>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Get the ID from the url
  const id = req.params.id
  try {
    // Edit the user
    const user = await patchUser(id, omit(req.body, ['password']))
    // Send the user object
    res.send(user)
  } catch (err: any) {
    if (err.code === 11000) {
      res.status(409).json({
        status: 'fail',
        message: 'Email already exist'
      })
      return
    }
    next(err)
  }
}

export const deleteUserHandler = async (
  req: Request<GetUserByIdSchema['params'], unknown, unknown>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Get the ID from the url
  const id = req.params.id
  try {
    // Get the user from database
    const user = await deleteUserById(id)
    // Send the user object
    res.send(user)
  } catch (err: any) {
    next(err)
  }
}

export const createNewUserHandler = async (
  req: Request<unknown, unknown, CreateUserSchema['body']>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await createUser({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      role: req.body.role
    })

    res.send(user)
  } catch (err: any) {
    if (err.code === 11000) {
      res.status(409).json({
        status: 'fail',
        message: 'Email already exist'
      })
      return
    }
    next(err)
  }
}

export const changeUserPasswordHandler = async (
  req: Request<unknown, unknown, ChangeUserPasswordSchema['body']>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // verify old password
    const user = await findUser({ _id: res.locals.user.sub })
    if (user == null) {
      next(new AppError('User with that token no longer exist', 401))
      return
    }
    if (!(await user.comparePasswords(user.password, req.body.currentPassword))) {
      next(new AppError('Old password is incorrect', 401))
      return
    }
    // change password
    user.password = req.body.newPassword
    const updatedUser = omit((await user.save()).toJSON(), excludedFields)
    res.send(updatedUser)
  } catch (err: any) {
    next(err)
  }
}
