import config from 'config'
import { type CookieOptions, type NextFunction, type Request, type Response } from 'express'
import { type RegisterUserSchema, type LoginUserSchema, type RefreshTokenSchema } from '../schemas/user.schema'
import { createUser, findUser, signToken } from '../services/user.service'
import AppError from '../utils/appError'
import { verifyJwt } from '../utils/jwt'

// Cookie options
const accessTokenCookieOptions: CookieOptions = {
  expires: new Date(
    Date.now() + config.get<number>('accessTokenExpiresIn') * 60 * 1000
  ),
  maxAge: config.get<number>('accessTokenExpiresIn') * 60 * 1000,
  httpOnly: true,
  sameSite: 'lax'
}

const refreshTokenCookieOptions: CookieOptions = {
  expires: new Date(
    Date.now() + config.get<number>('refreshTokenExpiresIn') * 60 * 1000
  ),
  maxAge: config.get<number>('refreshTokenExpiresIn') * 60 * 1000,
  httpOnly: true,
  sameSite: 'lax'
}

// Only set secure to true in production
if (process.env.NODE_ENV === 'production') {
  accessTokenCookieOptions.secure = true
}

export const registerHandler = async (
  req: Request<unknown, unknown, RegisterUserSchema['body']>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await createUser({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
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

export const loginHandler = async (
  req: Request<unknown, unknown, LoginUserSchema['body']>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get the user from the collection
    const user = await findUser({ email: req.body.email })

    // Check if user exist and password is correct
    if (
      (user == null) ||
            !(await user.comparePasswords(user.password, req.body.password))
    ) {
      next(new AppError('Invalid email or password', 401))
      return
    }

    // Create an Access Token
    const { accessToken, refreshToken } = await signToken(user)

    // Send Access Token in Cookie
    res.cookie('accessToken', accessToken, accessTokenCookieOptions)
    res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions)

    res.cookie('logged_in', true, {
      ...accessTokenCookieOptions,
      httpOnly: false
    })

    // Send Access Token
    res.status(200).json({
      accessToken,
      refreshToken
    })
  } catch (err: any) {
    next(err)
  }
}

export const refreshTokenHandler = async (
  req: Request<unknown, unknown, RefreshTokenSchema['body']>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // verify the refresh token
    const decoded = verifyJwt<{ sub: string, exp: string }>(req.body.refreshToken)
    console.log(decoded)

    if (decoded == null) {
      next(new AppError('Invalid refresh token', 401))
      return
    }
    console.log(decoded.exp)
    console.log(Date.now() / 1000)
    // check if the user still exist
    const user = await findUser({ id: decoded.sub })

    if (user == null) {
      next(new AppError('User does not exist', 401))
      return
    }
    // regenerate the access token and refresh token
    const { accessToken, refreshToken } = await signToken(user)

    // Send Access Token in Cookie
    res.cookie('accessToken', accessToken, accessTokenCookieOptions)
    res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions)

    res.cookie('logged_in', true, {
      ...accessTokenCookieOptions,
      httpOnly: false
    })

    // Send Access Token
    res.status(200).json({
      accessToken,
      refreshToken
    })
  } catch (err: any) {
    next(err)
  }
}
