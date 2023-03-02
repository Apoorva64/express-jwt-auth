import { omit } from 'lodash'
import { type FilterQuery, type QueryOptions } from 'mongoose'
import userModel, { type User } from '../models/user.model'

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
  return (await userModel.findOne(query, {}, options).select('+password'))
}

// Update User
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const patchUser = async (_id: string, update: Partial<User>) => {
  return omit(userModel.updateOne({ _id }, [{ $set: update }]).lean(), excludedFields)
}

// Delete User
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const deleteUserById = async (_id: string) => {
  return omit(userModel.deleteOne({ _id }).lean(), excludedFields)
}
