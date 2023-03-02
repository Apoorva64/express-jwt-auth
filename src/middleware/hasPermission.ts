import { type NextFunction, type Request, type Response } from 'express'
import AppError from '../utils/appError'
import { type JWTPayload } from '../services/jwt.service'
function validatePermission (permission: string, jwt: JWTPayload, req: Request): boolean {
  if (permission.startsWith('AuthSelf')) {
    return jwt.sub === req.params.id && jwt.permissions.includes(permission)
  }
  return jwt.permissions.includes(permission)
}
export const hasPermission =
    (enforceAll = false, ...allowedPermission: string[]) =>
      (req: Request, res: Response, next: NextFunction) => {
        const user: JWTPayload = res.locals.user
        if (enforceAll) {
          if (!allowedPermission.every((permission) => validatePermission(permission, user, req))) {
            next(new AppError('You are not allowed to perform this action', 403))
            return
          }
        } else {
          if (!allowedPermission.some((permission) => validatePermission(permission, user, req))) {
            next(new AppError('You are not allowed to perform this action', 403))
            return
          }
        }
        next()
      }
