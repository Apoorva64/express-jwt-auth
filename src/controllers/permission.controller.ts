import { type NextFunction, type Request, type Response } from 'express'

import {
  createPermission,
  deletePermissionById,
  findAllPermissions,
  findPermissionById,
  patchPermission
} from '../services/permission.service'
import { type CreatePermissionSchema, type GetPermissionByIdSchema } from '../schemas/permission.schema'

export const getAllPermissionsHandler = async (
  req: Request<unknown, unknown, unknown>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const permissions = await findAllPermissions()
    res.send(permissions)
  } catch (err: any) {
    next(err)
  }
}

export const getPermissionByIdHandler = async (
  req: Request<GetPermissionByIdSchema['params'], unknown, unknown>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const permission = await findPermissionById(req.params.id)
    res.send(permission)
  } catch (err: any) {
    next(err)
  }
}

export const createPermissionHandler = async (
  req: Request<unknown, unknown, CreatePermissionSchema['body']>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.send(await createPermission(req.body))
  } catch (err: any) {
    next(err)
  }
}

export const patchPermissionHandler = async (
  req: Request<GetPermissionByIdSchema['params'], unknown, CreatePermissionSchema['body']>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.send(await patchPermission(req.params.id, req.body))
  } catch (err: any) {
    next(err)
  }
}

export const deletePermissionHandler = async (
  req: Request<GetPermissionByIdSchema['params'], unknown, unknown>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.send(await deletePermissionById(req.params.id))
  } catch (err: any) {
    next(err)
  }
}
