import { type NextFunction, type Request, type Response } from 'express'
import { createUser, findAllUsers, findUserById, updateUser, deleteUserById } from '../services/user.service'
import {
  type CreateUserSchema,
  type GetUserByIdSchema,
  type RegisterUserSchema,
  type UpdateUserSchema
} from '../schemas/user.schema'

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

export const putUserHandler = async (
  req: Request<UpdateUserSchema['params'], unknown, UpdateUserSchema['body']>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Get the ID from the url
  const id = req.params.id
  try {
    // Edit the user
    const user = await updateUser(id, req.body)
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
