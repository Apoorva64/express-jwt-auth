import { type DocumentType } from '@typegoose/typegoose'
import { type User } from '../models/user.model'
import { signJwt } from '../utils/jwt'
import config from 'config'

export interface JWTPayload extends Record<string, unknown> {
  sub: string
  type: string
  role: string
}

// Sign Token
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const signToken = async (user: DocumentType<User>) => {
  const payload: JWTPayload = {
    sub: user._id,
    type: 'access',
    role: user.role
  }
  // Sign the access token
  const accessToken = signJwt(
    payload,
    {
      expiresIn: `${config.get<number>('accessTokenExpiresIn')}m`
    }
  )

  const refreshToken = signJwt(
    payload,
    {
      expiresIn: `${config.get<number>('refreshTokenExpiresIn')}m`
    }
  )

  // Return access token
  return { accessToken, refreshToken }
}
