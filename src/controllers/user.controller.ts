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
  type PatchUserSchema, type ChangeUserPasswordSchema
} from '../schemas/user.schema'
import AppError from '../utils/appError'
import { omit } from 'lodash'
import { findPermission } from '../services/permission.service'
import { type JWTPayload } from '../services/jwt.service'

export const getAllUsersHandler = async (
  req: Request<unknown, unknown, unknown>,
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
  const jwtPayload: JWTPayload = res.locals.user
  let permissions = []
  try {
    if (req.body.permissions != null) {
      if (!jwtPayload.permissions.includes('AuthEditUserPermissions')) {
        res.status(403).json({
          status: 'fail',
          message: 'You are not allowed to change user permissions'
        })
        return
      } else {
        // hydrate body permissions with object id
        permissions = (await findPermission({ title: { $in: req.body.permissions } }))?.map((permission) => permission._id)
      }
    }
    let user
    if (permissions.length > 0) {
      user = await patchUser(id, {
        email: req.body.email,
        username: req.body.username,
        permissions
      })
    } else {
      user = await patchUser(id, {
        email: req.body.email,
        username: req.body.username
      })
    }
    // Edit the user
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
      permissions: (await findPermission({ title: { $in: req.body.permissions } }))?.map((permission) => permission._id)

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
