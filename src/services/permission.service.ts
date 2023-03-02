import { type FilterQuery, type QueryOptions } from 'mongoose'
import permissionModel, { type Permission } from '../models/permission.model'

export const createPermission = async (input: Partial<Permission>): Promise<Partial<object>> => {
  const permission = await permissionModel.create(input)
  return permission.toJSON()
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const findPermissionById = async (id: string) => {
  return (await permissionModel.findById(id).lean())
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const findAllPermissions = async () => {
  return (await permissionModel.find().lean())
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const findPermission = async (
  query: FilterQuery<Permission>,
  options: QueryOptions = {}
) => {
  return (await permissionModel.find(query, {}, options))
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const findOnePermission = async (
  query: FilterQuery<Permission>,
  options: QueryOptions = {}
) => {
  return (await permissionModel.findOne(query, {}, options))
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const patchPermission = async (_id: string, update: Partial<Permission>) => {
  return (await permissionModel.updateOne({ _id }, [{ $set: update }]).lean())
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const deletePermissionById = async (_id: string) => {
  return (await permissionModel.deleteOne({ _id }).lean())
}
