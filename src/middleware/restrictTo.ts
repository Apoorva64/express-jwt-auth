import { type NextFunction, type Request, type Response } from 'express'
import AppError from '../utils/appError'
import { type JWTPayload } from '../services/jwt.service'

export const restrictTo =
    (...allowedRoles: string[]) =>
      (req: Request, res: Response, next: NextFunction) => {
        const user: JWTPayload = res.locals.user
        if (!allowedRoles.includes(user.role)) {
          next(new AppError('You are not allowed to perform this action', 403))
          return
        }
        next()
      }
export const restrictToOrIsSelf = (...allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const user: JWTPayload = res.locals.user
    if (!allowedRoles.includes(user.role) && user.sub !== req.params.id) {
      next(new AppError('You are not allowed to perform this action', 403))
      return
    }
    next()
  }
