import { type NextFunction, type Request, type Response } from 'express'
import AppError from '../utils/appError'
import { type JWTPayload } from '../services/jwt.service'

export const requireUser = (
  req: Request,
  res: Response,
  next: NextFunction
): undefined => {
  try {
    const user: JWTPayload | null = res.locals.user
    if (user == null) {
      next(new AppError('Invalid token or session has expired', 401)); return
    }

    next()
  } catch (err: any) {
    next(err)
  }
}
