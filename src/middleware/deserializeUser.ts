import { type NextFunction, type Request, type Response } from 'express'
import { findUserById } from '../services/user.service'
import AppError from '../utils/appError'
import { verifyJwt } from '../utils/jwt'
import { type JWTPayload } from '../services/jwt.service'

export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get the token
    let accessToken: string | null = null
    if ((req.headers.authorization?.startsWith('Bearer')) === true) {
      accessToken = req.headers.authorization.split(' ')[1]
    } else if (req.cookies.access_token != null) {
      accessToken = req.cookies.access_token
    }

    if (accessToken == null) {
      next(new AppError('You are not logged in', 401)); return
    }

    // Validate Access Token
    const decoded = verifyJwt<JWTPayload>(accessToken)

    if (decoded == null) {
      next(new AppError('Invalid token or user doesn\'t exist', 401)); return
    }

    // Check if user still exist
    const user = await findUserById(decoded.sub)

    if (user == null) {
      next(new AppError('User with that token no longer exist', 401)); return
    }

    // This is really important (Helps us know if the user is logged in from other controllers)
    // You can do: (req.user or res.locals.user)
    res.locals.user = decoded

    next()
  } catch (err: any) {
    next(err)
  }
}
