import { omit } from 'lodash'
import { type FilterQuery, type QueryOptions } from 'mongoose'
import config from 'config'
import userModel, { type User } from '../models/user.model'
import { signJwt } from '../utils/jwt'
import { type DocumentType } from '@typegoose/typegoose'

// Exclude this fields from the response
export const excludedFields = ['password']
// CreateUser service
export const createUser = async (input: Partial<User>): Promise<Partial<object>> => {
  const user = await userModel.create(input)
  return omit(user.toJSON(), excludedFields)
}

// Find User by Id
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const findUserById = async (id: string) => {
  const user = await userModel.findById(id).lean()
  return omit(user, excludedFields)
}

// Find All users
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const findAllUsers = async () => {
  const users = await userModel.find().lean()
  return users.map((user) => omit(user, excludedFields))
}

// Find one user by any fields
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const findUser = async (
  query: FilterQuery<User>,
  options: QueryOptions = {}
) => {
  return await userModel.findOne(query, {}, options).select('+password')
}

// Update User
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const updateUser = async (id: string, update: Partial<User>) => {
  return omit(userModel.updateOne({ id }, update).lean(), excludedFields)
}

// Delete User
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const deleteUserById = async (id: string) => {
  return omit(userModel.deleteOne({ id }).lean(), excludedFields)
}

// Sign Token
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const signToken = async (user: DocumentType<User>) => {
  // Sign the access token
  const accessToken = signJwt(
    {
      sub: user._id,
      type: 'access'
    },
    {
      expiresIn: `${config.get<number>('accessTokenExpiresIn')}m`
    }
  )

  const refreshToken = signJwt(
    {
      sub: user._id,
      type: 'refresh'

    },
    {
      expiresIn: `${config.get<number>('refreshTokenExpiresIn')}m`
    }
  )

  // Return access token
  return { accessToken, refreshToken }
}
