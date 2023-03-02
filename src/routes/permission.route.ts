import { deserializeUser } from '../middleware/deserializeUser'
import { requireUser } from '../middleware/requireUser'
import { hasPermission } from '../middleware/hasPermission'
import { validate } from '../middleware/validate'
import express from 'express'
import asyncHandler from 'express-async-handler'
import {
  createPermissionHandler,
  deletePermissionHandler,
  getAllPermissionsHandler,
  getPermissionByIdHandler,
  patchPermissionHandler
} from '../controllers/permission.controller'
import { deletePermissionSchema, getPermissionByIdSchema, patchPermissionSchema } from '../schemas/permission.schema'

const permissionRouter = express.Router()

permissionRouter.use(asyncHandler(deserializeUser), asyncHandler(requireUser))

permissionRouter.get('/',
  asyncHandler(hasPermission(false, 'AuthReadPermission')),
  asyncHandler(getAllPermissionsHandler))

permissionRouter.get('/:id',
  validate(getPermissionByIdSchema),
  asyncHandler(hasPermission(false, 'AuthReadPermission')),
  asyncHandler(getPermissionByIdHandler))

permissionRouter.post('/',
  asyncHandler(hasPermission(false, 'AuthCreatePermission')),
  asyncHandler(createPermissionHandler))

permissionRouter.patch('/:id',
  validate(patchPermissionSchema),
  asyncHandler(hasPermission(false, 'AuthUpdatePermission')),
  asyncHandler(patchPermissionHandler))

permissionRouter.delete('/:id',
  validate(deletePermissionSchema),
  asyncHandler(hasPermission(false, 'AuthDeletePermission')),
  asyncHandler(deletePermissionHandler))

export default permissionRouter
